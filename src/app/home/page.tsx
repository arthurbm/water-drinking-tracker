import { redirect } from "next/navigation";
import { auth, signOut } from "@/app/auth";
import { HydrationTracker } from "@/components/hydration-tracker";

export default async function ProtectedPage() {
  let session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex flex-col justify-center min-h-screen">
      <HydrationTracker />
      <SignOut />
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
