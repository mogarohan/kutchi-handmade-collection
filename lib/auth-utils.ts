import { getUser } from "@/app/actions/auth";

export async function isAdmin() {
  const user = await getUser();
  if (!user) return false;
  
  // Check if the user is an admin by verifying their email domain
  // All admin accounts are created with @admin.com dummy emails
  return user.email?.endsWith("@admin.com") === true;
}

export async function verifyAdmin() {
  const isUserAdmin = await isAdmin();
  if (!isUserAdmin) {
    throw new Error("Unauthorized: Admin access required.");
  }
}
