
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { IndianRupee, AlertOctagon, BrainCircuit, Ban } from "lucide-react";
import { toast } from "sonner";

export const TradeEntryForm = () => {
  const [isOvertrading, setIsOvertrading] = useState(false);
  const [tradesCount, setTradesCount] = useState(0);
  const [isJournaling, setIsJournaling] = useState(false);
  const [dailyLimitReached, setDailyLimitReached] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (dailyLimitReached) {
      toast.error("Daily trading limit reached. Take a break and review your trades.");
      return;
    }

    if (tradesCount >= 5) {
      setIsOvertrading(true);
      setDailyLimitReached(true);
      toast.warning("Trading limit reached! System activated kill switch.");
      return;
    }

    const form = e.target as HTMLFormElement;
    const riskReward = parseFloat(form.target.value) / parseFloat(form.stoploss.value);
    
    if (riskReward < 1.5) {
      toast.warning("Risk-Reward ratio is below 1.5:1 - Consider reviewing this trade");
      return;
    }

    setTradesCount((prev) => prev + 1);
    toast.success("Trade logged successfully!");
  };

  const handleJournal = () => {
    setIsJournaling(true);
  };

  return (
    <Card className="p-6 glass-panel animate-fade-up">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">New Trade Entry</h3>
          <div className="flex gap-2">
            {isOvertrading && (
              <div className="flex items-center text-warning gap-2">
                <AlertOctagon className="w-5 h-5" />
                <span className="text-sm">Overtrading Risk</span>
              </div>
            )}
            {dailyLimitReached && (
              <div className="flex items-center text-destructive gap-2">
                <Ban className="w-5 h-5" />
                <span className="text-sm">Trading Locked</span>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="date">Trade Date</Label>
            <Input type="date" id="date" required />
          </div>

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

          <div className="space-y-2">
            <Label htmlFor="stoploss">Stop Loss</Label>
            <div className="relative">
              <IndianRupee className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input id="stoploss" type="number" className="pl-9" required />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity</Label>
            <Input id="quantity" type="number" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="charges">Charges & Taxes</Label>
            <div className="relative">
              <IndianRupee className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input id="charges" type="number" className="pl-9" required />
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
            <option value="TIRED">Tired/Unfocused</option>
            <option value="GREEDY">Feeling Greedy</option>
          </select>
        </div>

        {isJournaling && (
          <div className="space-y-2">
            <Label htmlFor="journal">Trade Journal Entry</Label>
            <Textarea
              id="journal"
              placeholder="Document your trade setup, reasons for entry, and current market conditions..."
              className="h-32"
            />
          </div>
        )}

        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={handleJournal}
          >
            <BrainCircuit className="w-4 h-4 mr-2" />
            Journal First
          </Button>
          <Button type="submit" className="flex-1" disabled={dailyLimitReached}>
            Log Trade
          </Button>
        </div>
      </form>
    </Card>
  );
};
