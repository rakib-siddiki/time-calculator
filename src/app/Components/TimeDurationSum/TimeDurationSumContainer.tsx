"use client";
import React from "react";
import { useTimeDuration } from "../../hooks/useTimeDuration";
import TimeDurationHeader from "./TimeDurationHeader";
import DurationInputCard from "./DurationInputCard";
import DurationResultsCard from "./DurationResultsCard";

const TimeDurationSumContainer = () => {
  const {
    durationsString,
    setDurationsString,
    copied,
    totalDurationFormatted,
    individualDurations,
    totalCount,
    handleCopy,
    handleLoadExample,
    handleClearAll,
    exampleDurations,
  } = useTimeDuration();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <TimeDurationHeader />

        <div className="grid lg:grid-cols-2 gap-6">
          <DurationInputCard
            durationsString={durationsString}
            setDurationsString={setDurationsString}
            handleLoadExample={handleLoadExample}
            handleClearAll={handleClearAll}
            exampleDurations={exampleDurations}
          />

          <DurationResultsCard
            totalDurationFormatted={totalDurationFormatted}
            copied={copied}
            handleCopy={handleCopy}
            totalCount={totalCount}
            individualDurations={individualDurations}
          />
        </div>
      </div>
    </div>
  );
};

export default TimeDurationSumContainer;
