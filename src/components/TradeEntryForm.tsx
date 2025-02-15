
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  IndianRupee, 
  AlertOctagon, 
  BrainCircuit, 
  Ban, 
  Info,
  HelpCircle 
} from "lucide-react";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const TradeEntryForm = () => {
  const [isOvertrading, setIsOvertrading] = useState(false);
  const [tradesCount, setTradesCount] = useState(0);
  const [isJournaling, setIsJournaling] = useState(false);
  const [dailyLimitReached, setDailyLimitReached] = useState(false);
  const [initialCapital, setInitialCapital] = useState<number>(100000);
  const [riskPerTrade, setRiskPerTrade] = useState<number>(1);

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

    const formElement = e.target as HTMLFormElement;
    const formData = new FormData(formElement);
    const targetPrice = Number(formData.get("target"));
    const stopLoss = Number(formData.get("stoploss"));
    
    if (stopLoss === 0) {
      toast.error("Stop loss cannot be zero!");
      return;
    }

    const riskReward = (targetPrice - Number(formData.get("entry"))) / 
                      (Number(formData.get("entry")) - stopLoss);
    
    if (riskReward < 1.5) {
      toast.warning("Risk-Reward ratio is below 1.5:1 - Consider reviewing this trade");
      return;
    }

    // Calculate position size based on risk
    const riskAmount = initialCapital * (riskPerTrade / 100);
    const positionSize = Math.floor(riskAmount / (Number(formData.get("entry")) - stopLoss));
    
    toast.success(`Recommended position size: ${positionSize} units based on ${riskPerTrade}% risk`);
    setTradesCount((prev) => prev + 1);
  };

  const handleJournal = () => {
    setIsJournaling(true);
  };

  const renderTooltip = (content: string) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <HelpCircle className="w-4 h-4 text-muted-foreground ml-1" />
        </TooltipTrigger>
        <TooltipContent>
          <p className="max-w-xs">{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

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

        <div className="space-y-4 p-4 bg-muted/50 rounded-lg mb-6">
          <div className="flex items-center gap-2">
            <Info className="w-5 h-5 text-primary" />
            <h4 className="font-medium">Position Sizing Calculator</h4>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center">
                <Label htmlFor="initialCapital">Initial Capital</Label>
                {renderTooltip("Your total trading capital. This helps calculate safe position sizes.")}
              </div>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="initialCapital"
                  type="number"
                  className="pl-9"
                  value={initialCapital}
                  onChange={(e) => setInitialCapital(Number(e.target.value))}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center">
                <Label htmlFor="riskPerTrade">Risk Per Trade (%)</Label>
                {renderTooltip("Recommended: 1-2% of your capital per trade to manage risk effectively")}
              </div>
              <Input
                id="riskPerTrade"
                type="number"
                value={riskPerTrade}
                onChange={(e) => setRiskPerTrade(Number(e.target.value))}
                max="5"
                step="0.5"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center">
              <Label htmlFor="date">Trade Date</Label>
              {renderTooltip("Select the date of trade execution")}
            </div>
            <Input type="date" id="date" name="date" required />
          </div>

          <div className="space-y-2">
            <div className="flex items-center">
              <Label htmlFor="symbol">Stock Symbol</Label>
              {renderTooltip("Enter the stock/option symbol (e.g., RELIANCE, NIFTY)")}
            </div>
            <Input id="symbol" name="symbol" placeholder="e.g., RELIANCE" required />
          </div>

          <div className="space-y-2">
            <div className="flex items-center">
              <Label htmlFor="type">Trade Type</Label>
              {renderTooltip("Select the type of trade you're executing")}
            </div>
            <select
              id="type"
              name="type"
              className="w-full p-2 rounded-md border border-input bg-background"
              required
            >
              <option value="CALL">Call Option</option>
              <option value="PUT">Put Option</option>
              <option value="SWING">Swing Trade</option>
            </select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center">
              <Label htmlFor="entry">Entry Price</Label>
              {renderTooltip("Your planned entry price for the trade")}
            </div>
            <div className="relative">
              <IndianRupee className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input id="entry" name="entry" type="number" className="pl-9" required />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center">
              <Label htmlFor="target">Target Price</Label>
              {renderTooltip("Your profit target price (minimum 1.5:1 reward-to-risk recommended)")}
            </div>
            <div className="relative">
              <IndianRupee className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input id="target" name="target" type="number" className="pl-9" required />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center">
              <Label htmlFor="stoploss">Stop Loss</Label>
              {renderTooltip("Your maximum loss point. This is crucial for position sizing!")}
            </div>
            <div className="relative">
              <IndianRupee className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input id="stoploss" name="stoploss" type="number" className="pl-9" required />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center">
              <Label htmlFor="charges">Charges & Taxes</Label>
              {renderTooltip("Include brokerage, STT, and other applicable charges")}
            </div>
            <div className="relative">
              <IndianRupee className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input id="charges" name="charges" type="number" className="pl-9" required />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center">
            <Label htmlFor="psychology">Trading Psychology Check</Label>
            {renderTooltip("Honest assessment of your current mental state is crucial for successful trading")}
          </div>
          <select
            id="psychology"
            name="psychology"
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
            <div className="flex items-center">
              <Label htmlFor="journal">Trade Journal Entry</Label>
              {renderTooltip("Document your trade setup, analysis, and current market conditions")}
            </div>
            <Textarea
              id="journal"
              name="journal"
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
