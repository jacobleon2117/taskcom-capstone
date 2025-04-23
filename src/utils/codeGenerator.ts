/**
 * Generates a random six-digit alphanumeric code for organization invites
 * @returns A six-digit alphanumeric code
 */
export const generateSixDigitCode = (): string => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";

  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }

  return result;
};
