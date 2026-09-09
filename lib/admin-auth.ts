import crypto from "crypto";
const COOKIE = "habesha_admin";
const TTL_SECONDS = 60 * 60 * 12;
function secret() {
  const value = process.env.ADMIN_SESSION_SECRET;
  if (!value || value.length < 32) throw new Error("ADMIN_SESSION_SECRET muss mindestens 32 Zeichen lang sein.");
  return value;
}
function signature(payload: string) { return crypto.createHmac("sha256", secret()).update(payload).digest("base64url"); }
export function adminCookieName() { return COOKIE; }
export function makeAdminToken() {
  const payload = Buffer.from(JSON.stringify({ exp: Math.floor(Date.now() / 1000) + TTL_SECONDS })).toString("base64url");
  return payload + "." + signature(payload);
}
export function validAdminToken(token?: string) {
  if (!token) return false;
  const [payload, supplied] = token.split(".");
  if (!payload || !supplied) return false;
  const expected = signature(payload);
  try {
    if (!crypto.timingSafeEqual(Buffer.from(supplied), Buffer.from(expected))) return false;
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    return Number.isInteger(data.exp) && data.exp > Math.floor(Date.now() / 1000);
  } catch { return false; }
}
