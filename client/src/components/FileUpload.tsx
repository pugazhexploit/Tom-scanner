import { useCallback, useState } from "react";
import { Upload, File as FileIcon, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  onUpload: (file: File) => void;
  isUploading: boolean;
}

export function FileUpload({ onUpload, isUploading }: FileUploadProps) {
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setError(null);
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      // Basic client-side validation
      if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
        setError("Please upload an image file (JPG, PNG) or PDF.");
        return;
      }
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        setError("File size exceeds 10MB limit.");
        return;
      }
      onUpload(file);
    }
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({ 
    onDrop,
    maxFiles: 1,
    disabled: isUploading,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.tiff'],
      'application/pdf': ['.pdf']
    }
  });

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        {...getRootProps()}
        className={cn(
          "relative group cursor-pointer overflow-hidden rounded-2xl border-2 border-dashed transition-all duration-300 ease-out",
          isDragActive 
            ? "border-primary bg-primary/5 scale-[1.02]" 
            : "border-border hover:border-primary/50 hover:bg-muted/30",
          isUploading ? "pointer-events-none opacity-50" : "",
          "bg-white/50 backdrop-blur-sm h-64 flex flex-col items-center justify-center p-8 text-center"
        )}
      >
        <input {...getInputProps()} />
        
        <AnimatePresence mode="wait">
          {isUploading ? (
            <motion.div
              key="uploading"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center gap-4"
            >
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping"></div>
                <div className="relative bg-white p-4 rounded-full shadow-lg">
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-lg font-semibold text-primary">Uploading & Processing...</p>
                <p className="text-sm text-muted-foreground">This usually takes a few seconds.</p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="idle"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                <Upload className="w-8 h-8 text-primary" />
              </div>
              <div>
                <p className="text-lg font-medium text-foreground">
                  {isDragActive ? "Drop your file here" : "Drag & drop your handwritten document"}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Supports JPG, PNG, TIFF, or PDF (Max 10MB)
                </p>
              </div>
              <button className="px-6 py-2 rounded-lg bg-white border border-border shadow-sm text-sm font-medium hover:bg-gray-50 transition-colors">
                Browse Files
              </button>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Decorative corner accents */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-primary/20 rounded-tl-lg m-4" />
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-primary/20 rounded-tr-lg m-4" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-primary/20 rounded-bl-lg m-4" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-primary/20 rounded-br-lg m-4" />
      </div>

      {error && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-4 rounded-xl bg-destructive/5 border border-destructive/20 flex items-center gap-3 text-destructive"
        >
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm font-medium">{error}</p>
        </motion.div>
      )}
    </div>
  );
}
