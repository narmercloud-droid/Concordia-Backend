import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import ProfileDetails from "../../components/ProfileDetails.js";
import { fetchProfile } from "../../lib/serverApi.js";

export default async function ProfilePage() {
  const session = cookies().get("session")?.value;
  if (!session) {
    redirect("/login");
  }

  let profile;
  try {
    profile = await fetchProfile(session);
  } catch {
    redirect("/login");
  }

  return (
    <div className="space-y-6">
      <ProfileDetails profile={profile} />
    </div>
  );
}
