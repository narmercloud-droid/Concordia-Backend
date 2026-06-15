/**
 * Seed scripts must receive an explicit admin password — never use a hardcoded default.
 */
export function requireSeedPassword() {
  const password = String(process.env.SEED_ADMIN_PASSWORD ?? "").trim();
  if (password.length < 12) {
    throw new Error(
      "Set SEED_ADMIN_PASSWORD (min 12 characters) before running seed scripts."
    );
  }
  return password;
}
