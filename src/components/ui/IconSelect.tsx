"use client";

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Dumbbell, Activity, HeartPulse, PersonStanding, Accessibility, Footprints, Bike, Timer, Flame, Target, Trophy, Medal, Award, Star, Zap, CircleDot, BadgeCheck, Users, UserRound, Shield, ShieldCheck, Apple, Utensils, Salad, Waves, Wind, Sparkles, CalendarDays, Clock, TrendingUp } from 'lucide-react';

export const FITNESS_ICONS = [
  { id: 'dumbbell', name: 'Dumbbell (Gym)', icon: Dumbbell },
  { id: 'activity', name: 'Activity (Pulse)', icon: Activity },
  { id: 'heart-pulse', name: 'Heart Pulse (Cardio)', icon: HeartPulse },
  { id: 'person-standing', name: 'Standing (Posture)', icon: PersonStanding },
  { id: 'accessibility', name: 'Accessibility (Flex)', icon: Accessibility },
  { id: 'footprints', name: 'Footprints (Run)', icon: Footprints },
  { id: 'bike', name: 'Bike (Cycling)', icon: Bike },
  { id: 'timer', name: 'Timer (HIIT)', icon: Timer },
  { id: 'flame', name: 'Flame (Calories)', icon: Flame },
  { id: 'target', name: 'Target (Goals)', icon: Target },
  { id: 'trophy', name: 'Trophy (Achievement)', icon: Trophy },
  { id: 'medal', name: 'Medal (Award)', icon: Medal },
  { id: 'award', name: 'Award (Cert)', icon: Award },
  { id: 'star', name: 'Star (Premium)', icon: Star },
  { id: 'zap', name: 'Zap (Energy)', icon: Zap },
  { id: 'circle-dot', name: 'Circle Dot (Core)', icon: CircleDot },
  { id: 'badge-check', name: 'Badge Check (Verified)', icon: BadgeCheck },
  { id: 'users', name: 'Users (Group)', icon: Users },
  { id: 'user-round', name: 'User (PT)', icon: UserRound },
  { id: 'shield', name: 'Shield (Safety)', icon: Shield },
  { id: 'shield-check', name: 'Shield Check', icon: ShieldCheck },
  { id: 'apple', name: 'Apple (Nutrition)', icon: Apple },
  { id: 'utensils', name: 'Utensils (Diet)', icon: Utensils },
  { id: 'salad', name: 'Salad (Healthy)', icon: Salad },
  { id: 'waves', name: 'Waves (Swim)', icon: Waves },
  { id: 'wind', name: 'Wind (Yoga/Breath)', icon: Wind },
  { id: 'sparkles', name: 'Sparkles (Recovery)', icon: Sparkles },
  { id: 'calendar-days', name: 'Calendar (Plan)', icon: CalendarDays },
  { id: 'clock', name: 'Clock (Time)', icon: Clock },
  { id: 'trending-up', name: 'Trending Up (Grow)', icon: TrendingUp },
];

export function IconSelect({ value, onChange }: { value: string, onChange: (val: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedIconObj = FITNESS_ICONS.find(i => i.id === value);
  const SelectedIcon = selectedIconObj?.icon;

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2.5 bg-white border border-zinc-300 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 text-sm flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          {selectedIconObj && SelectedIcon ? (
            <>
              <SelectedIcon size={18} className="text-primary" />
              <span className="font-medium text-gray-700">{selectedIconObj.name}</span>
            </>
          ) : (
            <span className="text-gray-400">Select an Icon...</span>
          )}
        </div>
        <ChevronDown size={16} className="text-gray-500" />
      </button>

      {isOpen && (
        <div className="absolute z-[100] w-full mt-1 bg-white border border-zinc-200 rounded-lg shadow-xl max-h-64 overflow-y-auto">
          <div className="flex flex-col gap-1 p-2">
            {FITNESS_ICONS.map((item) => {
              const Icon = item.icon;
              const isSelected = item.id === value;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onChange(item.id);
                    setIsOpen(false);
                  }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm text-left transition-colors ${
                    isSelected ? 'bg-primary/10 text-primary font-bold' : 'hover:bg-zinc-50 text-gray-700'
                  }`}
                >
                  <Icon size={16} className={isSelected ? 'text-primary' : 'text-gray-500'} />
                  <span className="truncate">{item.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
