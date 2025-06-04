import React from "react";
import { Calendar } from "lucide-react";

const TimeCalculatorHeader = () => {
  return (
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
  );
};

export default TimeCalculatorHeader;
