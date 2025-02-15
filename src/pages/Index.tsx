
import { TradeEntryForm } from "@/components/TradeEntryForm";
import { Card } from "@/components/ui/card";
import { 
  ChartBar, 
  BookOpen, 
  Brain, 
  AlertTriangle,
  TrendingUp,
  Activity,
  Target,
  Scale
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from "recharts";

const Index = () => {
  // Sample data - would be replaced with real data
  const equityData = [
    { date: "Jan", value: 100000 },
    { date: "Feb", value: 115000 },
    { date: "Mar", value: 108000 },
    { date: "Apr", value: 125000 },
  ];

  const rDistributionData = [
    { r: "-3R", count: 1 },
    { r: "-2R", count: 2 },
    { r: "-1R", count: 3 },
    { r: "1R", count: 5 },
    { r: "2R", count: 4 },
    { r: "3R", count: 2 },
  ];

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
    {
      title: "Profit Factor",
      value: "0",
      icon: Scale,
      color: "text-primary",
    },
    {
      title: "Avg R Multiple",
      value: "0R",
      icon: Target,
      color: "text-success",
    },
    {
      title: "Sharpe Ratio",
      value: "0",
      icon: Activity,
      color: "text-warning",
    },
    {
      title: "Max Drawdown",
      value: "0%",
      icon: TrendingUp,
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
          <Card className="p-6 glass-panel animate-fade-up">
            <h3 className="text-lg font-semibold mb-4">Equity Curve</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={equityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-6 glass-panel animate-fade-up">
            <h3 className="text-lg font-semibold mb-4">R Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={rDistributionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="r" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
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
