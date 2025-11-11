import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Clock, Leaf, Lightbulb } from "lucide-react";

const About = () => {
  const features = [
    {
      icon: Clock,
      title: "Saves Time",
      description: "Generate complete recipes in seconds, not hours of searching.",
    },
    {
      icon: Leaf,
      title: "Reduces Food Waste",
      description: "Use ingredients you already have to create delicious meals.",
    },
    {
      icon: Lightbulb,
      title: "Creative Ideas",
      description: "Discover new recipe combinations you never thought of before.",
    },
    {
      icon: Sparkles,
      title: "AI-Powered",
      description: "Advanced machine learning for accurate dish detection and recipe generation.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16 animate-fade-in-up">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                About Smart Recipe Generator
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Transforming the way you cook with artificial intelligence.
                Our system helps you create amazing meals while reducing waste
                and saving time.
              </p>
            </div>

            <Card className="glass-card p-8 md:p-12 mb-12 animate-fade-in">
              <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                We believe cooking should be enjoyable, sustainable, and accessible to everyone.
                Our AI-powered platform bridges the gap between what you have in your kitchen
                and what you can create, making meal planning effortless and exciting.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Whether you're a seasoned chef or just starting your culinary journey,
                Smart Recipe Generator adapts to your needs, skill level, and available
                ingredients to suggest the perfect recipes.
              </p>
            </Card>

            <div className="grid md:grid-cols-2 gap-6 mb-12">
              {features.map((feature, index) => (
                <Card
                  key={index}
                  className="glass-card p-8 hover:shadow-lg transition-smooth animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-primary/10">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <Card className="glass-card p-8 md:p-12 text-center animate-fade-in">
              <h2 className="text-3xl font-bold mb-4">
                Ready to Start Cooking Smarter?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Join thousands of users who are already transforming their cooking experience.
              </p>
              <Button
                size="lg"
                className="gradient-primary text-primary-foreground hover:shadow-glow transition-smooth"
                onClick={() => window.location.href = '/'}
              >
                Try It Now
              </Button>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;
