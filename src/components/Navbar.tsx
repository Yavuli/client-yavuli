<<<<<<< HEAD
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, Heart, ShoppingCart, User, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
=======
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Heart, ShoppingCart, User, Menu, X, LogIn } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { cartCount } = useCart();
  
  const isActive = (path: string) => location.pathname === path;
  
  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };
  
>>>>>>> 2a0a4efb02c84718b6d415fdbc9673868d2d846c
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-hero transition-transform group-hover:scale-105">
              <span className="text-lg font-bold text-white">Y</span>
            </div>
            <span className="text-xl font-bold text-primary">Yavuli</span>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search products, books, services..."
                className="pl-10 bg-muted/50 border-border focus:ring-accent"
              />
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link 
              to="/explore" 
<<<<<<< HEAD
              className={`text-sm font-medium transition-colors hover:text-primary ${isActive('/explore') ? 'text-primary font-semibold' : 'text-foreground'}`}
=======
              className={`text-sm font-medium transition-colors hover:text-accent ${isActive('/explore') ? 'text-accent' : 'text-foreground'}`}
>>>>>>> 2a0a4efb02c84718b6d415fdbc9673868d2d846c
            >
              Explore
            </Link>
            <Link 
              to="/sell" 
<<<<<<< HEAD
              className={`text-sm font-medium transition-colors hover:text-primary ${isActive('/sell') ? 'text-primary font-semibold' : 'text-foreground'}`}
=======
              className={`text-sm font-medium transition-colors hover:text-accent ${isActive('/sell') ? 'text-accent' : 'text-foreground'}`}
>>>>>>> 2a0a4efb02c84718b6d415fdbc9673868d2d846c
            >
              Sell
            </Link>
            <Link 
              to="/about" 
<<<<<<< HEAD
              className={`text-sm font-medium transition-colors hover:text-primary ${isActive('/about') ? 'text-primary font-semibold' : 'text-foreground'}`}
=======
              className={`text-sm font-medium transition-colors hover:text-accent ${isActive('/about') ? 'text-accent' : 'text-foreground'}`}
>>>>>>> 2a0a4efb02c84718b6d415fdbc9673868d2d846c
            >
              About
            </Link>
            <Link 
              to="/contact" 
<<<<<<< HEAD
              className={`text-sm font-medium transition-colors hover:text-primary ${isActive('/contact') ? 'text-primary font-semibold' : 'text-foreground'}`}
=======
              className={`text-sm font-medium transition-colors hover:text-accent ${isActive('/contact') ? 'text-accent' : 'text-foreground'}`}
>>>>>>> 2a0a4efb02c84718b6d415fdbc9673868d2d846c
            >
              Contact
            </Link>
          </div>

          {/* Icons */}
          <div className="flex items-center gap-2">
<<<<<<< HEAD
            <Button variant="ghost" size="icon" className="relative hidden md:flex hover:bg-accent/10 hover:text-accent">
              <Heart className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="relative hover:bg-accent/10 hover:text-accent">
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-xs text-white">
                0
              </span>
            </Button>
            
            {/* Profile Menu */}
            <div className="relative hidden md:block">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-accent/10"
                onMouseEnter={() => setProfileMenuOpen(true)}
                onMouseLeave={() => setProfileMenuOpen(false)}
              >
                <User className="h-5 w-5" />
              </Button>
              
              {profileMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 animate-fade-in rounded-lg border border-border bg-card shadow-lg"
                  onMouseEnter={() => setProfileMenuOpen(true)}
                  onMouseLeave={() => setProfileMenuOpen(false)}
                >
                  <div className="p-4 border-b border-border">
                    <p className="text-sm font-semibold">Guest User</p>
                    <p className="text-xs text-muted-foreground">guest@yavuli.com</p>
                  </div>
                  <div className="py-2">
                    <Link to="/profile" className="block px-4 py-2 text-sm hover:bg-muted transition-colors">
                      My Profile
                    </Link>
                    <Link to="/profile?tab=listings" className="block px-4 py-2 text-sm hover:bg-muted transition-colors">
                      My Listings
                    </Link>
                    <Link to="/profile?tab=favorites" className="block px-4 py-2 text-sm hover:bg-muted transition-colors">
                      Favourites
                    </Link>
                    <Link to="/profile?tab=settings" className="block px-4 py-2 text-sm hover:bg-muted transition-colors">
                      Settings
                    </Link>
                  </div>
                  <div className="border-t border-border p-2">
                    <Link to="/login" className="block px-4 py-2 text-sm text-destructive hover:bg-muted transition-colors">
                      Sign Out
                    </Link>
                  </div>
                </div>
              )}
            </div>
=======
            {user ? (
              <>
                <Button variant="ghost" size="icon" className="relative hidden md:flex hover:bg-accent/10 hover:text-accent">
                  <Heart className="h-5 w-5" />
                </Button>
                
                <Link to="/cart">
                  <Button variant="ghost" size="icon" className="relative hover:bg-accent/10 hover:text-accent">
                    <ShoppingCart className="h-5 w-5" />
                    {cartCount > 0 && (
                      <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-xs text-white">
                        {cartCount}
                      </span>
                    )}
                  </Button>
                </Link>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full hover:bg-accent/10">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.user_metadata?.avatar_url} alt={user.user_metadata?.full_name} />
                        <AvatarFallback className="bg-accent/10 text-accent">
                          {user.user_metadata?.full_name?.charAt(0) || user.email?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {user.user_metadata?.full_name || 'User'}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <Link to="/profile">
                      <DropdownMenuItem className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </DropdownMenuItem>
                    </Link>
                    <Link to="/profile/favorites">
                      <DropdownMenuItem className="cursor-pointer">
                        <Heart className="mr-2 h-4 w-4" />
                        <span>Favorites</span>
                      </DropdownMenuItem>
                    </Link>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="cursor-pointer text-destructive focus:text-destructive"
                      onClick={handleSignOut}
                    >
                      <LogIn className="mr-2 h-4 w-4" />
                      <span>Sign out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="hidden md:flex gap-2"
                  onClick={() => navigate('/login')}
                >
                  <LogIn className="h-4 w-4" />
                  Sign In
                </Button>
                <Button 
                  size="sm" 
                  className="hidden md:flex bg-gradient-hero text-white hover:shadow-glow"
                  onClick={() => navigate('/signup')}
                >
                  Sign Up
                </Button>
              </>
            )}
>>>>>>> 2a0a4efb02c84718b6d415fdbc9673868d2d846c

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              className="pl-10 bg-muted/50"
            />
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-card animate-fade-in">
          <div className="container mx-auto px-4 py-4 space-y-3">
            <Link to="/explore" className="block py-2 text-sm font-medium hover:text-accent transition-colors">
              Explore
            </Link>
            <Link to="/sell" className="block py-2 text-sm font-medium hover:text-accent transition-colors">
              Sell
            </Link>
            <Link to="/about" className="block py-2 text-sm font-medium hover:text-accent transition-colors">
              About
            </Link>
            <Link to="/contact" className="block py-2 text-sm font-medium hover:text-accent transition-colors">
              Contact
            </Link>
            <div className="border-t border-border pt-3 space-y-2">
              <Link to="/profile" className="block py-2 text-sm hover:text-accent transition-colors">
                My Profile
              </Link>
              <Link to="/login" className="block py-2 text-sm text-destructive hover:text-accent transition-colors">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
