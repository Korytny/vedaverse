
import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';
import LoginButton from './LoginButton';
import { useAuth } from '@/context/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, Settings, LogOut } from 'lucide-react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === '/';
  const { user, signOut } = useAuth();

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

  const navbarClasses = `
    fixed top-0 left-0 right-0 z-50 px-6 py-4 transition-all duration-300
    ${isScrolled ? 'glass py-3' : 'bg-transparent'}
  `;

  const scrollToSection = (id: string) => {
    setIsMobileMenuOpen(false);
    if (isHomePage) {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth'
        });
      }
    } else {
      // If not on home page, navigate to home and then scroll
      window.location.href = `/#${id}`;
    }
  };

  return (
    <nav className={navbarClasses}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <span className="font-display font-bold text-2xl">VeraVerse</span>
          </motion.div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <div className="flex items-center space-x-6">
            <NavItem onClick={() => scrollToSection('hero')}>Home</NavItem>
            <NavItem onClick={() => scrollToSection('features')}>Features</NavItem>
            <NavItem onClick={() => scrollToSection('communities')}>Communities</NavItem>
            <NavItem onClick={() => scrollToSection('stats')}>Stats</NavItem>
          </div>
          <div className="flex items-center space-x-3">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="rounded-full h-10 w-10 p-0">
                    <Avatar>
                      <AvatarImage src={user.user_metadata?.avatar_url} alt={user.user_metadata?.full_name || "User"} />
                      <AvatarFallback>
                        {(user.user_metadata?.full_name?.[0] || user.email?.[0] || "U").toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.user_metadata?.full_name || "User"}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Profile Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut()}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <LoginButton />
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} aria-label="Toggle menu">
          <div className="w-6 h-6 flex flex-col justify-center items-center">
            <span className={`block w-5 h-0.5 bg-foreground rounded-full transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-0.5' : '-translate-y-1'}`}></span>
            <span className={`block w-5 h-0.5 bg-foreground rounded-full transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
            <span className={`block w-5 h-0.5 bg-foreground rounded-full transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-0.5' : 'translate-y-1'}`}></span>
          </div>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div
          className="md:hidden fixed inset-0 top-[72px] z-50 glass-dark"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "100vh" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <div className="container mx-auto py-6 flex flex-col space-y-8 text-center">
            <MobileNavItem onClick={() => scrollToSection('hero')}>Home</MobileNavItem>
            <MobileNavItem onClick={() => scrollToSection('features')}>Features</MobileNavItem>
            <MobileNavItem onClick={() => scrollToSection('communities')}>Communities</MobileNavItem>
            <MobileNavItem onClick={() => scrollToSection('stats')}>Stats</MobileNavItem>
            <div className="pt-4">
              {user ? (
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={user.user_metadata?.avatar_url} alt={user.user_metadata?.full_name || "User"} />
                      <AvatarFallback className="text-xl">
                        {(user.user_metadata?.full_name?.[0] || user.email?.[0] || "U").toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <p className="text-white font-medium">{user.user_metadata?.full_name || "User"}</p>
                  <div className="flex flex-col space-y-3">
                    <Button variant="outline" onClick={() => navigate('/dashboard')}>Dashboard</Button>
                    <Button variant="outline" onClick={() => navigate('/profile')}>Profile Settings</Button>
                    <Button variant="destructive" onClick={() => signOut()}>Sign Out</Button>
                  </div>
                </div>
              ) : (
                <LoginButton />
              )}
            </div>
          </div>
        </motion.div>
      )}
    </nav>
  );
};

const NavItem = ({ children, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="relative text-sm font-medium transition-colors hover:text-foreground/80 text-foreground/60"
    >
      {children}
    </button>
  );
};

const MobileNavItem = ({ children, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="text-xl font-medium text-white/70 hover:text-white"
    >
      {children}
    </button>
  );
};

export default Navbar;
