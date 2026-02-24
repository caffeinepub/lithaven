import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { Menu, X, LogIn, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import ThemeToggle from './ThemeToggle';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const LOGO_PATH = '/assets/Brown_Retro_Book_Store_Logo_20260224_180351_0000-removebg-preview.png';

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { identity, login, clear, loginStatus } = useInternetIdentity();
  const queryClient = useQueryClient();

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
    } else {
      try {
        await login();
      } catch (error: any) {
        console.error('Login error:', error);
        if (error.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img
              src={LOGO_PATH}
              alt="Lit~Heaven open book logo"
              className="h-12 w-auto"
            />
            <span className="font-serif text-2xl font-bold text-foreground">Lit~Heaven</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Books
            </Link>
            <ThemeToggle />
            <Button
              onClick={handleAuth}
              disabled={isLoggingIn}
              variant={isAuthenticated ? 'outline' : 'default'}
              size="sm"
              className="gap-2"
            >
              {isLoggingIn ? (
                'Logging in...'
              ) : isAuthenticated ? (
                <>
                  <LogOut className="h-4 w-4" />
                  Logout
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4" />
                  Login
                </>
              )}
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex items-center gap-2 mb-6">
                  <img
                    src={LOGO_PATH}
                    alt="Lit~Heaven open book logo"
                    className="h-10 w-auto"
                  />
                  <span className="font-serif text-xl font-bold text-foreground">Lit~Heaven</span>
                </div>
                <nav className="flex flex-col space-y-4 mt-2">
                  <Link
                    to="/"
                    className="text-lg font-medium text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Books
                  </Link>
                  <Button
                    onClick={() => {
                      handleAuth();
                      setMobileMenuOpen(false);
                    }}
                    disabled={isLoggingIn}
                    variant={isAuthenticated ? 'outline' : 'default'}
                    className="gap-2 justify-start"
                  >
                    {isLoggingIn ? (
                      'Logging in...'
                    ) : isAuthenticated ? (
                      <>
                        <LogOut className="h-4 w-4" />
                        Logout
                      </>
                    ) : (
                      <>
                        <LogIn className="h-4 w-4" />
                        Login
                      </>
                    )}
                  </Button>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
