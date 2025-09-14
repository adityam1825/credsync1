import { ShieldCheck } from 'lucide-react';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="h-8 w-8 text-primary" />
          <div className="flex flex-col">
            <span className="font-bold text-xl tracking-tight">CredenSync</span>
            <p className="text-xs text-muted-foreground">Syncing credibility with AI.</p>
          </div>
        </div>
      </div>
    </header>
  );
}
