import { FileText, Download, Clock, AlertCircle, CheckCircle2, FileType } from "lucide-react";
import { type DocumentResponse } from "@shared/routes";
import { formatDistanceToNow } from "date-fns";
import { Link } from "wouter";
import { cn } from "@/lib/utils";

interface DocumentCardProps {
  document: DocumentResponse;
}

export function DocumentCard({ document }: DocumentCardProps) {
  const statusConfig = {
    pending: {
      icon: Clock,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
      label: "Queued"
    },
    processing: {
      icon: Clock,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
      label: "Processing"
    },
    completed: {
      icon: CheckCircle2,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
      label: "Completed"
    },
    failed: {
      icon: AlertCircle,
      color: "text-red-500",
      bg: "bg-red-500/10",
      border: "border-red-500/20",
      label: "Failed"
    }
  };

  const config = statusConfig[document.status as keyof typeof statusConfig];
  const StatusIcon = config.icon;

  return (
    <Link href={`/document/${document.id}`} className="block group">
      <div className="relative bg-card hover:bg-accent/5 rounded-xl border border-border p-5 transition-all duration-300 hover:shadow-lg hover:border-primary/20">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center shrink-0 transition-colors", config.bg)}>
              <FileType className={cn("w-6 h-6", config.color)} />
            </div>
            <div className="space-y-1 min-w-0">
              <h3 className="font-semibold text-foreground truncate max-w-[200px] sm:max-w-xs group-hover:text-primary transition-colors">
                {document.filename}
              </h3>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{formatDistanceToNow(new Date(document.createdAt), { addSuffix: true })}</span>
                <span>•</span>
                <span className={cn("font-medium", config.color)}>{config.label}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {document.status === 'completed' && (
              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <Download className="w-4 h-4" />
              </div>
            )}
          </div>
        </div>
        
        {/* Progress bar for processing state */}
        {document.status === 'processing' && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted overflow-hidden rounded-b-xl">
            <div className="h-full bg-primary/50 animate-progress w-full origin-left" />
          </div>
        )}
      </div>
    </Link>
  );
}
