/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Screen = 'home' | 'anchor' | 'body' | 'cave' | 'haptic' | 'cards' | 'meds' | 'crisis' | 'settings' | 'splash' | 'sos' | 'ai' | 'debts' | 'stealth' | 'companion' | 'isochronic' | 'kit' | 'books' | 'sensory-log' | 'premium' | 'arcade';

export type EnergyLevel = 1 | 2 | 3 | 4 | 5;

export type SensitivityProfile = 'HIPO' | 'MED' | 'HIPER';

export type Language = 'es' | 'en';

export type AppTheme = 'dark' | 'light';

export interface Contact {
  name: string;
  phone: string;
  relationship?: string;
}

export interface Profile {
  name: string;
  address: string;
  contacts: Contact[];
  sensitivity: SensitivityProfile;
  crisisMed: string;
  dailyMed: string;
  safeFood: string;
  userImage: string;
  contactImage: string;
  language: Language;
  bloodType: string;
  allergies: string;
  hypersensitivities: string;
  hyposensitivities: string;
  triggers: string;
  interests: string;
  supportEntity?: string;
  country?: string;
  currency?: string;
  currencySymbol?: string;
  theme?: AppTheme;
}

export interface Med {
  id: string;
  name: string;
  dose: string;
  time: string;
  confirmed: boolean;
  takenAt?: string;
  icon?: string;
}

export interface Symptom {
  id: string;
  icon: string;
  label: string;
  translation: string;
  protocol: string;
}

export interface AACCard {
  id: string;
  icon: string;
  label: string;
  text: string;
  isCustom?: boolean;
}

export interface Debt {
  id: string;
  creditor: string;
  amount: string;
  dueDate: string;
  isPaid: boolean;
}

export interface SpoonActivity {
  id: string;
  name: string;
  amount: number;
  time: string;
}

export interface SpoonState {
  total: number;
  remaining: number;
  history: SpoonActivity[];
  lastResetDate: string;
  reminderEnabled: boolean;
  reminderIntervalMinutes: number;
}

export interface SensoryLogEntry {
  id: string;
  date: string;
  time: string;
  type: 'meltdown' | 'shutdown' | 'overload' | 'burnout';
  intensity: 1 | 2 | 3 | 4 | 5;
  triggers: string[];
  sensations: string[];
  reliefStrategies: string[];
  notes?: string;
}
