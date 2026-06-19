import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Mail,
  Github,
  Linkedin,
  Send,
  MapPin,
} from "lucide-react";
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
                Let's Connect
              </h1>
              <p className="text-xl text-muted-foreground">
               Interested in collaborating, discussing projects, or exploring opportunities? Feel free to reach out.
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
                  <h2 className="text-2xl font-bold mb-6">
                    Connect With Me
                  </h2>

                  <div className="space-y-4">

                    <a
                      href="mailto:contact[.snehabarnwal@gmail.com](mailto:.snehabarnwal@gmail.com)"
                      className="flex items-center gap-4 rounded-xl p-4 hover:bg-muted transition-smooth group"

                    >


                      <div className="p-3 rounded-full bg-orange-500/10 group-hover:bg-orange-500/20 transition-smooth">



                        <Mail className="h-5 w-5 text-orange-500" />
                      </div>

                      <div>
                        <p className="font-semibold">Email</p>
                        <p className="text-sm text-muted-foreground">
                          contact.snehabarnwal@gmail.com
                        </p>
                      </div>


                    </a>

                    <a
                      href="https://github.com/S-Barnwal"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 rounded-xl p-4 hover:bg-muted transition-smooth group"

                    >


                      <div className="p-3 rounded-full bg-orange-500/10 group-hover:bg-orange-500/20 transition-smooth">



                        <Github className="h-5 w-5 text-orange-500" />
                      </div>

                      <div>
                        <p className="font-semibold">GitHub</p>
                        <p className="text-sm text-muted-foreground">
                          github.com/S-Barnwal
                        </p>
                      </div>


                    </a>

                    <a
                      href="https://www.linkedin.com/in/sneha-barnwal-90b800262/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 rounded-xl p-4 hover:bg-muted transition-smooth group"

                    >


                      <div className="p-3 rounded-full bg-orange-500/10 group-hover:bg-orange-500/20 transition-smooth">



                        <Linkedin className="h-5 w-5 text-orange-500" />
                      </div>

                      <div>
                        <p className="font-semibold">LinkedIn</p>
                        <p className="text-sm text-muted-foreground">
                          Sneha Barnwal
                        </p>
                      </div>


                    </a>

                    <div className="flex items-center gap-4 rounded-xl p-4">
                      <div className="p-3 rounded-full bg-orange-500/10">
                        <MapPin className="h-5 w-5 text-orange-500" />
                      </div>


                      <div>
                        <p className="font-semibold">Location</p>
                        <p className="text-sm text-muted-foreground">
                          Lucknow, Uttar Pradesh, India
                        </p>
                      </div>


                    </div>
                  </div>

                </Card>

                <Card className="glass-card p-8">
                  <Card className="glass-card p-8">
                    <h3 className="text-xl font-bold mb-4">
                      Let's Build Something Amazing
                    </h3>

                    <p className="text-muted-foreground leading-7">
                      I'm always open to discussing new opportunities,
                      collaborations, freelance projects, internships,
                      and full-time roles in Frontend Development,
                      MERN Stack Development, and Web Technologies.
                    </p>

                    <div className="mt-6">
                      <p className="font-medium text-orange-500">
                        Response Time
                      </p>


                      <p className="text-sm text-muted-foreground mt-2">
                        Usually within 24-48 hours.
                      </p>


                    </div>
                  </Card>

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
