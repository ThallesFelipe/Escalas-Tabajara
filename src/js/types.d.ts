export type CommonRoomKey = 'cozinha' | 'banhBaixo' | 'banhSuite' | 'sala' | 'lavabo';

export type RoomKey = CommonRoomKey | 'lavanderia';

export interface Room {
  label: string;
  key: RoomKey;
  icon: string;
}

export type Rotation = Record<CommonRoomKey, string> & { lavanderia?: string };

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
