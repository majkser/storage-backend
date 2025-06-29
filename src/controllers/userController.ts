import { getUserByEmail } from "../models/userModel";

export async function getUserIdByEmail(email: string): Promise<string | null> {
  const user = await getUserByEmail(email);
  return user ? user.id ?? null : null;
}
