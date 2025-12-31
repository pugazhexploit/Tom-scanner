import { pgTable, text, serial, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const documents = pgTable("documents", {
  id: serial("id").primaryKey(),
  filename: text("filename").notNull(),
  originalPath: text("original_path").notNull(),
  convertedPath: text("converted_path"),
  extractedText: text("extracted_text"),
  status: text("status", { enum: ["pending", "processing", "completed", "failed"] }).default("pending").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertDocumentSchema = createInsertSchema(documents).omit({ 
  id: true, 
  createdAt: true,
  convertedPath: true,
  extractedText: true,
  status: true 
});

export type Document = typeof documents.$inferSelect;
export type InsertDocument = z.infer<typeof insertDocumentSchema>;

export type DocumentResponse = Document;
