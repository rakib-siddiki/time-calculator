"use client";
import React, { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Clock, Calculator, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const parseDurationToSeconds = (duration: string) => {
  let totalSeconds = 0;
  const parts = duration.match(/(\d+h)?\s*(\d+m)?\s*(\d+s)?/i);

  if (parts) {
    const hoursMatch = parts[1];
    const minutesMatch = parts[2];
    const secondsMatch = parts[3];

    if (hoursMatch) {
      totalSeconds += parseInt(hoursMatch, 10) * 3600;
    }
    if (minutesMatch) {
      totalSeconds += parseInt(minutesMatch, 10) * 60;
    }
    if (secondsMatch) {
      totalSeconds += parseInt(secondsMatch, 10);
    }
  }
  return totalSeconds;
};

const formatSecondsToHMS = (totalSeconds: number) => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const paddedHours = hours.toString().padStart(2, "0");
  const paddedMinutes = minutes.toString().padStart(2, "0");
  const paddedSeconds = seconds.toString().padStart(2, "0");

  return `${paddedHours}h ${paddedMinutes}m ${paddedSeconds}s`;
};

const GetSumOfTotalTime = ({
  durationsString,
}: {
  durationsString: string;
}) => {
  const { totalDurationFormatted, individualDurations, totalCount } =
    useMemo(() => {
      if (!durationsString.trim()) {
        return {
          totalDurationFormatted: "00h 00m 00s",
          individualDurations: [],
          totalCount: 0,
        };
      }

      // Split the input string by any non-numeric and non-'hms' characters to get individual duration strings
      const durationStrings = durationsString
        .split(/(\d+h\s*\d+m\s*\d+s)|\s*\n+/i)
        .filter(Boolean)
        .map((s) => s.trim())
        .filter((s) => s.length > 0 && /(\d+h|\d+m|\d+s)/i.test(s));

      let overallTotalSeconds = 0;
      const durations: {
        original: string;
        formatted: string;
        seconds: number;
      }[] = [];

      durationStrings.forEach((durationStr) => {
        const seconds = parseDurationToSeconds(durationStr);
        overallTotalSeconds += seconds;
        durations.push({
          original: durationStr,
          formatted: formatSecondsToHMS(seconds),
          seconds,
        });
      });

      return {
        totalDurationFormatted: formatSecondsToHMS(overallTotalSeconds),
        individualDurations: durations,
        totalCount: durations.length,
      };
    }, [durationsString]);

  return { totalDurationFormatted, individualDurations, totalCount };
};

const TimeDurationCalculator = () => {
  const [durationsString, setDurationsString] = useState("");
  const [copied, setCopied] = useState(false);
  const { totalDurationFormatted, individualDurations, totalCount } =
    GetSumOfTotalTime({ durationsString });

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(totalDurationFormatted);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  const exampleDurations = "01h 30m 45s\n02h 15m 30s\n00h 45m 15s";

  const handleLoadExample = () => {
    setDurationsString(exampleDurations);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2 pt-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Calculator className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              Time Duration Calculator
            </h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Calculate the total sum of multiple time durations. Enter your
            durations in the format &quot;01h 30m 45s&quot; and get the combined
            total instantly.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input Section */}
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
                  placeholder="Enter durations here...&#10;01h 30m 45s&#10;02h 15m 30s&#10;00h 45m 15s"
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
                  onClick={() => setDurationsString("")}
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

          {/* Results Section */}
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
                  <p className="text-2xl font-bold text-blue-600">
                    {totalCount}
                  </p>
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
                          <Badge
                            variant="secondary"
                            className="font-mono text-xs"
                          >
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
        </div>
      </div>
    </div>
  );
};

export default TimeDurationCalculator;
