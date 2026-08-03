import "server-only";

import { auth, clerkClient } from "@clerk/nextjs/server";

export async function getAuthenticatedSeller() {
  const { userId } = await auth();
  if (!userId) return null;

  const user = await (await clerkClient()).users.getUser(userId);
  return user.publicMetadata.role === "seller" ? { userId, user } : null;
}
