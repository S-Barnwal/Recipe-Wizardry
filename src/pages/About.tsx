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

            <Card className="glass-card p-8 md:p-12 mb-12 animate-fade-in">
              <h2 className="text-3xl font-bold mb-6">
                Our Story
              </h2>

              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                Smart Recipe Generator was created with a simple goal: to make cooking
                easier, smarter, and more sustainable. Every day, millions of people
                struggle to decide what to cook using the ingredients already available
                in their kitchens. As a result, large amounts of food are wasted while
                users spend valuable time searching for recipes online.
              </p>

              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                Our platform uses Artificial Intelligence to analyze ingredients,
                understand food combinations, and generate personalized recipes within
                seconds. Whether you have vegetables, spices, leftovers, or a random
                combination of ingredients, Smart Recipe Generator helps transform them
                into delicious meals.
              </p>

              <p className="text-lg text-muted-foreground leading-relaxed">
                We believe technology should simplify everyday life. By combining
                machine learning with culinary creativity, we aim to help people cook
                confidently while reducing unnecessary food waste.
              </p>
            </Card>

            <Card className="glass-card p-8 md:p-12 mb-12 animate-fade-in">
              <h2 className="text-3xl font-bold mb-6">
                Why Choose Smart Recipe Generator?
              </h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    Intelligent Recommendations
                  </h3>
                  <p className="text-muted-foreground">
                    Our AI understands ingredient combinations and suggests recipes
                    tailored to your available ingredients and preferences.
                  </p>
                </div>

                ```
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    Ingredient-Based Search
                  </h3>
                  <p className="text-muted-foreground">
                    No need to search endlessly through recipe websites. Simply enter
                    what you have, and our system generates suitable meal ideas
                    instantly.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    Sustainability First
                  </h3>
                  <p className="text-muted-foreground">
                    We encourage smarter cooking habits by helping users utilize
                    leftovers and reduce food waste.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    User-Friendly Experience
                  </h3>
                  <p className="text-muted-foreground">
                    Our intuitive interface ensures a smooth experience for beginners,
                    home cooks, and culinary enthusiasts alike.
                  </p>
                </div>
                ```

              </div>
            </Card>

            <Card className="glass-card p-8 md:p-12 mb-12 animate-fade-in">
              <h2 className="text-3xl font-bold mb-6">
                Technology Behind the Platform
              </h2>

              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                Smart Recipe Generator leverages modern Artificial Intelligence,
                ingredient recognition systems, machine learning models, and advanced
                recommendation algorithms to deliver accurate recipe suggestions.
              </p>

              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                The platform analyzes ingredient relationships, cooking methods,
                nutritional information, and flavor pairings to create meaningful and
                practical meal recommendations.
              </p>

              <p className="text-lg text-muted-foreground leading-relaxed">
                As our technology continues to evolve, we aim to provide even more
                personalized meal planning, dietary recommendations, nutritional
                insights, and smart cooking assistance.
              </p>
            </Card>

            <Card className="glass-card p-8 md:p-12 mb-12 animate-fade-in">
              <h2 className="text-3xl font-bold mb-8 text-center">
                Platform Impact
              </h2>

              <div className="grid md:grid-cols-4 gap-6">
                <div className="text-center">
                  <h3 className="text-4xl font-bold text-primary mb-2">10K+</h3>
                  <p className="text-muted-foreground">Recipes Generated</p>
                </div>

                ```
                <div className="text-center">
                  <h3 className="text-4xl font-bold text-primary mb-2">5K+</h3>
                  <p className="text-muted-foreground">Active Users</p>
                </div>

                <div className="text-center">
                  <h3 className="text-4xl font-bold text-primary mb-2">100+</h3>
                  <p className="text-muted-foreground">Cuisine Types</p>
                </div>

                <div className="text-center">
                  <h3 className="text-4xl font-bold text-primary mb-2">95%</h3>
                  <p className="text-muted-foreground">User Satisfaction</p>
                </div>
                ```

              </div>
            </Card>

            <Card className="glass-card p-8 md:p-12 mb-12 animate-fade-in">
              <h2 className="text-3xl font-bold mb-6">
                Our Vision
              </h2>

              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                Our vision is to become the world's most trusted AI-powered cooking
                assistant. We want to empower every household with smart meal planning,
                personalized nutrition guidance, and sustainable cooking solutions.
              </p>

              <p className="text-lg text-muted-foreground leading-relaxed">
                By combining innovation, technology, and creativity, Smart Recipe
                Generator aims to transform kitchens worldwide into smarter, more
                efficient, and environmentally conscious spaces.
              </p>
            </Card>


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
