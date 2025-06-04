import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Clock } from "lucide-react";

interface DurationInputCardProps {
  durationsString: string;
  setDurationsString: (value: string) => void;
  handleLoadExample: () => void;
  handleClearAll: () => void;
  exampleDurations: string;
}

const DurationInputCard: React.FC<DurationInputCardProps> = ({
  durationsString,
  setDurationsString,
  handleLoadExample,
  handleClearAll,
  exampleDurations,
}) => {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Enter Durations
        </CardTitle>
        <CardDescription>
          Input your time durations, one per line. Format: &quot;01h 30m
          45s&quot;
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="durations">Time Durations</Label>
          <Textarea
            id="durations"
            placeholder={`Enter durations here...\n${exampleDurations}`}
            className="min-h-[120px] max-h-72 font-mono text-sm"
            value={durationsString}
            onChange={(e) => setDurationsString(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleLoadExample}
            className="flex-1"
          >
            Load Example
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearAll}
            className="flex-1"
          >
            Clear All
          </Button>
        </div>

        <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-md">
          <strong>Supported formats:</strong>
          <br />• 01h 30m 45s (full format)
          <br />• 1h 30m (without seconds)
          <br />• 45m 30s (without hours)
          <br />• Mix and match as needed
        </div>
      </CardContent>
    </Card>
  );
};

export default DurationInputCard;
