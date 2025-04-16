
import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';
import LoginButton from './LoginButton';
import { useAuth } from '@/context/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Languages } from 'lucide-react';
import { useTranslation } from 'react-i18next'; 

const Navbar = () => {
  const { t, i18n } = useTranslation(); 
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === '/';
  // Get user and profileAvatarUrl from context
  const { user, signOut, profileAvatarUrl } = useAuth(); 

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setIsMobileMenuOpen(false); 
  };

  const navbarClasses = `
    fixed top-0 left-0 right-0 z-50 px-6 py-4 transition-all duration-300
    ${isScrolled ? 'glass py-3' : 'bg-transparent py-4'}
  `;

  const scrollToSection = (id: string) => {
    setIsMobileMenuOpen(false);
    if (isHomePage) {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(`/#${id}`);
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100); 
    }
  };

  // Use metadata full_name for display name, fallback to email
  const displayName = user?.user_metadata?.full_name || user?.email || "User";

  return (
    <nav className={navbarClasses}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2" onClick={() => setIsMobileMenuOpen(false)}>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
            <span className="font-display font-bold text-2xl">{t('appName')}</span>
          </motion.div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6"> 
          <div className="flex items-center space-x-4"> 
            <NavItem onClick={() => scrollToSection('hero')}>{t('nav.home')}</NavItem>
            <NavItem onClick={() => scrollToSection('communities')}>{t('nav.communities')}</NavItem>
          </div>

          {/* Language Selector Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="flex items-center gap-1">
                <Languages className="h-4 w-4" />
                <span>{i18n.resolvedLanguage?.toUpperCase()}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={() => changeLanguage('en')} disabled={i18n.resolvedLanguage === 'en'}>
                English
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => changeLanguage('ru')} disabled={i18n.resolvedLanguage === 'ru'}>
                Русский
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => changeLanguage('hi')} disabled={i18n.resolvedLanguage === 'hi'}>
                हिन्दी
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="flex items-center space-x-3">
            {user ? (
              <Button 
                variant="ghost" 
                className="rounded-full h-10 w-10 p-0" 
                onClick={() => navigate('/dashboard')} 
                aria-label={t('nav.dashboard', 'Dashboard')} 
              >
                <Avatar>
                  {/* Use profileAvatarUrl from context */}
                  <AvatarImage src={profileAvatarUrl ?? undefined} alt={displayName} /> 
                  <AvatarFallback>{(displayName[0] || "U").toUpperCase()}</AvatarFallback>
                </Avatar>
              </Button>
            ) : (
              <LoginButton />
            )}
          </div>
        </div>

        {/* Mobile: Language Selector + Menu Button */} 
        <div className="md:hidden flex items-center space-x-2">
           <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative">
                        <Languages className="h-5 w-5" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onSelect={() => changeLanguage('en')} disabled={i18n.resolvedLanguage === 'en'}>
                        English
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => changeLanguage('ru')} disabled={i18n.resolvedLanguage === 'ru'}>
                        Русский
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => changeLanguage('hi')} disabled={i18n.resolvedLanguage === 'hi'}>
                        हिन्दी
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} aria-label="Toggle menu">
                <div className="w-6 h-6 flex flex-col justify-center items-center">
                    <span className={`block w-5 h-0.5 bg-foreground rounded-full transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-0.5' : '-translate-y-1'}`}></span>
                    <span className={`block w-5 h-0.5 bg-foreground rounded-full transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
                    <span className={`block w-5 h-0.5 bg-foreground rounded-full transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-0.5' : 'translate-y-1'}`}></span>
                </div>
            </button>
        </div>
      </div>

      {/* Mobile Menu */} 
      {isMobileMenuOpen && (
        <motion.div
          className="md:hidden fixed inset-0 top-[72px] z-40 glass-dark"
          initial={{ opacity: 0, y: "-100%" }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: "-100%" }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          onClick={() => setIsMobileMenuOpen(false)} 
        >
          <div className="container mx-auto py-6 flex flex-col h-full space-y-6 text-center overflow-y-auto bg-background/95" onClick={(e) => e.stopPropagation()}>
            <MobileNavItem onClick={() => scrollToSection('hero')}>{t('nav.home')}</MobileNavItem>
            <MobileNavItem onClick={() => scrollToSection('communities')}>{t('nav.communities')}</MobileNavItem>

            <div className="pt-8 border-t border-border mt-auto mb-4"> 
              {user ? (
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <Avatar className="h-16 w-16">
                       {/* Use profileAvatarUrl from context */}
                      <AvatarImage src={profileAvatarUrl ?? undefined} alt={displayName} />
                      <AvatarFallback className="text-xl">
                        {(displayName[0] || "U").toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <p className="text-foreground font-medium">{displayName}</p>
                  <div className="flex flex-col space-y-3 px-4">
                    <Button variant="outline" onClick={() => { navigate('/dashboard'); setIsMobileMenuOpen(false); }}>{t('nav.dashboard')}</Button>
                    <Button variant="destructive" onClick={() => { signOut(); setIsMobileMenuOpen(false); }}>{t('nav.logout')}</Button>
                  </div>
                </div>
              ) : (
                <div className="px-4">
                  <LoginButton />
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </nav>
  );
};

const NavItem: React.FC<{ children: React.ReactNode; onClick?: () => void }> = ({ children, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="relative text-sm font-medium transition-colors hover:text-foreground/80 text-foreground/60"
    >
      {children}
    </button>
  );
};

const MobileNavItem: React.FC<{ children: React.ReactNode; onClick?: () => void }> = ({ children, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="text-xl font-medium text-foreground/70 hover:text-foreground w-full py-2"
    >
      {children}
    </button>
  );
};

export default Navbar;
