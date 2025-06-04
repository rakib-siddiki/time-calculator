import { useState, useMemo } from "react";

export const parseDurationToSeconds = (duration: string) => {
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

export const formatSecondsToHMS = (totalSeconds: number) => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const paddedHours = hours.toString().padStart(2, "0");
  const paddedMinutes = minutes.toString().padStart(2, "0");
  const paddedSeconds = seconds.toString().padStart(2, "0");

  return `${paddedHours}h ${paddedMinutes}m ${paddedSeconds}s`;
};

export const useTimeDuration = () => {
  const [durationsString, setDurationsString] = useState("");
  const [copied, setCopied] = useState(false);

  const { totalDurationFormatted, individualDurations, totalCount } =
    useMemo(() => {
      if (!durationsString.trim()) {
        return {
          totalDurationFormatted: "00h 00m 00s",
          individualDurations: [],
          totalCount: 0,
        };
      }

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

  const handleClearAll = () => {
    setDurationsString("");
  };

  return {
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
  };
};
