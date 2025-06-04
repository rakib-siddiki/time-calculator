"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Clock,
  Calculator,
  RotateCcw,
  Copy,
  Check,
  Calendar,
  TrendingUp,
} from "lucide-react";

type TimeInput = {
  hours: number;
  minutes: number;
  seconds: number;
};

type DayOfWeek =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

const DAYS: { id: DayOfWeek; label: string; abbr: string }[] = [
  { id: "monday", label: "Monday", abbr: "Mon" },
  { id: "tuesday", label: "Tuesday", abbr: "Tue" },
  { id: "wednesday", label: "Wednesday", abbr: "Wed" },
  { id: "thursday", label: "Thursday", abbr: "Thu" },
  { id: "friday", label: "Friday", abbr: "Fri" },
  { id: "saturday", label: "Saturday", abbr: "Sat" },
  { id: "sunday", label: "Sunday", abbr: "Sun" },
];

const TimeCalculator = () => {
  const [times, setTimes] = useState<Record<DayOfWeek, TimeInput>>(() => ({
    monday: { hours: 0, minutes: 0, seconds: 0 },
    tuesday: { hours: 0, minutes: 0, seconds: 0 },
    wednesday: { hours: 0, minutes: 0, seconds: 0 },
    thursday: { hours: 0, minutes: 0, seconds: 0 },
    friday: { hours: 0, minutes: 0, seconds: 0 },
    saturday: { hours: 0, minutes: 0, seconds: 0 },
    sunday: { hours: 0, minutes: 0, seconds: 0 },
  }));

  const [totalTime, setTotalTime] = useState<TimeInput>({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [copied, setCopied] = useState(false);
  const [autoCalculate, setAutoCalculate] = useState(true);

  const handleTimeChange = (
    day: DayOfWeek,
    field: keyof TimeInput,
    value: number
  ) => {
    const clampedValue =
      field === "hours" ? Math.max(0, value) : Math.max(0, Math.min(59, value));

    setTimes((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: clampedValue,
      },
    }));
    setAutoCalculate(true);
  };

  const calculateTotalTime = () => {
    let totalSeconds = 0;

    Object.values(times).forEach((time) => {
      totalSeconds += time.hours * 3600 + time.minutes * 60 + time.seconds;
    });

    const hours = Math.floor(totalSeconds / 3600);
    const remainingSeconds = totalSeconds % 3600;
    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;

    setTotalTime({ hours, minutes, seconds });
  };

  const resetAllTimes = () => {
    setTimes({
      monday: { hours: 0, minutes: 0, seconds: 0 },
      tuesday: { hours: 0, minutes: 0, seconds: 0 },
      wednesday: { hours: 0, minutes: 0, seconds: 0 },
      thursday: { hours: 0, minutes: 0, seconds: 0 },
      friday: { hours: 0, minutes: 0, seconds: 0 },
      saturday: { hours: 0, minutes: 0, seconds: 0 },
      sunday: { hours: 0, minutes: 0, seconds: 0 },
    });
    setTotalTime({ hours: 0, minutes: 0, seconds: 0 });
  };

  const copyTotal = async () => {
    const totalString = `${String(totalTime.hours).padStart(2, "0")}h ${String(
      totalTime.minutes
    ).padStart(2, "0")}m ${String(totalTime.seconds).padStart(2, "0")}s`;
    try {
      await navigator.clipboard.writeText(totalString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  const loadSampleData = () => {
    setTimes({
      monday: { hours: 8, minutes: 0, seconds: 0 },
      tuesday: { hours: 8, minutes: 0, seconds: 0 },
      wednesday: { hours: 8, minutes: 0, seconds: 0 },
      thursday: { hours: 8, minutes: 0, seconds: 0 },
      friday: { hours: 8, minutes: 0, seconds: 0 },
      saturday: { hours: 8, minutes: 0, seconds: 0 },
      sunday: { hours: 8, minutes: 0, seconds: 0 },
    });
  };

  // Auto-calculate when times change
  useEffect(() => {
    if (autoCalculate) {
      calculateTotalTime();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [times, autoCalculate]);

  const getDayRowTime = (day: DayOfWeek) => {
    const time = times[day];
    const totalSeconds = time.hours * 3600 + time.minutes * 60 + time.seconds;
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return { hours, minutes, seconds, totalSeconds };
  };

  const getWorkingDays = () => {
    return DAYS.filter((day) => {
      const { totalSeconds } = getDayRowTime(day.id);
      return totalSeconds > 0;
    }).length;
  };

  const getAverageTime = () => {
    const workingDays = getWorkingDays();
    if (workingDays === 0) return { hours: 0, minutes: 0, seconds: 0 };

    const totalSeconds =
      totalTime.hours * 3600 + totalTime.minutes * 60 + totalTime.seconds;
    const avgSeconds = Math.floor(totalSeconds / workingDays);

    return {
      hours: Math.floor(avgSeconds / 3600),
      minutes: Math.floor((avgSeconds % 3600) / 60),
      seconds: avgSeconds % 60,
    };
  };

  const avgTime = getAverageTime();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2 pt-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Calendar className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              Weekly Time Tracker
            </h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Track your daily time spent and calculate weekly totals. Perfect for
            project management, work logging, or habit tracking.
          </p>
        </div>

        <div className="grid xl:grid-cols-3 gap-6">
          {/* Main Time Table */}
          <div className="xl:col-span-2">
            <Card className="shadow-lg">
              <CardHeader className="pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Daily Time Entry
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={loadSampleData}
                      className="text-xs"
                    >
                      Load Sample
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={resetAllTimes}
                      className="text-xs"
                    >
                      <RotateCcw className="h-4 w-4 mr-1" />
                      Reset
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0 overflow-x-auto">
                {/* Excel-style Table */}
                <div className="border border-gray-300 min-w-[600px]">
                  {/* Table Header */}
                  <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white border-b-2 border-blue-800">
                    <div className="grid grid-cols-5 divide-x divide-blue-500">
                      <div className="px-2 sm:px-4 py-3 font-semibold text-center text-xs sm:text-sm uppercase tracking-wide min-w-[80px]">
                        Day
                      </div>
                      <div className="px-2 sm:px-4 py-3 font-semibold text-center text-xs sm:text-sm uppercase tracking-wide min-w-[80px]">
                        Hours
                      </div>
                      <div className="px-2 sm:px-4 py-3 font-semibold text-center text-xs sm:text-sm uppercase tracking-wide min-w-[80px]">
                        Minutes
                      </div>
                      <div className="px-2 sm:px-4 py-3 font-semibold text-center text-xs sm:text-sm uppercase tracking-wide min-w-[80px]">
                        Seconds
                      </div>
                      <div className="px-2 sm:px-4 py-3 font-semibold text-center text-xs sm:text-sm uppercase tracking-wide min-w-[100px]">
                        Total
                      </div>
                    </div>
                  </div>

                  {/* Table Body */}
                  <div className="divide-y divide-gray-300">
                    {DAYS.map((day, index) => {
                      const dayTime = getDayRowTime(day.id);
                      const hasTime = dayTime.totalSeconds > 0;
                      const isEvenRow = index % 2 === 0;

                      return (
                        <div
                          key={day.id}
                          className={`grid grid-cols-5 divide-x divide-gray-300 border-l border-r border-gray-300 hover:bg-blue-50 transition-all duration-150 group ${
                            isEvenRow ? "bg-gray-50/80" : "bg-white"
                          } ${
                            hasTime ? "ring-1 ring-blue-200 bg-blue-50/30" : ""
                          }`}
                        >
                          {/* Day Column */}
                          <div className="px-1 sm:px-4 py-2 sm:py-3 flex items-center justify-center bg-gray-100/50 border-r-2 border-gray-300">
                            <div className="text-center">
                              <div className="font-bold text-gray-800 text-xs sm:text-sm">
                                {day.abbr.toUpperCase()}
                              </div>
                              <div className="text-xs text-gray-600 font-medium hidden sm:block">
                                {day.label}
                              </div>
                            </div>
                          </div>

                          {/* Hours Input */}
                          <div className="px-1 sm:px-2 py-1 sm:py-2 flex items-center justify-center">
                            <Input
                              type="number"
                              min="0"
                              placeholder="0"
                              className="text-center border-0 shadow-none bg-transparent hover:bg-white focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-8 sm:h-10 font-mono text-sm sm:text-base font-semibold transition-all duration-150 w-full min-w-[50px]"
                              value={times[day.id].hours || ""}
                              onChange={(e) =>
                                handleTimeChange(
                                  day.id,
                                  "hours",
                                  parseInt(e.target.value) || 0
                                )
                              }
                            />
                          </div>

                          {/* Minutes Input */}
                          <div className="px-1 sm:px-2 py-1 sm:py-2 flex items-center justify-center">
                            <Input
                              type="number"
                              min="0"
                              max="59"
                              placeholder="0"
                              className="text-center border-0 shadow-none bg-transparent hover:bg-white focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-8 sm:h-10 font-mono text-sm sm:text-base font-semibold transition-all duration-150 w-full min-w-[50px]"
                              value={times[day.id].minutes || ""}
                              onChange={(e) =>
                                handleTimeChange(
                                  day.id,
                                  "minutes",
                                  parseInt(e.target.value) || 0
                                )
                              }
                            />
                          </div>

                          {/* Seconds Input */}
                          <div className="px-1 sm:px-2 py-1 sm:py-2 flex items-center justify-center">
                            <Input
                              type="number"
                              min="0"
                              max="59"
                              placeholder="0"
                              className="text-center border-0 shadow-none bg-transparent hover:bg-white focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-8 sm:h-10 font-mono text-sm sm:text-base font-semibold transition-all duration-150 w-full min-w-[50px]"
                              value={times[day.id].seconds || ""}
                              onChange={(e) =>
                                handleTimeChange(
                                  day.id,
                                  "seconds",
                                  parseInt(e.target.value) || 0
                                )
                              }
                            />
                          </div>

                          {/* Total Column */}
                          <div className="px-1 sm:px-3 py-2 sm:py-3 flex items-center justify-center bg-gray-50/80">
                            <div className="text-center">
                              {hasTime ? (
                                <div className="font-mono text-xs sm:text-sm font-bold text-gray-800 bg-green-100 px-1 sm:px-2 py-1 rounded border border-green-300">
                                  {String(dayTime.hours).padStart(2, "0")}:
                                  {String(dayTime.minutes).padStart(2, "0")}:
                                  {String(dayTime.seconds).padStart(2, "0")}
                                </div>
                              ) : (
                                <div className="text-gray-400 text-xs sm:text-sm font-mono">
                                  --:--:--
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Table Footer - Weekly Total Row */}
                  <div className="bg-gradient-to-r from-gray-700 to-gray-800 text-white border-t-2 border-gray-600">
                    <div className="grid grid-cols-5 divide-x divide-gray-600">
                      <div className="px-2 sm:px-4 py-3 sm:py-4 font-bold text-center text-xs sm:text-sm uppercase tracking-wide">
                        <span className="hidden sm:inline">WEEKLY TOTAL</span>
                        <span className="sm:hidden">TOTAL</span>
                      </div>
                      <div className="px-2 sm:px-4 py-3 sm:py-4 text-center">
                        <div className="font-mono text-sm sm:text-lg font-bold text-yellow-300">
                          {String(totalTime.hours).padStart(2, "0")}
                        </div>
                      </div>
                      <div className="px-2 sm:px-4 py-3 sm:py-4 text-center">
                        <div className="font-mono text-sm sm:text-lg font-bold text-yellow-300">
                          {String(totalTime.minutes).padStart(2, "0")}
                        </div>
                      </div>
                      <div className="px-2 sm:px-4 py-3 sm:py-4 text-center">
                        <div className="font-mono text-sm sm:text-lg font-bold text-yellow-300">
                          {String(totalTime.seconds).padStart(2, "0")}
                        </div>
                      </div>
                      <div className="px-2 sm:px-4 py-3 sm:py-4 text-center">
                        <div className="font-mono text-sm sm:text-lg font-bold text-yellow-300 bg-yellow-900/30 px-1 sm:px-3 py-1 rounded border border-yellow-600">
                          {String(totalTime.hours).padStart(2, "0")}:
                          {String(totalTime.minutes).padStart(2, "0")}:
                          {String(totalTime.seconds).padStart(2, "0")}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Summary Panel */}
          <div className="space-y-6">
            {/* Total Time */}
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

            {/* Quick Tips */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">💡 Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-gray-600">
                <p>• Values update automatically as you type</p>
                <p>• Minutes and seconds are capped at 59</p>
                <p>• Use Tab to navigate between fields quickly</p>
                <p>• Click the copy button to save your total</p>
                <p>• Load sample data to see the calculator in action</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeCalculator;
