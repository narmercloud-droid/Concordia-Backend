import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import ProfileDetails from "../../components/ProfileDetails.js";

async function fetchProfile(token: string) {
  const response = await fetch("http://localhost:3001/api/v1/customers/profile", {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error("Failed to fetch profile");
  }

  return response.json();
}

export default async function ProfilePage() {
  const session = cookies().get("session")?.value;
  if (!session) {
    redirect("/login");
  }

  let profile;
  try {
    profile = await fetchProfile(session!);
  } catch {
    redirect("/login");
  }

  return (
    <div className="space-y-6">
      <ProfileDetails profile={profile} />
    </div>
  );
}
