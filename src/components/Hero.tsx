import heroImage from "@/assets/hero-cooking.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Fresh cooking ingredients" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/70 to-background"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto animate-fade-in-up">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              Cook Smart.
            </span>
            <br />
            <span className="text-foreground">Waste Less. Discover More.</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            AI that turns your ingredients and photos into delicious recipes 🍲
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <div className="glass-card px-6 py-3 rounded-full text-sm font-medium">
              ✨ Upload ingredients or images
            </div>
            <div className="glass-card px-6 py-3 rounded-full text-sm font-medium">
              🤖 AI generates perfect recipes
            </div>
            <div className="glass-card px-6 py-3 rounded-full text-sm font-medium">
              🍴 Cook and enjoy!
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 text-6xl opacity-20 animate-float">🥘</div>
      <div className="absolute bottom-20 right-10 text-6xl opacity-20 animate-float" style={{ animationDelay: '1s' }}>🍴</div>
      <div className="absolute top-1/2 left-1/4 text-4xl opacity-10 animate-float" style={{ animationDelay: '0.5s' }}>🧂</div>
    </section>
  );
};

export default Hero;
