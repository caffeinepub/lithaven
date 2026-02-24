import { Heart } from 'lucide-react';

const LOGO_PATH = '/assets/Brown_Retro_Book_Store_Logo_20260224_180351_0000-removebg-preview.png';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const appIdentifier = encodeURIComponent(window.location.hostname || 'lit-heaven');

  return (
    <footer className="border-t border-border/40 bg-muted/30 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <img
              src={LOGO_PATH}
              alt="Lit~Heaven open book logo"
              className="h-8 w-auto"
            />
            <span className="text-sm text-muted-foreground">© {currentYear} Lit~Heaven. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Built with</span>
            <Heart className="h-4 w-4 text-red-500 fill-red-500" />
            <span>using</span>
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appIdentifier}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground hover:underline"
            >
              caffeine.ai
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
