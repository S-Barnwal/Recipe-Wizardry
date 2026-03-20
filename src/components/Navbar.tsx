import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { isAdminEmail } from "@/lib/adminEmails";
import { Button } from "./ui/button";
import { ChefHat, Menu, X, User, Calendar, LogOut, Database, LayoutDashboard, Shield } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { NavLink } from "./NavLink";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

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
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b transition-smooth">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <ChefHat className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Recipe Wizardry
            </span>
          </Link>

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
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="ml-4">
                    <User className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                    <LayoutDashboard className="h-4 w-4 mr-2" />
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/profile")}>
                    <User className="h-4 w-4 mr-2" />
                    My Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/meal-planner")}>
                    <Calendar className="h-4 w-4 mr-2" />
                    Meal Planner
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/dataset")}>
                    <Database className="h-4 w-4 mr-2" />
                    Dataset Management
                  </DropdownMenuItem>
                  {isAdminEmail(user?.email) && (
                    <DropdownMenuItem onClick={() => navigate("/admin")}>
                      <Shield className="h-4 w-4 mr-2" />
                      Admin Dashboard
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/auth" className="ml-4">
                <Button variant="default">Sign In</Button>
              </Link>
            )}
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden py-4 animate-fade-in">
            <div className="flex flex-col space-y-2">
              <NavLink
                to="/"
                className="px-4 py-2 rounded-lg text-foreground/80 hover:text-foreground hover:bg-muted transition-smooth"
                activeClassName="bg-muted text-foreground font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </NavLink>
              {user && (
                <>
                  <NavLink
                    to="/my-recipes"
                    className="px-4 py-2 rounded-lg text-foreground/80 hover:text-foreground hover:bg-muted transition-smooth"
                    activeClassName="bg-muted text-foreground font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    My Recipes
                  </NavLink>
                  <NavLink
                    to="/profile"
                    className="px-4 py-2 rounded-lg text-foreground/80 hover:text-foreground hover:bg-muted transition-smooth"
                    activeClassName="bg-muted text-foreground font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    My Profile
                  </NavLink>
                  <NavLink
                    to="/meal-planner"
                    className="px-4 py-2 rounded-lg text-foreground/80 hover:text-foreground hover:bg-muted transition-smooth"
                    activeClassName="bg-muted text-foreground font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Meal Planner
                  </NavLink>
                </>
              )}
              <NavLink
                to="/community"
                className="px-4 py-2 rounded-lg text-foreground/80 hover:text-foreground hover:bg-muted transition-smooth"
                activeClassName="bg-muted text-foreground font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Community
              </NavLink>
              <NavLink
                to="/about"
                className="px-4 py-2 rounded-lg text-foreground/80 hover:text-foreground hover:bg-muted transition-smooth"
                activeClassName="bg-muted text-foreground font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </NavLink>
              <NavLink
                to="/contact"
                className="px-4 py-2 rounded-lg text-foreground/80 hover:text-foreground hover:bg-muted transition-smooth"
                activeClassName="bg-muted text-foreground font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
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
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <Link to="/auth" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="default" size="sm" className="w-full">
                    Sign In
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
