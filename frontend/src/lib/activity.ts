export interface ActivityItem {
  id: number;
  text: string;
  time: number;
}

const STORAGE_KEY = "cyberverse_activity";
const LAST_SEEN_KEY = "cyberverse_activity_last_seen";
type Listener = () => void;
const listeners: Listener[] = [];

function readAll(): ActivityItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeAll(items: ActivityItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  listeners.forEach((fn) => fn());
}

export function addActivity(text: string) {
  const items = readAll();
  items.unshift({ id: Date.now() + Math.random(), text, time: Date.now() });
  writeAll(items.slice(0, 50));
}

export function getActivities(): ActivityItem[] {
  return readAll();
}

export function subscribeActivity(fn: Listener) {
  listeners.push(fn);
  return () => {
    const i = listeners.indexOf(fn);
    if (i > -1) listeners.splice(i, 1);
  };
}

export function getUnreadCount(): number {
  const lastSeen = Number(localStorage.getItem(LAST_SEEN_KEY) || 0);
  return readAll().filter((a) => a.time > lastSeen).length;
}

export function markAllSeen() {
  localStorage.setItem(LAST_SEEN_KEY, String(Date.now()));
  listeners.forEach((fn) => fn());
}

export function timeAgo(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} min${mins > 1 ? "s" : ""} ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? "s" : ""} ago`;
}