// Oturum ve şifre yardımcıları — sadece Web Crypto API kullanır, böylece aynı kod
// hem Node runtime'da (server action'lar, API route'lar) hem de Edge runtime'da
// (proxy.ts) değişiklik yapmadan çalışır.

export const SESSION_COOKIE_NAME = "lz_admin_session";
const SESSION_MAX_AGE_SECONDS = 8 * 60 * 60; // 8 saat

function getSessionSecret(): string {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    // Üretimde mutlaka AUTH_SECRET ortam değişkeni tanımlanmalı.
    console.warn(
      "[auth] AUTH_SECRET tanımlı değil, geçici/varsayılan bir anahtar kullanılıyor. Prod ortamında bunu .env'ye ekleyin!"
    );
    return "lernzirkel-dev-only-insecure-secret-change-me";
  }
  return secret;
}

function toHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function fromHex(hex: string) {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.substring(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

// btoa/atob sadece Latin-1 (0-255) üzerinde çalışır; Buffer ise Edge runtime'da yok.
// Bu yüzden UTF-8 byte'larını önce bir "binary string"e çevirip öyle base64'lüyoruz —
// böylece hem Node hem Edge'de, Türkçe/Almanca karakterler dahil güvenli çalışır.
function base64url(input: string): string {
  const bytes = new TextEncoder().encode(input);
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64url(input: string): string {
  const base64 = input.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}

async function hmacSign(data: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(getSessionSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(data));
  return toHex(signature);
}

// ─── Şifre Hash'leme (PBKDF2) ────────────────────────────────────────────────

const PBKDF2_ITERATIONS = 150_000;

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const keyMaterial = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, [
    "deriveBits",
  ]);
  const derivedBits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations: PBKDF2_ITERATIONS, hash: "SHA-256" },
    keyMaterial,
    256
  );
  return `${PBKDF2_ITERATIONS}.${toHex(salt.buffer as ArrayBuffer)}.${toHex(derivedBits)}`;
}

export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  const [iterationsStr, saltHex, hashHex] = storedHash.split(".");
  const iterations = parseInt(iterationsStr, 10);
  if (!iterations || !saltHex || !hashHex) return false;

  const salt = fromHex(saltHex);
  const keyMaterial = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, [
    "deriveBits",
  ]);
  const derivedBits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations, hash: "SHA-256" },
    keyMaterial,
    256
  );
  return toHex(derivedBits) === hashHex;
}

// ─── Oturum Token'ı (imzalı, şifrelenmemiş) ──────────────────────────────────

export interface SessionPayload {
  teamMemberId: string;
  name: string;
  adminRole: string;
  exp: number; // unix epoch seconds
}

export async function createSessionToken(payload: Omit<SessionPayload, "exp">): Promise<string> {
  const full: SessionPayload = { ...payload, exp: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE_SECONDS };
  const encoded = base64url(JSON.stringify(full));
  const signature = await hmacSign(encoded);
  return `${encoded}.${signature}`;
}

export async function verifySessionToken(token: string | undefined | null): Promise<SessionPayload | null> {
  if (!token) return null;
  const [encoded, signature] = token.split(".");
  if (!encoded || !signature) return null;

  const expectedSignature = await hmacSign(encoded);
  if (expectedSignature !== signature) return null;

  try {
    const payload: SessionPayload = JSON.parse(fromBase64url(encoded));
    if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

export { SESSION_MAX_AGE_SECONDS };
