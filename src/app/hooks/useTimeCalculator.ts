"use client";
import { useState, useEffect } from "react";

export type TimeInput = {
  hours: number;
  minutes: number;
  seconds: number;
  untracked: string;
};

export type DayOfWeek =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export const DAYS: { id: DayOfWeek; label: string; abbr: string }[] = [
  { id: "monday", label: "Monday", abbr: "Mon" },
  { id: "tuesday", label: "Tuesday", abbr: "Tue" },
  { id: "wednesday", label: "Wednesday", abbr: "Wed" },
  { id: "thursday", label: "Thursday", abbr: "Thu" },
  { id: "friday", label: "Friday", abbr: "Fri" },
  { id: "saturday", label: "Saturday", abbr: "Sat" },
  { id: "sunday", label: "Sunday", abbr: "Sun" },
];
const initialTime = {
  monday: { hours: 0, minutes: 0, seconds: 0, untracked: "" },
  tuesday: { hours: 0, minutes: 0, seconds: 0, untracked: "" },
  wednesday: { hours: 0, minutes: 0, seconds: 0, untracked: "" },
  thursday: { hours: 0, minutes: 0, seconds: 0, untracked: "" },
  friday: { hours: 0, minutes: 0, seconds: 0, untracked: "" },
  saturday: { hours: 0, minutes: 0, seconds: 0, untracked: "" },
  sunday: { hours: 0, minutes: 0, seconds: 0, untracked: "" },
};
export const useTimeCalculator = () => {
  const [times, setTimes] = useState<Record<DayOfWeek, TimeInput>>(
    () => initialTime
  );

  const [totalTime, setTotalTime] = useState<TimeInput>({
    hours: 0,
    minutes: 0,
    seconds: 0,
    untracked: "",
  });
  const [copied, setCopied] = useState(false);
  const [autoCalculate, setAutoCalculate] = useState(true);
  const [totalUntrackedSeconds, setTotalUntrackedSeconds] = useState(0);

  const parseTimeString = (timeString: string): number => {
    console.log("🚀 > parseTimeString > timeString:", timeString);
    if (!timeString.trim()) return 0;

    // Handle hh:mm:ss, hh:mm, or mm format
    const parts = timeString.split(":");
    let totalSeconds = 0;

    if (parts.length === 3) {
      // hh:mm:ss
      const hours = parseInt(parts[0], 10) || 0;
      const minutes = parseInt(parts[1], 10) || 0;
      const seconds = parseInt(parts[2], 10) || 0;
      totalSeconds = hours * 3600 + minutes * 60 + seconds;
    } else if (parts.length === 2) {
      // hh:mm
      const hours = parseInt(parts[0], 10) || 0;
      const minutes = parseInt(parts[1], 10) || 0;
      totalSeconds = hours * 3600 + minutes * 60;
    } else if (parts.length === 1) {
      // mm or h or s (if only digits)
      const value = parseInt(parts[0], 10) || 0;
      // Try to interpret as minutes first, then if not reasonable, hours
      // Or if explicitly "Xs" or "Xm" or "Xh"
      if (timeString.toLowerCase().endsWith("s")) {
        totalSeconds = parseInt(timeString.slice(0, -1), 10);
      } else if (timeString.toLowerCase().endsWith("m")) {
        totalSeconds = parseInt(timeString.slice(0, -1), 10) * 60;
      } else if (timeString.toLowerCase().endsWith("h")) {
        totalSeconds = parseInt(timeString.slice(0, -1), 10) * 3600;
      } else {
        // Default to minutes if just a number
        totalSeconds = value * 60;
      }
    }

    // Handle 1h2m format
    const hoursMatch = timeString.match(/(\d+)h/);
    const minutesMatch = timeString.match(/(\d+)m/);
    const secondsMatch = timeString.match(/(\d+)s/);

    if (hoursMatch || minutesMatch || secondsMatch) {
      const hours = hoursMatch ? parseInt(hoursMatch[1], 10) : 0;
      const minutes = minutesMatch ? parseInt(minutesMatch[1], 10) : 0;
      const seconds = secondsMatch ? parseInt(secondsMatch[1], 10) : 0;
      totalSeconds = hours * 3600 + minutes * 60 + seconds;
    }

    return totalSeconds;
  };

  const handleTimeChange = (
    day: DayOfWeek,
    field: keyof TimeInput,
    value: number | string
  ) => {
    console.log("🚀 > useTimeCalculator > value:", value);
    let processedValue = value;

    // If the field is 'untracked' and the value is a string, parse it
    if (field === "untracked" && typeof value === "string") {
      processedValue = parseTimeString(value);
    }

    // Ensure the value is a number for the rest of the function
    const numValue =
      typeof processedValue === "string"
        ? parseFloat(processedValue) || 0
        : processedValue;

    const clampedValue =
      field === "hours"
        ? Math.max(0, numValue)
        : field === "untracked"
        ? String(value)
        : Math.max(0, Math.min(59, numValue));

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
    let accumulatedUntrackedSeconds = 0;

    Object.values(times).forEach((time) => {
      const untrackedSeconds = parseTimeString(time.untracked);
      accumulatedUntrackedSeconds += untrackedSeconds;
      totalSeconds += time.hours * 3600 + time.minutes * 60 + time.seconds;
      totalSeconds -= untrackedSeconds;
    });

    const hours = Math.floor(totalSeconds / 3600);
    const remainingSeconds = totalSeconds % 3600;
    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;

    setTotalTime({ hours, minutes, seconds, untracked: "" });
    setTotalUntrackedSeconds(accumulatedUntrackedSeconds);
  };

  const resetAllTimes = () => {
    setTimes(initialTime);
    setTotalTime({ hours: 0, minutes: 0, seconds: 0, untracked: "" });
    setTotalUntrackedSeconds(0);
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
      monday: { hours: 8, minutes: 0, seconds: 0, untracked: "" },
      tuesday: { hours: 8, minutes: 0, seconds: 0, untracked: "" },
      wednesday: { hours: 8, minutes: 0, seconds: 0, untracked: "" },
      thursday: { hours: 8, minutes: 0, seconds: 0, untracked: "" },
      friday: { hours: 8, minutes: 0, seconds: 0, untracked: "" },
      saturday: { hours: 8, minutes: 0, seconds: 0, untracked: "" },
      sunday: { hours: 8, minutes: 0, seconds: 0, untracked: "" },
    });
  };

  useEffect(() => {
    if (autoCalculate) {
      calculateTotalTime();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [times, autoCalculate]);

  const getDayRowTime = (dayId: DayOfWeek) => {
    const time = times[dayId];
    const untrackedSeconds = parseTimeString(time.untracked);
    let totalSeconds = time.hours * 3600 + time.minutes * 60 + time.seconds;
    totalSeconds -= untrackedSeconds;
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

  const formatSecondsToHms = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const remainingSeconds = totalSeconds % 60;

    let formattedString = "";
    if (hours > 0) formattedString += `${hours}h `;
    if (minutes > 0) formattedString += `${minutes}m `;
    if (remainingSeconds > 0) formattedString += `${remainingSeconds}s`;

    return formattedString.trim() || "0s";
  };

  const formattedTotalUntrackedTime = formatSecondsToHms(totalUntrackedSeconds);

  const avgTime = getAverageTime();

  return {
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
    getAverageTime,
    avgTime,
    DAYS,
    totalUntrackedSeconds,
    formattedTotalUntrackedTime,
  };
};
