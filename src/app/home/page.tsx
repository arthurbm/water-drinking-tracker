import { redirect } from "next/navigation";
import { auth, signOut } from "@/app/auth";
import { HydrationTracker } from "@/components/hydration-tracker";

export default async function ProtectedPage() {
  let session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex h-screen bg-black">
      <div className="flex h-screen w-screen flex-col items-center justify-center space-y-5 text-white">
        You are logged in as {session?.user?.email}
        <HydrationTracker />
        <SignOut />
      </div>
    </div>
  );
}

function SignOut() {
  return (
    <form
      action={async () => {
        "use server";
        await signOut();
      }}
    >
      <button type="submit">Sign out</button>
    </form>
  );
}
