import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Github, Linkedin, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message sent!",
      description: "We'll get back to you as soon as possible.",
    });
    setFormData({ name: "", email: "", message: "" });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12 animate-fade-in-up">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Get In Touch
              </h1>
              <p className="text-xl text-muted-foreground">
                Have questions or feedback? We'd love to hear from you!
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <Card className="glass-card p-8 animate-fade-in">
                <h2 className="text-2xl font-bold mb-6">Send us a message</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your name"
                      required
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your.email@example.com"
                      required
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us what's on your mind..."
                      required
                      className="mt-2 min-h-[150px]"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full gradient-primary text-primary-foreground hover:shadow-glow transition-smooth"
                    size="lg"
                  >
                    <Send className="mr-2 h-4 w-4" />
                    Send Message
                  </Button>
                </form>
              </Card>

              <div className="space-y-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <Card className="glass-card p-8">
                  <h2 className="text-2xl font-bold mb-6">Connect With Us</h2>
                  <div className="space-y-4">
                    <a
                      href="mailto:contact@smartrecipe.ai"
                      className="flex items-center gap-4 p-4 rounded-xl hover:bg-muted transition-smooth group"
                    >
                      <div className="p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-smooth">
                        <Mail className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold">Email</p>
                        <p className="text-sm text-muted-foreground">contact@smartrecipe.ai</p>
                      </div>
                    </a>

                    <a
                      href="#"
                      className="flex items-center gap-4 p-4 rounded-xl hover:bg-muted transition-smooth group"
                    >
                      <div className="p-3 rounded-full bg-secondary/20 group-hover:bg-secondary/30 transition-smooth">
                        <Github className="h-5 w-5 text-secondary-foreground" />
                      </div>
                      <div>
                        <p className="font-semibold">GitHub</p>
                        <p className="text-sm text-muted-foreground">@smartrecipe</p>
                      </div>
                    </a>

                    <a
                      href="#"
                      className="flex items-center gap-4 p-4 rounded-xl hover:bg-muted transition-smooth group"
                    >
                      <div className="p-3 rounded-full bg-accent/20 group-hover:bg-accent/30 transition-smooth">
                        <Linkedin className="h-5 w-5 text-accent-foreground" />
                      </div>
                      <div>
                        <p className="font-semibold">LinkedIn</p>
                        <p className="text-sm text-muted-foreground">Smart Recipe Team</p>
                      </div>
                    </a>
                  </div>
                </Card>

                <Card className="glass-card p-8">
                  <h3 className="text-xl font-bold mb-4">Office Hours</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Monday - Friday</span>
                      <span className="font-medium">9:00 AM - 6:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Saturday</span>
                      <span className="font-medium">10:00 AM - 4:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Sunday</span>
                      <span className="font-medium">Closed</span>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
