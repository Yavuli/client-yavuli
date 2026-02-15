import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ShoppingCart, User, Menu, X, LogIn, MessageCircle, Settings } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { supabase } from '@/lib/supabase'
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import YavuliLogoAnimation from "@/components/YavuliLogoAnimation";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { cartCount } = useCart();
  const [searchParams, setSearchParams] = useSearchParams();
  const [unreadCount, setUnreadCount] = useState(0);

  // Search state — synced with URL on profile/explore
  const [searchQuery, setSearchQuery] = useState("");

  // Sync search input from URL when on profile or explore
  useEffect(() => {
    if (location.pathname === '/profile' || location.pathname === '/explore') {
      setSearchQuery(searchParams.get('search') || '');
    } else {
      setSearchQuery('');
    }
  }, [location.pathname, searchParams]);

  const handleSearch = (query: string) => {
    const trimmed = query.trim();
    if (location.pathname === '/profile') {
      // Update search param on profile page
      const params = new URLSearchParams(searchParams);
      if (trimmed) {
        params.set('search', trimmed);
      } else {
        params.delete('search');
      }
      setSearchParams(params);
    } else if (location.pathname === '/explore') {
      // Already on explore — just update URL param, Explore page reads it
      if (trimmed) {
        navigate(`/explore?search=${encodeURIComponent(trimmed)}`);
      } else {
        navigate('/explore');
      }
    } else {
      // Navigate to explore with search
      if (trimmed) {
        navigate(`/explore?search=${encodeURIComponent(trimmed)}`);
      }
    }
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch(searchQuery);
    }
  };

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
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group shrink-0">
            <YavuliLogoAnimation className={location.pathname === "/" ? "max-w-[200px]" : "max-w-[140px]"} />
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-lg mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={location.pathname === '/profile' ? 'Search your purchases, sales, listings...' : 'Search products, books, services...'}
                className="pl-10 pr-9 h-10 bg-muted/50 border-border focus:ring-accent transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchKeyDown}
              />
              {searchQuery && (
                <button
                  onClick={() => { setSearchQuery(''); handleSearch(''); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* Actions & Navigation */}
          <div className="flex items-center gap-1 md:gap-2">
            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center gap-4 mr-2">
              <Link
                to="/explore"
                className={`text-sm font-semibold px-3 py-2 rounded-lg transition-colors hover:bg-accent/5 ${isActive('/explore') ? 'text-accent bg-accent/10' : 'text-foreground/80 hover:text-accent'}`}
              >
                Explore
              </Link>
              <button
                onClick={() => {
                  if (user) {
                    navigate('/sell');
                  } else {
                    toast.info("Please sign in to start selling");
                    navigate('/login');
                  }
                }}
                className={`text-sm font-semibold px-3 py-2 rounded-lg transition-colors hover:bg-accent/5 ${isActive('/sell') ? 'text-accent bg-accent/10' : 'text-foreground/80 hover:text-accent'}`}
              >
                Sell
              </button>
            </div>

            {/* Action Icons */}
            <div className="flex items-center gap-1 md:gap-2">
              <Link to="/inbox">
                <Button variant="ghost" size="icon" className="relative h-10 w-10 hover:bg-accent/10 hover:text-accent rounded-full transition-all">
                  <MessageCircle className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-white ring-2 ring-card">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Button>
              </Link>

              {user ? (
                <>
                  <Link to="/cart">
                    <Button variant="ghost" size="icon" className="relative h-10 w-10 hover:bg-accent/10 hover:text-accent rounded-full transition-all">
                      <ShoppingCart className="h-5 w-5" />
                      {cartCount > 0 && (
                        <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-white ring-2 ring-card">
                          {cartCount}
                        </span>
                      )}
                    </Button>
                  </Link>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full hover:bg-accent/10 ring-offset-background transition-all focus-visible:ring-2 focus-visible:ring-accent">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.user_metadata?.avatar_url} alt={user.user_metadata?.full_name} />
                          <AvatarFallback className="bg-accent/10 text-accent font-semibold">
                            {user.user_metadata?.full_name?.charAt(0) || user.email?.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 mt-2">
                      <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-semibold leading-none">
                            {user.user_metadata?.full_name || 'User'}
                          </p>
                          <p className="text-xs leading-none text-muted-foreground truncate">
                            {user.email}
                          </p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {!isActive('/profile') && (
                        <Link to="/profile">
                          <DropdownMenuItem className="cursor-pointer">
                            <User className="mr-2 h-4 w-4" />
                            <span>Profile</span>
                          </DropdownMenuItem>
                        </Link>
                      )}
                      <Link to="/profile?tab=settings">
                        <DropdownMenuItem className="cursor-pointer">
                          <Settings className="mr-2 h-4 w-4" />
                          <span>Settings</span>
                        </DropdownMenuItem>
                      </Link>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/5"
                        onClick={handleSignOut}
                      >
                        <LogIn className="mr-2 h-4 w-4" />
                        <span>Sign out</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <div className="flex items-center gap-2 ml-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hidden sm:flex font-semibold text-accent hover:bg-accent/10"
                    onClick={() => navigate('/login')}
                  >
                    Sign In
                  </Button>
                  <Button
                    size="sm"
                    className="bg-gradient-hero text-white hover:shadow-glow font-semibold px-4"
                    onClick={() => navigate('/signup')}
                  >
                    Sign Up
                  </Button>
                </div>
              )}

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden h-10 w-10 rounded-full hover:bg-accent/10 transition-all"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={location.pathname === '/profile' ? 'Search profile...' : 'Search products...'}
              className="pl-10 pr-9 bg-muted/50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchKeyDown}
            />
            {searchQuery && (
              <button
                onClick={() => { setSearchQuery(''); handleSearch(''); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
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
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (user) {
                  navigate('/sell');
                } else {
                  toast.info("Please sign in to start selling");
                  navigate('/login');
                }
              }}
              className="block py-2 text-sm font-medium hover:text-accent transition-colors w-full text-left"
            >
              Sell
            </button>

            {/* User-specific mobile links */}
            {user ? (
              <>
                <div className="border-t border-border pt-3 space-y-2">
                  {!isActive('/profile') && (
                    <Link
                      to="/profile"
                      className="block py-2 text-sm hover:text-accent transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      My Profile
                    </Link>
                  )}
                  <Link
                    to="/profile?tab=settings"
                    className="block py-2 text-sm hover:text-accent transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Settings
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