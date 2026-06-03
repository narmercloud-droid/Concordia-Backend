
const otpStore = new Map();

export function generateOtp(email) {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore.set(email, { code, expires: Date.now() + 5 * 60 * 1000 });
  return code;
}

export function verifyOtp(email, code) {
  const entry = otpStore.get(email);
  if (!entry) return false;
  if (entry.expires < Date.now()) return false;
  return entry.code === code;
}
