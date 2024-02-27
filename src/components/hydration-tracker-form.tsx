"use client";

import React, { useOptimistic, useTransition } from "react";
import { revalidatePath } from "next/cache";
// import { addCupAction } from "@/actions/add-cup";
import { addCup, removeCup } from "@/lib/actions";
import { WaterIntake } from "@/lib/db";
import { GlassWaterIcon } from "lucide-react";
import { Button } from "./ui/button";

interface HydrationTrackerFormProps {
  userId: number;
  waterIntakes: WaterIntake[];
}

export function HydrationTrackerForm({
  userId,
  waterIntakes,
}: HydrationTrackerFormProps) {
  const [isPending, startTransition] = useTransition();

  const [state, mutate] = useOptimistic(
    waterIntakes,
    (state, newState: Date) => {
      const newWaterIntake = state.map((waterIntake) => {
        if (
          newState.getDate() === waterIntake.date.getDate() &&
          newState.getMonth() === waterIntake.date.getMonth() &&
          newState.getFullYear() === waterIntake.date.getFullYear()
        ) {
          return {
            ...waterIntake,
            cups: waterIntake.cups + 1,
          };
        }
        return waterIntake;
      });
      console.log(newWaterIntake);
      return newWaterIntake;
    },
  );

  function getDayFromDate(date: Date) {
    const days = [
      "Domingo",
      "Segunda",
      "Terça",
      "Quarta",
      "Quinta",
      "Sexta",
      "Sábado",
    ];
    return days[date.getDay()];
  }

  return (
    <>
      <div className="flex w-full max-w-sm flex-col gap-4">
        <div className="grid w-full gap-4 md:grid-cols-2">
          <form
            action={async () => {
              await addCup(userId, new Date());
            }}
            // onSubmit={(e) => {
            //   e.preventDefault();
            //   startTransition(() => {
            //     mutate(new Date());
            //   });
            // }}
          >
            <Button className="w-full" variant="outline">
              + 1 Copo
            </Button>
          </form>
          <form
            action={async () => {
              try {
                await removeCup(userId, new Date());
              } catch (error) {
                console.error(error);
              }
            }}
          >
            <Button className="w-full" variant="outline">
              - 1 Copo
            </Button>
          </form>{" "}
        </div>
        {waterIntakes?.map((waterIntake) => (
          <div
            key={waterIntake.id}
            className="flex items-center justify-between"
          >
            <div className="text-base">{getDayFromDate(waterIntake.date)}</div>
            <div className="flex items-center gap-2">
              {waterIntake.cups &&
                Array.from({ length: waterIntake.cups }).map((_, index) => (
                  <GlassWaterIcon key={index} />
                ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
