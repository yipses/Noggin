/**
 * Platform services behind small interfaces (CLAUDE.md), so they can be
 * swapped, stubbed in tests, and added later without touching game code.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ExpoHaptics from 'expo-haptics';
import { Platform, Share } from 'react-native';

// ---------- Storage ----------
export interface KeyValueStore {
  get(key: string): Promise<string | null>;
  set(key: string, value: string): Promise<void>;
  remove(key: string): Promise<void>;
}

export const storage: KeyValueStore = {
  get: (k) => AsyncStorage.getItem(k),
  set: (k, v) => AsyncStorage.setItem(k, v),
  remove: (k) => AsyncStorage.removeItem(k),
};

export function memoryStore(): KeyValueStore {
  const m = new Map<string, string>();
  return {
    get: async (k) => m.get(k) ?? null,
    set: async (k, v) => void m.set(k, v),
    remove: async (k) => void m.delete(k),
  };
}

// ---------- Haptics ----------
export interface Haptics {
  tap(): void;
  right(): void;
  wrong(): void;
  celebrate(): void;
}

const noHaptics = Platform.OS === 'web';
const safe = (fn: () => Promise<unknown>) => {
  if (noHaptics) return;
  fn().catch(() => {});
};

export const haptics: Haptics = {
  tap: () => safe(() => ExpoHaptics.selectionAsync()),
  right: () => safe(() => ExpoHaptics.impactAsync(ExpoHaptics.ImpactFeedbackStyle.Light)),
  wrong: () => safe(() => ExpoHaptics.notificationAsync(ExpoHaptics.NotificationFeedbackType.Warning)),
  celebrate: () => safe(() => ExpoHaptics.notificationAsync(ExpoHaptics.NotificationFeedbackType.Success)),
};

// ---------- Sharing ----------
export interface Sharing {
  shareText(message: string): Promise<void>;
}

export const sharing: Sharing = {
  async shareText(message) {
    try {
      await Share.share({ message });
    } catch {
      // Player cancelled or sharing is unavailable; nothing to do.
    }
  },
};

// ---------- Not built yet: stubs so call sites can exist ----------
/** Ads: light, never forced between drills (design.md section 9). */
export interface Ads {
  showEndOfSession(): Promise<void>;
}
export const ads: Ads = { showEndOfSession: async () => {} };

/** One "own it forever" unlock. Cosmetics are never sold. */
export interface Purchases {
  hasUnlock(): Promise<boolean>;
  buyUnlock(): Promise<boolean>;
}
export const purchases: Purchases = { hasUnlock: async () => false, buyUnlock: async () => false };

/** A daily reminder from the noggin (at release). */
export interface Notifications {
  scheduleDailyReminder(hour: number, minute: number): Promise<void>;
  cancelAll(): Promise<void>;
}
export const notifications: Notifications = { scheduleDailyReminder: async () => {}, cancelAll: async () => {} };
