// Add admin email addresses here
export const ADMIN_EMAILS = [
  "admin@recipewizardry.com",
  // Add more admin emails below:
];

export const isAdminEmail = (email: string | undefined): boolean => {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase());
};
