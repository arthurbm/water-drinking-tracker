/**
 * This code was generated by v0 by Vercel.
 * @see https://v0.dev/t/0IsULnLly42
 */
import { revalidatePath } from "next/cache";
import { auth } from "@/app/auth";
import { Button } from "@/components/ui/button";
import { addCup, getDailyIntake, getUser, removeCup } from "@/lib/actions";
import { HydrationTrackerForm } from "./hydration-tracker-form";

export async function HydrationTracker() {
  let session = await auth();
  const user = await getUser(session?.user?.email as string);

  const waterIntakes = await getDailyIntake(user.id, new Date());

  return (
    <>
      <div className="flex flex-col items-center gap-2">
        <p className="text-center ">
          Total: {waterIntakes?.reduce((acc, curr) => acc + curr.cups, 0) || 0}
        </p>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <GlassWaterIcon className="h-6 w-6" />
            <span className="text-2xl font-semibold">
              {waterIntakes && waterIntakes[0] ? waterIntakes[0].cups : 0}
            </span>
          </div>
          <span className="text-2xl">/ ??</span>
        </div>
      </div>
      <HydrationTrackerForm userId={user.id} waterIntakes={waterIntakes} />
    </>
  );
}

function GlassWaterIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15.2 22H8.8a2 2 0 0 1-2-1.79L5 3h14l-1.81 17.21A2 2 0 0 1 15.2 22Z" />
      <path d="M6 12a5 5 0 0 1 6 0 5 5 0 0 0 6 0" />
    </svg>
  );
}
