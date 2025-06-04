import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Calculator,
  Copy,
  Check,
  Calendar,
  TrendingUp,
  Clock,
} from "lucide-react";

interface WeeklySummaryPanelProps {
  totalTime: { hours: number; minutes: number; seconds: number };
  copied: boolean;
  copyTotal: () => void;
  getWorkingDays: () => number;
  avgTime: { hours: number; minutes: number; seconds: number };
  autoCalculate: boolean;
  calculateTotalTime: () => void;
}

const WeeklySummaryPanel: React.FC<WeeklySummaryPanelProps> = ({
  totalTime,
  copied,
  copyTotal,
  getWorkingDays,
  avgTime,
  autoCalculate,
  calculateTotalTime,
}) => {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Calculator className="h-5 w-5" />
          Weekly Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Total Time</p>
              <p className="text-2xl font-bold font-mono">
                {String(totalTime.hours).padStart(2, "0")}h{" "}
                {String(totalTime.minutes).padStart(2, "0")}m{" "}
                {String(totalTime.seconds).padStart(2, "0")}s
              </p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={copyTotal}
              className="bg-white/20 hover:bg-white/30 text-white border-white/20"
            >
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        <Separator />

        {/* Statistics */}
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">Working Days</span>
            </div>
            <Badge variant="outline" className="font-mono">
              {getWorkingDays()}/7
            </Badge>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">Avg/Day</span>
            </div>
            <Badge variant="outline" className="font-mono">
              {String(avgTime.hours).padStart(2, "0")}h{" "}
              {String(avgTime.minutes).padStart(2, "0")}m
            </Badge>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium">Total Hours</span>
            </div>
            <Badge variant="outline" className="font-mono">
              {(
                totalTime.hours +
                totalTime.minutes / 60 +
                totalTime.seconds / 3600
              ).toFixed(1)}
              h
            </Badge>
          </div>
        </div>

        {!autoCalculate && (
          <Button onClick={calculateTotalTime} className="w-full">
            Calculate Total
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default WeeklySummaryPanel;
