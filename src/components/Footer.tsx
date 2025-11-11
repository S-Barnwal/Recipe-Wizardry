import { Github, Linkedin, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t bg-muted/50 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-2xl">🍳</span>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Smart Recipe
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              AI-powered recipe generation from ingredients or images. Cook smart, waste less, discover more.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="/" className="hover:text-foreground transition-smooth">Home</a></li>
              <li><a href="/dashboard" className="hover:text-foreground transition-smooth">Dashboard</a></li>
              <li><a href="/about" className="hover:text-foreground transition-smooth">About</a></li>
              <li><a href="/contact" className="hover:text-foreground transition-smooth">Contact</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Connect With Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-smooth">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-smooth">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-smooth">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          © 2025 Smart Recipe Generator — Crafted with ❤️ using AI
        </div>
      </div>
    </footer>
  );
};

export default Footer;
