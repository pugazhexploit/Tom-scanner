import { useDocument } from "@/hooks/use-documents";
import { Link, useRoute } from "wouter";
import { Header } from "@/components/Header";
import { Loader2, ArrowLeft, Download, FileText, AlertTriangle, CheckCircle2, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { buildUrl, api } from "@shared/routes";

export default function DocumentDetail() {
  const [match, params] = useRoute("/document/:id");
  const id = parseInt(params?.id || "0");
  const { data: document, isLoading, error } = useDocument(id);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (document?.extractedText) {
      navigator.clipboard.writeText(document.extractedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      </div>
    );
  }

  if (error || !document) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
          <div className="w-16 h-16 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Document Not Found</h2>
          <p className="text-muted-foreground mb-6">The document you are looking for does not exist or an error occurred.</p>
          <Link href="/">
            <Button variant="outline">Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const downloadUrl = buildUrl(api.documents.download.path, { id: document.id });

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Documents
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-display font-bold text-foreground mb-2">{document.filename}</h1>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <ClockIcon className="w-4 h-4" />
                  {format(new Date(document.createdAt), "PPP p")}
                </span>
                <span className={cn(
                  "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border",
                  document.status === 'completed' && "bg-emerald-50 text-emerald-700 border-emerald-200",
                  document.status === 'processing' && "bg-blue-50 text-blue-700 border-blue-200",
                  document.status === 'pending' && "bg-amber-50 text-amber-700 border-amber-200",
                  document.status === 'failed' && "bg-red-50 text-red-700 border-red-200",
                )}>
                  {document.status === 'completed' && <CheckCircle2 className="w-3 h-3" />}
                  {document.status === 'processing' && <Loader2 className="w-3 h-3 animate-spin" />}
                  {document.status.toUpperCase()}
                </span>
              </div>
            </div>
            
            {document.status === 'completed' && (
              <a href={downloadUrl} target="_blank" rel="noreferrer">
                <Button className="w-full md:w-auto gap-2 bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20">
                  <Download className="w-4 h-4" />
                  Download Word Document
                </Button>
              </a>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[calc(100vh-250px)] min-h-[500px]">
          {/* Original Preview (Placeholder for MVP, ideally show image) */}
          <div className="flex flex-col h-full bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
            <div className="p-4 border-b border-border bg-muted/30 flex items-center justify-between">
              <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Original File</h3>
            </div>
            <div className="flex-1 bg-muted/10 p-8 flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Preview not available for this file type.</p>
                <p className="text-sm mt-2">{document.filename}</p>
              </div>
            </div>
          </div>

          {/* Extracted Text */}
          <div className="flex flex-col h-full bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
            <div className="p-4 border-b border-border bg-muted/30 flex items-center justify-between">
              <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Extracted Text</h3>
              {document.extractedText && (
                <Button variant="ghost" size="sm" onClick={handleCopy} className="h-8 gap-1.5">
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? "Copied" : "Copy Text"}
                </Button>
              )}
            </div>
            <div className="flex-1 p-6 overflow-auto bg-white">
              {document.status === 'processing' || document.status === 'pending' ? (
                <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                  <Loader2 className="w-8 h-8 animate-spin mb-4 text-primary" />
                  <p>Extracting text from document...</p>
                  <p className="text-sm mt-2 opacity-70">This may take a moment depending on file size.</p>
                </div>
              ) : document.status === 'failed' ? (
                <div className="h-full flex flex-col items-center justify-center text-destructive">
                  <AlertTriangle className="w-8 h-8 mb-4" />
                  <p>Failed to extract text.</p>
                </div>
              ) : document.extractedText ? (
                <div className="prose prose-sm max-w-none font-mono whitespace-pre-wrap text-foreground/90 leading-relaxed">
                  {document.extractedText}
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground italic">
                  No text extracted.
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg 
      className={className} 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}
