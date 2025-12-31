import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import multer from "multer";
import path from "path";
import fs from "fs";
import { spawn } from "child_process";

// Setup Multer
const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Create directories if they don't exist
  if (!fs.existsSync("uploads")) fs.mkdirSync("uploads");
  if (!fs.existsSync("converted")) fs.mkdirSync("converted");

  app.get(api.documents.list.path, async (req, res) => {
    const docs = await storage.getDocuments();
    res.json(docs);
  });

  app.get(api.documents.get.path, async (req, res) => {
    const doc = await storage.getDocument(Number(req.params.id));
    if (!doc) {
      return res.status(404).json({ message: "Document not found" });
    }
    res.json(doc);
  });

  app.post(api.documents.upload.path, upload.single("file"), async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    try {
      // Create initial record
      const doc = await storage.createDocument({
        filename: req.file.originalname,
        originalPath: req.file.path,
        status: "pending",
      });

      // Spawn Python process for OCR
      const outputPath = path.join("converted", `doc_${doc.id}.docx`);
      const pythonProcess = spawn("python3", ["server/process_ocr.py", req.file.path, outputPath]);

      let stdoutData = "";
      let stderrData = "";

      pythonProcess.stdout.on("data", (data) => {
        stdoutData += data.toString();
      });

      pythonProcess.stderr.on("data", (data) => {
        stderrData += data.toString();
      });

      pythonProcess.on("close", async (code) => {
        if (code === 0) {
          try {
            const result = JSON.parse(stdoutData);
            if (result.status === "completed") {
              await storage.updateDocumentStatus(doc.id, "completed", result.extractedText, result.convertedPath);
            } else {
              await storage.updateDocumentStatus(doc.id, "failed");
            }
          } catch (e) {
            console.error("Failed to parse Python output:", e, stdoutData);
            await storage.updateDocumentStatus(doc.id, "failed");
          }
        } else {
          console.error("Python process exited with error:", code, stderrData);
          await storage.updateDocumentStatus(doc.id, "failed");
        }
      });

      // Update status to processing
      await storage.updateDocumentStatus(doc.id, "processing");

      res.status(201).json(doc);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get(api.documents.download.path, async (req, res) => {
    const doc = await storage.getDocument(Number(req.params.id));
    if (!doc || !doc.convertedPath) {
      return res.status(404).json({ message: "Document not found or not converted" });
    }
    
    // Check if file exists
    if (!fs.existsSync(doc.convertedPath)) {
        return res.status(404).json({ message: "Converted file missing on disk" });
    }

    res.download(doc.convertedPath, `${doc.filename}.docx`);
  });

  return httpServer;
}
