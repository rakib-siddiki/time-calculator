import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Clock, RotateCcw } from "lucide-react";
import { DayOfWeek, TimeInput } from "../../hooks/useTimeCalculator";

interface DailyTimeEntryTableProps {
  times: Record<DayOfWeek, TimeInput>;
  DAYS: { id: DayOfWeek; label: string; abbr: string }[];
  handleTimeChange: (
    day: DayOfWeek,
    field: keyof TimeInput,
    value: number
  ) => void;
  getDayRowTime: (dayId: DayOfWeek) => {
    hours: number;
    minutes: number;
    seconds: number;
    totalSeconds: number;
  };
  loadSampleData: () => void;
  resetAllTimes: () => void;
  totalTime: TimeInput;
}

const DailyTimeEntryTable: React.FC<DailyTimeEntryTableProps> = ({
  times,
  DAYS,
  handleTimeChange,
  getDayRowTime,
  loadSampleData,
  resetAllTimes,
  totalTime,
}) => {
  return (
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
                  } ${hasTime ? "ring-1 ring-blue-200 bg-blue-50/30" : ""}`}
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
  );
};

export default DailyTimeEntryTable;
