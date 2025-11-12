import { useState, useEffect } from "react";
import { NavLink } from "./NavLink";
import { Button } from "./ui/button";
import { Menu, X, LogOut, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    checkUser();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b transition-smooth">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <NavLink to="/" className="flex items-center space-x-2">
            <span className="text-2xl">🍳</span>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Smart Recipe
            </span>
          </NavLink>

          <div className="hidden md:flex items-center space-x-1">
            <NavLink
              to="/"
              className="px-4 py-2 rounded-lg text-foreground/80 hover:text-foreground hover:bg-muted transition-smooth"
              activeClassName="bg-muted text-foreground font-medium"
            >
              Home
            </NavLink>
            {user && (
              <NavLink
                to="/my-recipes"
                className="px-4 py-2 rounded-lg text-foreground/80 hover:text-foreground hover:bg-muted transition-smooth"
                activeClassName="bg-muted text-foreground font-medium"
              >
                My Recipes
              </NavLink>
            )}
            <NavLink
              to="/community"
              className="px-4 py-2 rounded-lg text-foreground/80 hover:text-foreground hover:bg-muted transition-smooth"
              activeClassName="bg-muted text-foreground font-medium"
            >
              Community
            </NavLink>
            <NavLink
              to="/about"
              className="px-4 py-2 rounded-lg text-foreground/80 hover:text-foreground hover:bg-muted transition-smooth"
              activeClassName="bg-muted text-foreground font-medium"
            >
              About
            </NavLink>
            <NavLink
              to="/contact"
              className="px-4 py-2 rounded-lg text-foreground/80 hover:text-foreground hover:bg-muted transition-smooth"
              activeClassName="bg-muted text-foreground font-medium"
            >
              Contact
            </NavLink>

            {user ? (
              <div className="flex items-center gap-2 ml-4">
                <span className="text-sm text-muted-foreground flex items-center gap-2">
                  <User className="h-4 w-4" />
                  {user.email}
                </span>
                <Button variant="outline" size="sm" onClick={handleSignOut}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <NavLink to="/auth" className="ml-4">
                <Button variant="default" size="sm">Sign In</Button>
              </NavLink>
            )}
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {isOpen && (
          <div className="md:hidden py-4 animate-fade-in">
            <div className="flex flex-col space-y-2">
              <NavLink
                to="/"
                className="px-4 py-2 rounded-lg text-foreground/80 hover:text-foreground hover:bg-muted transition-smooth"
                activeClassName="bg-muted text-foreground font-medium"
                onClick={() => setIsOpen(false)}
              >
                Home
              </NavLink>
              {user && (
                <NavLink
                  to="/my-recipes"
                  className="px-4 py-2 rounded-lg text-foreground/80 hover:text-foreground hover:bg-muted transition-smooth"
                  activeClassName="bg-muted text-foreground font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  My Recipes
                </NavLink>
              )}
              <NavLink
                to="/community"
                className="px-4 py-2 rounded-lg text-foreground/80 hover:text-foreground hover:bg-muted transition-smooth"
                activeClassName="bg-muted text-foreground font-medium"
                onClick={() => setIsOpen(false)}
              >
                Community
              </NavLink>
              <NavLink
                to="/about"
                className="px-4 py-2 rounded-lg text-foreground/80 hover:text-foreground hover:bg-muted transition-smooth"
                activeClassName="bg-muted text-foreground font-medium"
                onClick={() => setIsOpen(false)}
              >
                About
              </NavLink>
              <NavLink
                to="/contact"
                className="px-4 py-2 rounded-lg text-foreground/80 hover:text-foreground hover:bg-muted transition-smooth"
                activeClassName="bg-muted text-foreground font-medium"
                onClick={() => setIsOpen(false)}
              >
                Contact
              </NavLink>

              {user ? (
                <div className="pt-2 border-t border-border space-y-2">
                  <p className="text-sm text-muted-foreground px-4">{user.email}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      handleSignOut();
                      setIsOpen(false);
                    }}
                    className="w-full"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <NavLink to="/auth" onClick={() => setIsOpen(false)}>
                  <Button variant="default" size="sm" className="w-full">
                    Sign In
                  </Button>
                </NavLink>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
