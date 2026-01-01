import { documents, type InsertDocument, type Document } from "@shared/schema";

export interface IStorage {
  getDocuments(): Promise<Document[]>;
  getDocument(id: number): Promise<Document | undefined>;
  createDocument(doc: InsertDocument): Promise<Document>;
  updateDocumentStatus(id: number, status: string, extractedText?: string, convertedPath?: string): Promise<Document>;
}

export class MemStorage implements IStorage {
  private documents: Map<number, Document>;
  private currentId: number;

  constructor() {
    this.documents = new Map();
    this.currentId = 1;
  }

  async getDocuments(): Promise<Document[]> {
    return Array.from(this.documents.values()).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getDocument(id: number): Promise<Document | undefined> {
    return this.documents.get(id);
  }

  async createDocument(doc: InsertDocument): Promise<Document> {
    const id = this.currentId++;
    const newDoc: Document = {
      ...doc,
      id,
      status: "pending",
      createdAt: new Date(),
      convertedPath: null,
      extractedText: null
    };
    this.documents.set(id, newDoc);
    return newDoc;
  }

  async updateDocumentStatus(id: number, status: string, extractedText?: string, convertedPath?: string): Promise<Document> {
    const doc = this.documents.get(id);
    if (!doc) throw new Error("Document not found");

    const updatedDoc = { ...doc, status };
    if (extractedText !== undefined) updatedDoc.extractedText = extractedText;
    if (convertedPath !== undefined) updatedDoc.convertedPath = convertedPath;

    this.documents.set(id, updatedDoc);
    return updatedDoc;
  }
}

export const storage = new MemStorage();
