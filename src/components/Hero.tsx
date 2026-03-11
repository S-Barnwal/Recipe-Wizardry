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
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto animate-fade-in-up">
          {/* Powered by AI Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary mb-6">
            ✨ Powered by AI
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="text-6xl md:text-8xl inline-block mr-3">🔍</span>
            <span className="text-foreground">
              Transform Ingredients Into
            </span>
            <br />
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Culinary Masterpieces
            </span>
            <span className="text-5xl md:text-7xl inline-block ml-2">🎨</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            📸 Upload a photo or 📝 list your ingredients. Our AI chef 👨‍🍳 instantly creates personalized recipes with step-by-step instructions! 🚀
          </p>

          <a
            href="#create-recipe"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full gradient-primary text-primary-foreground font-semibold text-lg hover:shadow-glow transition-smooth hover:scale-105"
          >
            Get Started 🚀
          </a>
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
