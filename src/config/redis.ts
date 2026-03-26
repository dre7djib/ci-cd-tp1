import "dotenv/config";
import { URL } from "url";
import { createClient, RedisClientType } from "redis";

const redisUrl = process.env.REDIS_URL;

if (!redisUrl) {
  throw new Error("Missing REDIS_URL environment variable");
}

type ParsedRedisUrl = {
  host: string;
  port: number;
  usernameFromUrl: string | undefined;
  passwordFromUrl: string | undefined;
  schemeIsTls: boolean;
};

/** Supports host:port, redis://user:pass@host:port, rediss://... */
function parseRedisUrl(raw: string): ParsedRedisUrl {
  const trimmed = raw.trim();
  const withScheme = /^redis[s]?:\/\//i.test(trimmed)
    ? trimmed
    : `redis://${trimmed}`;
  const u = new URL(withScheme);
  const schemeIsTls = u.protocol === "rediss:";
  const host = u.hostname;
  const port = u.port
    ? parseInt(u.port, 10)
    : schemeIsTls
      ? 6380
      : 6379;
  if (Number.isNaN(port)) {
    throw new Error("Invalid port in REDIS_URL");
  }
  const usernameFromUrl = u.username
    ? decodeURIComponent(u.username)
    : undefined;
  const passwordFromUrl = u.password
    ? decodeURIComponent(u.password)
    : undefined;
  return { host, port, usernameFromUrl, passwordFromUrl, schemeIsTls };
}

const parsed = parseRedisUrl(redisUrl);
const username =
  process.env.REDIS_USERNAME ?? parsed.usernameFromUrl ?? "default";
const passwordCandidate =
  process.env.REDIS_PASSWORD ?? parsed.passwordFromUrl;
if (!passwordCandidate) {
  throw new Error(
    "Missing REDIS_PASSWORD (or user:password embedded in REDIS_URL)"
  );
}
const password = passwordCandidate;

/** Plain Redis by default. Set REDIS_TLS=true or use rediss:// in REDIS_URL if your host requires TLS. */
const tlsEnv = process.env.REDIS_TLS;
const useTls =
  tlsEnv === "true" ||
  (tlsEnv !== "false" &&
    (parsed.schemeIsTls || /^rediss:\/\//i.test(redisUrl.trim())));

function buildConnectionUrl(): string {
  const scheme = useTls ? "rediss" : "redis";
  const u = new URL(`${scheme}://${parsed.host}:${parsed.port}`);
  u.username = username;
  u.password = password;
  return u.toString();
}

export const redisClient: RedisClientType = createClient({
  url: buildConnectionUrl(),
});

redisClient.on("error", (err) => {
  console.error("Redis client error:", err);
});

let connected = false;

export function isRedisAvailable(): boolean {
  return connected && redisClient.isOpen;
}

export async function connectRedis(): Promise<void> {
  try {
    await redisClient.connect();
    connected = true;
    console.log("Redis connected");
  } catch (err) {
    connected = false;
    console.error("Redis connection failed, running without cache:", err);
  }
}

export async function disconnectRedis(): Promise<void> {
  if (redisClient.isOpen) {
    await redisClient.quit();
  }
  connected = false;
}

/** True if the client is connected and responds to PING (for readiness probes). */
export async function pingRedis(): Promise<boolean> {
  if (!redisClient.isOpen) return false;
  try {
    const pong = await redisClient.ping();
    return pong === "PONG";
  } catch {
    return false;
  }
}

export async function cacheGetJson<T>(key: string): Promise<T | null> {
  if (!isRedisAvailable()) return null;
  try {
    const raw = await redisClient.get(key);
    if (raw == null) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export async function cacheSetJson(
  key: string,
  value: unknown,
  ttlSec: number
): Promise<void> {
  if (!isRedisAvailable()) return;
  try {
    await redisClient.set(key, JSON.stringify(value), { EX: ttlSec });
  } catch {
    /* ignore */
  }
}

export async function cacheDelKeys(...keys: string[]): Promise<void> {
  if (!isRedisAvailable() || keys.length === 0) return;
  try {
    await redisClient.del(keys);
  } catch {
    /* ignore */
  }
}

export async function cacheDelPattern(pattern: string): Promise<void> {
  if (!isRedisAvailable()) return;
  try {
    const keys = await redisClient.keys(pattern);
    if (keys.length > 0) await redisClient.del(keys);
  } catch {
    /* ignore */
  }
}
