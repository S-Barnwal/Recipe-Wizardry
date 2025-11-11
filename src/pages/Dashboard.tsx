import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ChefHat, TrendingUp, Users, Target } from "lucide-react";

const Dashboard = () => {
  const stats = [
    {
      icon: ChefHat,
      label: "Recipes Generated",
      value: "1,234",
      change: "+12.5%",
      color: "text-primary",
    },
    {
      icon: TrendingUp,
      label: "Avg. AI Confidence",
      value: "94.3%",
      change: "+2.1%",
      color: "text-secondary",
    },
    {
      icon: Users,
      label: "Active Users",
      value: "2,567",
      change: "+18.2%",
      color: "text-accent",
    },
    {
      icon: Target,
      label: "Success Rate",
      value: "97.8%",
      change: "+1.3%",
      color: "text-primary",
    },
  ];

  const progress = [
    { label: "Frontend Development", value: 95, color: "bg-primary" },
    { label: "Backend Integration", value: 88, color: "bg-secondary" },
    { label: "AI Model Training", value: 92, color: "bg-accent" },
    { label: "UI/UX Design", value: 100, color: "bg-primary" },
  ];

  const team = [
    { name: "Sarah Chen", role: "AI Engineer", avatar: "👩‍💻" },
    { name: "Mike Johnson", role: "Full Stack Developer", avatar: "👨‍💻" },
    { name: "Emma Davis", role: "UI/UX Designer", avatar: "👩‍🎨" },
    { name: "Alex Kumar", role: "Product Manager", avatar: "👨‍💼" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="mb-12 animate-fade-in-up">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Project Dashboard
            </h1>
            <p className="text-xl text-muted-foreground">
              Smart Recipe Generation System — AI Powered Meal Planner
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 animate-fade-in">
            {stats.map((stat, index) => (
              <Card key={index} className="glass-card p-6 hover:shadow-lg transition-smooth">
                <div className="flex items-center justify-between mb-4">
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                  <Badge variant="secondary" className="text-xs">
                    {stat.change}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </div>
              </Card>
            ))}
          </div>

          {/* Progress Section */}
          <Card className="glass-card p-8 mb-12 animate-fade-in">
            <h2 className="text-2xl font-bold mb-6">Development Progress</h2>
            <div className="space-y-6">
              {progress.map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">{item.label}</span>
                    <span className="text-muted-foreground">{item.value}%</span>
                  </div>
                  <Progress value={item.value} className="h-3" />
                </div>
              ))}
            </div>
          </Card>

          {/* Architecture Diagram */}
          <Card className="glass-card p-8 mb-12 animate-fade-in">
            <h2 className="text-2xl font-bold mb-6">System Architecture</h2>
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 text-center">
              <div className="space-y-2">
                <div className="w-32 h-32 rounded-2xl gradient-primary flex items-center justify-center text-4xl shadow-lg">
                  🖥️
                </div>
                <p className="font-semibold">Frontend</p>
                <p className="text-xs text-muted-foreground">React + Tailwind</p>
              </div>

              <div className="text-4xl text-muted-foreground">→</div>

              <div className="space-y-2">
                <div className="w-32 h-32 rounded-2xl gradient-secondary flex items-center justify-center text-4xl shadow-lg">
                  ⚙️
                </div>
                <p className="font-semibold">Backend</p>
                <p className="text-xs text-muted-foreground">FastAPI</p>
              </div>

              <div className="text-4xl text-muted-foreground">→</div>

              <div className="space-y-2">
                <div className="w-32 h-32 rounded-2xl bg-accent flex items-center justify-center text-4xl shadow-lg">
                  🤖
                </div>
                <p className="font-semibold">AI Model</p>
                <p className="text-xs text-muted-foreground">GPT + Vision</p>
              </div>

              <div className="text-4xl text-muted-foreground">→</div>

              <div className="space-y-2">
                <div className="w-32 h-32 rounded-2xl bg-muted flex items-center justify-center text-4xl shadow-lg">
                  💾
                </div>
                <p className="font-semibold">Database</p>
                <p className="text-xs text-muted-foreground">MongoDB</p>
              </div>
            </div>
          </Card>

          {/* Team Section */}
          <Card className="glass-card p-8 animate-fade-in">
            <h2 className="text-2xl font-bold mb-6">Team Members</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {team.map((member, index) => (
                <div
                  key={index}
                  className="text-center p-6 rounded-2xl bg-muted/50 hover:bg-muted transition-smooth"
                >
                  <div className="text-6xl mb-4">{member.avatar}</div>
                  <h3 className="font-semibold mb-1">{member.name}</h3>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
