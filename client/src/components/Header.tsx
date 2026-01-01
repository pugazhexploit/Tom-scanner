import { FileText } from "lucide-react";
import { Link } from "wouter";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
            <FileText className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold font-display leading-tight">Tamil OCR</h1>
            <p className="text-xs text-muted-foreground font-medium tracking-wide">HANDWRITTEN TO WORD</p>
          </div>
        </Link>

        <nav className="flex items-center gap-6">


          <span className="text-sm font-medium text-muted-foreground">
            v1.0.0
          </span>
        </nav>
      </div>
    </header>
  );
}
