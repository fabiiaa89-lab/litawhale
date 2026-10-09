import React from 'react';
import { EnergyLevel } from '../types';
import { BatteryLow, Battery, BatteryMedium, BatteryFull, Zap } from 'lucide-react';

export interface EnergyVisualConfig {
  level: EnergyLevel;
  iconName: string;
  icon: React.ReactElement;
  emoji: string;
  color: string;
  badgeBg: string;
  labelEs: string;
  labelEn: string;
  spoonsRange: string;
}

export function getEnergyVisual(level: EnergyLevel, size: number = 16): EnergyVisualConfig {
  switch (level) {
    case 1:
      return {
        level: 1,
        iconName: 'BatteryLow',
        icon: <BatteryLow size={size} className="text-rose-500 animate-pulse shrink-0" strokeWidth={2.5} />,
        emoji: '🪫',
        color: 'text-rose-500',
        badgeBg: 'bg-rose-500/15 border-rose-500/30 text-rose-300',
        labelEs: 'Crítica',
        labelEn: 'Critical',
        spoonsRange: '0-2 🥄'
      };
    case 2:
      return {
        level: 2,
        iconName: 'Battery',
        icon: <Battery size={size} className="text-amber-500 shrink-0" strokeWidth={2.2} />,
        emoji: '🪫',
        color: 'text-amber-500',
        badgeBg: 'bg-amber-500/15 border-amber-500/30 text-amber-300',
        labelEs: 'Baja',
        labelEn: 'Low',
        spoonsRange: '3-5 🥄'
      };
    case 3:
      return {
        level: 3,
        iconName: 'BatteryMedium',
        icon: <BatteryMedium size={size} className="text-yellow-400 shrink-0" strokeWidth={2.2} />,
        emoji: '🔋',
        color: 'text-yellow-400',
        badgeBg: 'bg-yellow-500/15 border-yellow-500/30 text-yellow-300',
        labelEs: 'Media',
        labelEn: 'Medium',
        spoonsRange: '6-8 🥄'
      };
    case 4:
      return {
        level: 4,
        iconName: 'BatteryFull',
        icon: <BatteryFull size={size} className="text-emerald-400 shrink-0" strokeWidth={2.2} />,
        emoji: '🔋',
        color: 'text-emerald-400',
        badgeBg: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300',
        labelEs: 'Alta',
        labelEn: 'High',
        spoonsRange: '9-10 🥄'
      };
    case 5:
    default:
      return {
        level: 5,
        iconName: 'Zap',
        icon: <Zap size={size} className="text-cyan-400 shrink-0 fill-cyan-400/30" strokeWidth={2.2} />,
        emoji: '⚡',
        color: 'text-cyan-400',
        badgeBg: 'bg-cyan-500/15 border-cyan-500/30 text-cyan-300',
        labelEs: 'Máxima',
        labelEn: 'Maximum',
        spoonsRange: '11-12 🥄'
      };
  }
}

export function spoonsToEnergyLevel(spoons: number): EnergyLevel {
  if (spoons <= 2) return 1;
  if (spoons <= 5) return 2;
  if (spoons <= 8) return 3;
  if (spoons <= 10) return 4;
  return 5;
}

export function energyLevelToSpoons(level: EnergyLevel): number {
  switch (level) {
    case 1: return 2;
    case 2: return 4;
    case 3: return 7;
    case 4: return 10;
    case 5: default: return 12;
  }
}
