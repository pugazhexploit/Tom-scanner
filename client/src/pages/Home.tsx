import { useDocuments, useUploadDocument } from "@/hooks/use-documents";
import { FileUpload } from "@/components/FileUpload";
import { DocumentCard } from "@/components/DocumentCard";
import { Header } from "@/components/Header";
import { motion } from "framer-motion";
import { Loader2, ArrowRight } from "lucide-react";

export default function Home() {
  const { data: documents, isLoading } = useDocuments();
  const { mutate: upload, isPending: isUploading } = useUploadDocument();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-12 space-y-16">

        {/* Hero Section */}
        <section className="text-center space-y-6 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
              Advanced Tamil OCR Engine
            </span>
            <h1 className="text-4xl md:text-6xl font-display font-bold text-foreground leading-tight">
              Convert Handwritten Tamil <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                to Editable Word
              </span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            Upload your scanned handwritten documents and let our AI-powered engine extract the text with high accuracy.
          </motion.p>
        </section>

        {/* Upload Section */}
        <section>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="p-1 rounded-3xl bg-gradient-to-b from-white to-white/50 shadow-2xl shadow-primary/5"
          >
            <FileUpload onUpload={upload} isUploading={isUploading} />
          </motion.div>
        </section>

        {/* Recent Documents Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-border/50 pb-4">
            <h2 className="text-2xl font-display font-semibold">Recent Documents</h2>
            <div className="text-sm text-muted-foreground">
              {documents?.length || 0} files processed
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 text-muted-foreground animate-spin" />
            </div>
          ) : documents && documents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {documents.map((doc, i) => (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <DocumentCard document={doc} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-muted/20 rounded-2xl border border-dashed border-border">
              <p className="text-muted-foreground">No documents uploaded yet.</p>
            </div>
          )}
        </section>
      </main>

      <footer className="py-8 border-t border-border/40 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Tamil OCR System. All rights reserved.</p>
        <p className="mt-2 text-xs opacity-70">Developed by Pugazhenthi</p>
      </footer>
    </div>
  );
}
