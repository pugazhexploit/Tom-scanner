import { db } from "./db";
import { documents, type InsertDocument, type Document } from "@shared/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  getDocuments(): Promise<Document[]>;
  getDocument(id: number): Promise<Document | undefined>;
  createDocument(doc: InsertDocument): Promise<Document>;
  updateDocumentStatus(id: number, status: string, extractedText?: string, convertedPath?: string): Promise<Document>;
}

export class DatabaseStorage implements IStorage {
  async getDocuments(): Promise<Document[]> {
    return await db.select().from(documents).orderBy(documents.createdAt);
  }

  async getDocument(id: number): Promise<Document | undefined> {
    const [doc] = await db.select().from(documents).where(eq(documents.id, id));
    return doc;
  }

  async createDocument(doc: InsertDocument): Promise<Document> {
    const [newDoc] = await db.insert(documents).values(doc).returning();
    return newDoc;
  }

  async updateDocumentStatus(id: number, status: string, extractedText?: string, convertedPath?: string): Promise<Document> {
    const updates: Partial<Document> = { status };
    if (extractedText !== undefined) updates.extractedText = extractedText;
    if (convertedPath !== undefined) updates.convertedPath = convertedPath;

    const [updated] = await db.update(documents)
      .set(updates)
      .where(eq(documents.id, id))
      .returning();
    return updated;
  }
}

export const storage = new DatabaseStorage();
