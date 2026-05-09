export type RoomKey = 'cozinha' | 'banhBaixo' | 'banhSuite' | 'sala' | 'lavabo';

export interface Room {
  label: string;
  key: RoomKey;
  icon: string;
}

export type Rotation = Record<RoomKey, string>;

export interface ScheduleData {
  monTue: Rotation[];
  thuFri: Rotation[];
}

export interface WashingDay {
  dayIndex: number;
  day: string;
  users: string;
}

export interface WeekCycle {
  monTueDate: Date;
  thuFriDate: Date;
  monTueCycleIndex: number;
  thuFriCycleIndex: number;
}

export interface AppElements {
  schedule: HTMLElement | null;
  washing: HTMLElement | null;
  themeToggle: HTMLElement | null;
  themeIcon: HTMLElement | null;
  footerYear: HTMLElement | null;
}
