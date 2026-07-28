const defaultAdminEmails = [
  "vmbundi@usiu.ac.ke",
  "rkinya7@gmail.com",
];

const envAdminEmails = (import.meta.env.VITE_ADMIN_EMAILS ?? "")
  .split(",")
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);

const ADMIN_EMAIL_ALLOWLIST = new Set(
  (envAdminEmails.length > 0 ? envAdminEmails : defaultAdminEmails).map((email) => email.toLowerCase())
);

export const isAuthorizedAdminEmail = (email?: string | null) => {
  if (!email) return false;
  return ADMIN_EMAIL_ALLOWLIST.has(email.toLowerCase());
};
