import React from "react";
import { Calculator } from "lucide-react";

const TimeDurationHeader = () => {
  return (
    <div className="text-center space-y-2 pt-8">
      <div className="flex items-center justify-center gap-2 mb-4">
        <Calculator className="h-8 w-8 text-blue-600" />
        <h1 className="text-3xl font-bold text-gray-900">
          Time Duration Calculator
        </h1>
      </div>
      <p className="text-gray-600 max-w-2xl mx-auto">
        Calculate the total sum of multiple time durations. Enter your durations
        in the format &quot;01h 30m 45s&quot; and get the combined total
        instantly.
      </p>
    </div>
  );
};

export default TimeDurationHeader;
