
import { format, differenceInMinutes, isAfter } from 'date-fns';

/**
 * Calculates OT: max(0, clockOut - 17:00), no multiplier.
 * Rounds to the nearest 0.5 hour.
 */
export const calculateOT = (clockOutStr: string): number => {
  try {
    // Manually parse HH:mm as 'parse' is not available from date-fns
    const [hours, minutes] = clockOutStr.split(':').map(Number);
    const clockOut = new Date();
    clockOut.setHours(hours, minutes, 0, 0);
    
    // Use native Date.setHours instead of missing date-fns setHours/setMinutes
    const cutoff = new Date();
    cutoff.setHours(17, 0, 0, 0);
    
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
  
  // Manually parse times as 'parse' is not available
  const [inH, inM] = inStr.split(':').map(Number);
  const clockIn = new Date();
  clockIn.setHours(inH, inM, 0, 0);

  const [outH, outM] = outStr.split(':').map(Number);
  const clockOut = new Date();
  clockOut.setHours(outH, outM, 0, 0);
  
  const totalMinutes = differenceInMinutes(clockOut, clockIn);
  if (totalMinutes <= 0) return 0;

  // Subtract lunch break if overlap occurs
  // Break start: 11:45, Break end: 13:15
  const breakStart = new Date();
  breakStart.setHours(11, 45, 0, 0);
  const breakEnd = new Date();
  breakEnd.setHours(13, 15, 0, 0);
  
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
