// Minimal, clean analytics with batching, offline queue, sessioning
import * as Application from 'expo-application';
// import * as Device from 'expo-device';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

type JSONObject = Record<string, string | number | boolean | null | undefined | Record<string, any>>;

const STORAGE_QUEUE = 'anl_queue_v1';
const STORAGE_SESSION = 'anl_session_v1';
const INSTALL_ID_KEY = 'install_id_v1';
const SESSION_TIMEOUT_MS = 30 * 60 * 1000;

let installId: string;
let sessionId: string;
let lastEventTs = 0;
let queue: JSONObject[] = [];
let userProps: JSONObject = {};
let baseProps: JSONObject = {};

function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

async function getInstallId() {
  const existing = await AsyncStorage.getItem(INSTALL_ID_KEY);
  if (existing) return existing;
  const iid = `iid_${uuid()}`;
  await AsyncStorage.setItem(INSTALL_ID_KEY, iid);
  return iid;
}

async function loadQueue() {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_QUEUE);
    queue = raw ? JSON.parse(raw) : [];
  } catch {
    queue = [];
  }
}

async function saveQueue() {
  try {
    await AsyncStorage.setItem(STORAGE_QUEUE, JSON.stringify(queue));
  } catch {}
}

function newSession(): string {
  return `s_${new Date().toISOString().slice(0, 10)}_${uuid().slice(0, 8)}`;
}

async function ensureSession() {
  const now = Date.now();
  if (!sessionId) {
    const raw = await AsyncStorage.getItem(STORAGE_SESSION);
    sessionId = raw || newSession();
    await AsyncStorage.setItem(STORAGE_SESSION, sessionId);
    lastEventTs = now;
    return;
  }
  if (now - lastEventTs > SESSION_TIMEOUT_MS) {
    sessionId = newSession();
    await AsyncStorage.setItem(STORAGE_SESSION, sessionId);
  }
  lastEventTs = now;
}

export async function initAnalytics(props: Partial<typeof baseProps> = {}) {
  installId = await getInstallId();
  await loadQueue();
  baseProps = {
    app_version: Application.nativeApplicationVersion ?? '0',
    build_number: Application.nativeBuildVersion ?? '0',
    platform: Platform.OS,
    locale: 'en-US', // Device.locale ?? 'en-US',
    tz: Intl.DateTimeFormat().resolvedOptions().timeZone ?? 'UTC',
    ...props,
  };
  await ensureSession();
  drain().catch(() => {});
}

export function setUserProps(up: JSONObject) {
  userProps = { ...userProps, ...up };
}

export async function track(event: string, params: JSONObject = {}) {
  await ensureSession();
  const payload = {
    event,
    ts: Date.now(),
    session_id: sessionId,
    user_id: userProps.user_id ?? null,
    install_id: installId,
    app_version: baseProps.app_version,
    build_number: baseProps.build_number,
    platform: baseProps.platform,
    locale: baseProps.locale,
    ab_variant: userProps.ab_variant,
    user_props: {
      is_premium: !!userProps.is_premium,
      sign: userProps.sign ?? null,
      druid_sign: userProps.druid_sign ?? null,
      chinese_animal: userProps.chinese_animal ?? null,
      tz: baseProps.tz,
    },
    params,
  };
  queue.push(payload);
  if (queue.length >= 10) drain().catch(() => {});
  else saveQueue().catch(() => {});
}

async function drain() {
  if (!queue.length) return;
  const batch = queue.slice(0, 25);
  try {
    const res = await fetch('/api/v1/analytics/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(batch),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    queue = queue.slice(batch.length);
    await saveQueue();
    // Keep draining if more remain
    if (queue.length) setTimeout(() => drain(), 250);
  } catch {
    // Retry later; keep queue
  }
}
