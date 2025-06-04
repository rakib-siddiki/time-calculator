"use client";
import React from "react";
import { useTimeCalculator } from "../../hooks/useTimeCalculator";
import TimeCalculatorHeader from "./TimeCalculatorHeader";
import DailyTimeEntryTable from "./DailyTimeEntryTable";
import WeeklySummaryPanel from "./WeeklySummaryPanel";
import QuickTipsCard from "./QuickTipsCard";

const TimeCalculator = () => {
  const {
    times,
    totalTime,
    copied,
    autoCalculate,
    handleTimeChange,
    calculateTotalTime,
    resetAllTimes,
    copyTotal,
    loadSampleData,
    getDayRowTime,
    getWorkingDays,
    avgTime,
    DAYS,
  } = useTimeCalculator();

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-5xl mx-auto space-y-6">
        <TimeCalculatorHeader />

        <div className="grid xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <DailyTimeEntryTable
              times={times}
              DAYS={DAYS}
              handleTimeChange={handleTimeChange}
              getDayRowTime={getDayRowTime}
              loadSampleData={loadSampleData}
              resetAllTimes={resetAllTimes}
              totalTime={totalTime}
            />
          </div>

          <div className="space-y-6">
            <WeeklySummaryPanel
              totalTime={totalTime}
              copied={copied}
              copyTotal={copyTotal}
              getWorkingDays={getWorkingDays}
              avgTime={avgTime}
              autoCalculate={autoCalculate}
              calculateTotalTime={calculateTotalTime}
            />

            <QuickTipsCard />
          </div>
        </div>
      </div>
    </section>
  );
};

export default TimeCalculator;
