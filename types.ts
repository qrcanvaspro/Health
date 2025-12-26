
export enum Language {
  EN = 'en',
  HI = 'hi'
}

export interface Medicine {
  id: string;
  name: string;
  dosage: string;
  timing: string;
  stock: number;
  totalStock: number;
  lastTaken?: string;
}

export interface Reminder {
  id: string;
  medicineId: string;
  time: string; // HH:mm
  completed: boolean;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface MedicineDetails {
  name: string;
  use: string;
  dosage: string;
  sideEffects: string;
  composition: string;
}
