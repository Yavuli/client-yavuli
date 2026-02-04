import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ShoppingCart, User, Menu, X, LogIn, MessageCircle } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { supabase } from '@/lib/supabase'
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
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    if (!user) return;

    // Function to fetch the count
    const fetchUnread = async () => {
      try {
        const { data: { user: currentUser } } = await supabase.auth.getUser()
        if (!currentUser) return

        // Call the SQL function we just made
        const { data, error } = await supabase.rpc('get_unread_count')
        if (error) {
          console.error('[Navbar] Error fetching unread count:', error);
          return;
        }
        setUnreadCount(data || 0)
      } catch (error) {
        console.error('[Navbar] Fatal error fetching unread count:', error);
      }
    }

    fetchUnread()

    // Realtime: Listen for ANY new message in my chats
    let channel: any = null;

    try {
      channel = supabase
        .channel('global_messages')
        .on('postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'messages' },
          () => {
            // If ANY message comes into the DB, recheck count
            fetchUnread()
          }
        )
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            console.log('[Navbar] Realtime subscribed successfully');
          } else if (status === 'CHANNEL_ERROR') {
            console.error('[Navbar] Realtime subscription error');
          } else if (status === 'TIMED_OUT') {
            console.warn('[Navbar] Realtime subscription timed out');
          }
        });
    } catch (error) {
      console.error('[Navbar] Error setting up realtime subscription:', error);
    }

    return () => {
      if (channel) {
        try {
          supabase.removeChannel(channel);
        } catch (error) {
          console.error('[Navbar] Error removing channel:', error);
        }
      }
    }
  }, [user])

  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

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
              className={`text-sm font-medium transition-colors hover:text-violet-600 ${isActive('/explore') ? 'text-violet-600' : 'text-foreground'}`}
            >
              Explore
            </Link>
            <Link
              to="/sell"
              className={`text-sm font-medium transition-colors hover:text-violet-600 ${isActive('/sell') ? 'text-violet-600' : 'text-foreground'}`}
            >
              Sell
            </Link>
          </div>
          <Link to="/inbox" className="relative p-2 hover:bg-gray-100 rounded-full transition">
            <MessageCircle className="w-6 h-6 text-gray-700" />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-red-100 transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full border-2 border-white">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </Link>

          {/* Icons */}
          <div className="flex items-center gap-2">
            {user ? (
              <>
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
            <Link
              to="/explore"
              className="block py-2 text-sm font-medium hover:text-accent transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Explore
            </Link>
            <Link
              to="/sell"
              className="block py-2 text-sm font-medium hover:text-accent transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Sell
            </Link>

            {/* User-specific mobile links */}
            {user ? (
              <>
                <div className="border-t border-border pt-3 space-y-2">
                  <Link
                    to="/profile"
                    className="block py-2 text-sm hover:text-accent transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    My Profile
                  </Link>
                  <Link
                    to="/cart"
                    className="block py-2 text-sm hover:text-accent transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Cart ({cartCount})
                  </Link>
                  <button
                    onClick={() => {
                      handleSignOut();
                      setMobileMenuOpen(false);
                    }}
                    className="block py-2 text-sm text-destructive hover:text-accent transition-colors w-full text-left"
                  >
                    Sign Out
                  </button>
                </div>
              </>
            ) : (
              <div className="border-t border-border pt-3 space-y-2">
                <Link
                  to="/login"
                  className="block py-2 text-sm hover:text-accent transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="block py-2 text-sm text-destructive hover:text-accent transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;