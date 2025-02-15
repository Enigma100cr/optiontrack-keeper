
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IndianRupee, AlertOctagon } from "lucide-react";
import { toast } from "sonner";

export const TradeEntryForm = () => {
  const [isOvertrading, setIsOvertrading] = useState(false);
  const [tradesCount, setTradesCount] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tradesCount >= 5) {
      setIsOvertrading(true);
      toast.warning("Warning: You might be overtrading today!");
      return;
    }
    setTradesCount((prev) => prev + 1);
    toast.success("Trade logged successfully!");
  };

  return (
    <Card className="p-6 glass-panel animate-fade-up">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">New Trade Entry</h3>
          {isOvertrading && (
            <div className="flex items-center text-warning gap-2">
              <AlertOctagon className="w-5 h-5" />
              <span className="text-sm">Overtrading Risk</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="symbol">Stock Symbol</Label>
            <Input id="symbol" placeholder="e.g., RELIANCE" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Trade Type</Label>
            <select
              id="type"
              className="w-full p-2 rounded-md border border-input bg-background"
              required
            >
              <option value="CALL">Call Option</option>
              <option value="PUT">Put Option</option>
              <option value="SWING">Swing Trade</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="entry">Entry Price</Label>
            <div className="relative">
              <IndianRupee className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input id="entry" type="number" className="pl-9" required />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="target">Target Price</Label>
            <div className="relative">
              <IndianRupee className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input id="target" type="number" className="pl-9" required />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="strategy">Trading Strategy</Label>
          <Input id="strategy" placeholder="e.g., Breakout, Support/Resistance" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="psychology">Trading Psychology Check</Label>
          <select
            id="psychology"
            className="w-full p-2 rounded-md border border-input bg-background"
            required
          >
            <option value="">Select your current state</option>
            <option value="CALM">Calm and Focused</option>
            <option value="FOMO">Feeling FOMO</option>
            <option value="REVENGE">Revenge Trading Urge</option>
            <option value="CONFIDENT">Confident</option>
          </select>
        </div>

        <Button type="submit" className="w-full">
          Log Trade
        </Button>
      </form>
    </Card>
  );
};
