import { useState, useEffect } from "react";

export type TimeInput = {
  hours: number;
  minutes: number;
  seconds: number;
};

export type DayOfWeek =
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
const initialDates = {
  monday: { hours: 0, minutes: 0, seconds: 0 },
  tuesday: { hours: 0, minutes: 0, seconds: 0 },
  wednesday: { hours: 0, minutes: 0, seconds: 0 },
  thursday: { hours: 0, minutes: 0, seconds: 0 },
  friday: { hours: 0, minutes: 0, seconds: 0 },
  saturday: { hours: 0, minutes: 0, seconds: 0 },
  sunday: { hours: 0, minutes: 0, seconds: 0 },
};
export const useTimeCalculator = () => {
  const [times, setTimes] = useState<Record<DayOfWeek, TimeInput>>(
    () => initialDates
  );

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
    setTimes(initialDates);
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

  const getDayRowTime = (dayId: DayOfWeek) => {
    const time = times[dayId];
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
    DAYS, // Export DAYS for the component to use
  };
};
