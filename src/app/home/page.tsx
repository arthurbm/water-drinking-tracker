import { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth, signOut } from "@/app/auth";
import { TrackerForm } from "@/components/tracker-form";
import { Button } from "@/components/ui/button";
import { getDailyIntake, getUser } from "@/lib/actions";

export default async function ProtectedPage() {
  let session = await auth();

  if (!session) {
    redirect("/login");
  }

  const user = await getUser(session?.user?.email as string);

  const waterIntakes = await getDailyIntake(user.id, new Date());

  return (
    <div className="flex min-h-screen flex-col justify-center">
      <div className="flex flex-col items-center justify-center gap-4 p-4 md:gap-8 md:p-10">
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-3xl font-bold">Rastreador de hidratação</h1>
          <p className="text-center text-gray-500 dark:text-gray-400">
            Toque nos botões para monitorar sua ingestão de água. Fique
            hidratada!
            <br />
            Um copo equivale a 300 ml
          </p>
        </div>
        <TrackerForm userId={user.id} waterIntakes={waterIntakes} />
      </div>
      <SignOut />
    </div>
  );
}

async function SignOut() {
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
