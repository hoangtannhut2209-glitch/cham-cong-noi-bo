
import { format, parse, differenceInMinutes, isAfter, setHours, setMinutes } from 'date-fns';

/**
 * Calculates OT: max(0, clockOut - 17:00), no multiplier.
 * Rounds to the nearest 0.5 hour.
 */
export const calculateOT = (clockOutStr: string): number => {
  try {
    const clockOut = parse(clockOutStr, 'HH:mm', new Date());
    const cutoff = setMinutes(setHours(new Date(), 17), 0);
    
    if (isAfter(clockOut, cutoff)) {
      const diffMinutes = differenceInMinutes(clockOut, cutoff);
      const diffHours = diffMinutes / 60;
      // Round to nearest 0.5 increment
      return Math.round(diffHours * 2) / 2;
    }
    return 0;
  } catch {
    return 0;
  }
};

/**
 * Calculates work hours excluding lunch break (11:45 - 13:15 = 1.5h)
 */
export const calculateWorkHours = (inStr: string, outStr: string): number => {
  if (!inStr || !outStr) return 0;
  const clockIn = parse(inStr, 'HH:mm', new Date());
  const clockOut = parse(outStr, 'HH:mm', new Date());
  
  const totalMinutes = differenceInMinutes(clockOut, clockIn);
  if (totalMinutes <= 0) return 0;

  // Subtract lunch break if overlap occurs
  // Break start: 11:45, Break end: 13:15
  const breakStart = setMinutes(setHours(new Date(), 11), 45);
  const breakEnd = setMinutes(setHours(new Date(), 13), 15);
  
  let actualWorkMinutes = totalMinutes;
  
  // Basic logic: if clock in is before break ends AND clock out is after break starts
  if (isAfter(clockOut, breakStart) && !isAfter(clockIn, breakEnd)) {
    const overlapStart = isAfter(clockIn, breakStart) ? clockIn : breakStart;
    const overlapEnd = isAfter(clockOut, breakEnd) ? breakEnd : clockOut;
    const overlapMinutes = differenceInMinutes(overlapEnd, overlapStart);
    if (overlapMinutes > 0) {
      actualWorkMinutes -= overlapMinutes;
    }
  }

  return Math.max(0, actualWorkMinutes / 60);
};

export const formatTime = (date: Date): string => {
  return format(date, 'HH:mm');
};

export const formatDate = (date: Date): string => {
  return format(date, 'yyyy-MM-dd');
};
