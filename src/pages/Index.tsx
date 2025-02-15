
import { TradeEntryForm } from "@/components/TradeEntryForm";
import { Card } from "@/components/ui/card";
import { ChartBar, BookOpen, Brain, AlertTriangle } from "lucide-react";

const Index = () => {
  const stats = [
    {
      title: "Total Trades",
      value: "0",
      icon: ChartBar,
      color: "text-primary",
    },
    {
      title: "Win Rate",
      value: "0%",
      icon: BookOpen,
      color: "text-success",
    },
    {
      title: "Psychology Score",
      value: "Good",
      icon: Brain,
      color: "text-warning",
    },
    {
      title: "Risk Level",
      value: "Low",
      icon: AlertTriangle,
      color: "text-destructive",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight animate-fade-up">
            Options Trading Journal
          </h1>
          <p className="text-muted-foreground animate-fade-up">
            Track your trades, manage risk, and improve your psychology
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <Card
              key={stat.title}
              className="p-6 glass-panel card-hover animate-fade-up"
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <TradeEntryForm />
          <Card className="p-6 glass-panel animate-fade-up">
            <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
            <div className="text-muted-foreground text-center py-8">
              No trades recorded yet. Start by logging your first trade!
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
