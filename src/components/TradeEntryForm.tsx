
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
  HelpCircle,
  ChartCandlestick,
  Coins,
  BookOpen,
  ChartLine,
  Scale
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
      toast.error("Daily trading limit reached. Review your trades before continuing.");
      return;
    }

    const formElement = e.target as HTMLFormElement;
    const formData = new FormData(formElement);
    
    if (!formData.get("marketCondition") || !formData.get("setup")) {
      toast.error("Please provide market conditions and setup details");
      return;
    }

    if (formData.get("psychology") === "REVENGE" || formData.get("psychology") === "FOMO") {
      toast.error("Trading not recommended in current psychological state");
      return;
    }

    const entry = Number(formData.get("entry"));
    const stopLoss = Number(formData.get("stoploss"));
    const target = Number(formData.get("target"));
    
    if (!entry || !stopLoss || !target) {
      toast.error("Please fill in all price levels");
      return;
    }

    const riskPerTrade = (entry - stopLoss) / entry * 100;
    const rewardPotential = (target - entry) / entry * 100;
    const riskRewardRatio = rewardPotential / riskPerTrade;

    if (riskRewardRatio < 1.5) {
      toast.warning("Risk-Reward ratio below 1.5. Consider revising your levels.");
      return;
    }

    const positionSize = Math.floor((initialCapital * (riskPerTrade / 100)) / (entry - stopLoss));
    
    toast.success(`Trade logged successfully! Position size: ${positionSize} units`);
    setTradesCount(prev => prev + 1);
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
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <ChartCandlestick className="w-5 h-5" />
            Trade Entry Journal
          </h3>
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

        <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2">
            <ChartLine className="w-5 h-5 text-primary" />
            <h4 className="font-medium">Market Analysis</h4>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center">
                <Label htmlFor="marketCondition">Market Condition</Label>
                {renderTooltip("Overall market sentiment and conditions")}
              </div>
              <select
                id="marketCondition"
                name="marketCondition"
                className="w-full p-2 rounded-md border border-input bg-background"
                required
              >
                <option value="">Select market condition</option>
                <option value="BULLISH">Bullish</option>
                <option value="BEARISH">Bearish</option>
                <option value="SIDEWAYS">Range-bound</option>
                <option value="VOLATILE">Highly Volatile</option>
              </select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center">
                <Label htmlFor="setup">Trade Setup</Label>
                {renderTooltip("Specific pattern or setup being traded")}
              </div>
              <select
                id="setup"
                name="setup"
                className="w-full p-2 rounded-md border border-input bg-background"
                required
              >
                <option value="">Select setup type</option>
                <option value="BREAKOUT">Breakout</option>
                <option value="REVERSAL">Reversal</option>
                <option value="TREND">Trend Following</option>
                <option value="SUPPORT_RESISTANCE">Support/Resistance</option>
                <option value="PATTERN">Chart Pattern</option>
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2">
            <Coins className="w-5 h-5 text-primary" />
            <h4 className="font-medium">Position Sizing & Risk Calculator</h4>
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

        <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-primary" />
            <h4 className="font-medium">Trade Details</h4>
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
        </div>

        <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2">
            <BrainCircuit className="w-5 h-5 text-primary" />
            <h4 className="font-medium">Trading Psychology</h4>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center">
                <Label htmlFor="preTradeEmotion">Pre-Trade Emotion</Label>
                {renderTooltip("How do you feel before taking this trade?")}
              </div>
              <select
                id="preTradeEmotion"
                name="preTradeEmotion"
                className="w-full p-2 rounded-md border border-input bg-background"
                required
              >
                <option value="">Select emotion</option>
                <option value="CONFIDENT">Confident & Calm</option>
                <option value="FEARFUL">Fearful</option>
                <option value="EXCITED">Excited</option>
                <option value="FOMO">FOMO</option>
                <option value="REVENGE">Revenge Trading Urge</option>
              </select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center">
                <Label htmlFor="planAdherence">Trading Plan Adherence</Label>
                {renderTooltip("Are you following your trading plan?")}
              </div>
              <select
                id="planAdherence"
                name="planAdherence"
                className="w-full p-2 rounded-md border border-input bg-background"
                required
              >
                <option value="">Select adherence</option>
                <option value="FULL">Following Plan 100%</option>
                <option value="PARTIAL">Partial Deviation</option>
                <option value="NONE">Not Following Plan</option>
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            <h4 className="font-medium">Trade Journal</h4>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center">
                <Label htmlFor="setupNotes">Setup Analysis</Label>
                {renderTooltip("Describe your analysis and reasons for taking this trade")}
              </div>
              <Textarea
                id="setupNotes"
                name="setupNotes"
                placeholder="Describe your analysis, key levels, and reasons for taking this trade..."
                className="h-24"
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center">
                <Label htmlFor="riskManagement">Risk Management Notes</Label>
                {renderTooltip("Document your risk management decisions")}
              </div>
              <Textarea
                id="riskManagement"
                name="riskManagement"
                placeholder="Document your position sizing, stop loss placement reasoning..."
                className="h-24"
                required
              />
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={() => {
              if (!isJournaling) {
                setIsJournaling(true);
                toast.info("Good practice! Always journal before trading.");
              }
            }}
          >
            <BrainCircuit className="w-4 h-4 mr-2" />
            Journal First
          </Button>
          <Button 
            type="submit" 
            className="flex-1" 
            disabled={dailyLimitReached || !isJournaling}
          >
            Log Trade
          </Button>
        </div>
      </form>
    </Card>
  );
};
