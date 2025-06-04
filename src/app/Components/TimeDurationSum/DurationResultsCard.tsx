import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calculator, Copy, Check, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { parseDurationToSeconds } from "../../hooks/useTimeDuration";

interface DurationResultsCardProps {
  totalDurationFormatted: string;
  copied: boolean;
  handleCopy: () => void;
  totalCount: number;
  individualDurations: {
    original: string;
    formatted: string;
    seconds: number;
  }[];
}

const DurationResultsCard: React.FC<DurationResultsCardProps> = ({
  totalDurationFormatted,
  copied,
  handleCopy,
  totalCount,
  individualDurations,
}) => {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Results
        </CardTitle>
        <CardDescription>
          Total duration and breakdown of individual entries
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Total Duration */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Total Duration</p>
              <p className="text-2xl font-bold font-mono">
                {totalDurationFormatted}
              </p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleCopy}
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

        {/* Statistics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">{totalCount}</p>
            <p className="text-sm text-gray-600">Total Entries</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">
              {totalCount > 0
                ? Math.round(
                    parseDurationToSeconds(totalDurationFormatted) /
                      totalCount /
                      60
                  )
                : 0}
              m
            </p>
            <p className="text-sm text-gray-600">Avg Duration</p>
          </div>
        </div>

        {/* Individual Durations */}
        {individualDurations.length > 0 && (
          <>
            <Separator />
            <div className="space-y-2">
              <h4 className="font-semibold text-sm text-gray-700">
                Individual Durations:
              </h4>
              <div className="max-h-40 overflow-y-auto space-y-1">
                {individualDurations.map((duration, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm"
                  >
                    <span className="font-mono">{duration.original}</span>
                    <Badge variant="secondary" className="font-mono text-xs">
                      {duration.formatted}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {totalCount === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Clock className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>Enter some durations to see the total</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DurationResultsCard;
