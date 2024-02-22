import { redirect } from "next/navigation";
import { auth, signOut } from "@/app/auth";
import { HydrationTracker } from "@/components/hydration-tracker";
import { Button } from "@/components/ui/button";

export default async function ProtectedPage() {
  let session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen flex-col justify-center">
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
        await signOut({
          redirectTo: "/login",
        });
      }}
      className="flex w-full justify-center"
    >
      <Button variant={"link"} type="submit">
        Sair
      </Button>
    </form>
  );
}
