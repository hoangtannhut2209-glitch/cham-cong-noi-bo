
export type Role = 'Admin' | 'Employee';
export type Language = 'vi' | 'en';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  department: string;
  username?: string;
  password?: string;
  avatar?: string;
}

export type AttendanceStatus = 'Present' | 'Half-day' | 'Absent' | 'Late' | 'Leave' | 'Weekend';

export interface AttendanceRecord {
  id: string;
  userId: string;
  date: string; // ISO format YYYY-MM-DD
  clockIn: string | null; // HH:mm
  clockOut: string | null; // HH:mm
  otHours: number; // Rounded to 0.5
  status: AttendanceStatus;
  note?: string;
}

export type ThemeType = 'Default' | 'Tet' | 'Noel' | 'NationalDay' | 'Liberation' | 'Custom';

export interface AppSettings {
  defaultClockIn: string;
  defaultClockOut: string;
  lunchStart: string;
  lunchEnd: string;
  departments: string[];
  theme: ThemeType;
  language: Language;
  customLogo?: string;
  primaryColor?: string;
  accentColor?: string;
}
