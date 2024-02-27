"use client";

import React, { useOptimistic, useTransition } from "react";
import { addCup, removeCup } from "@/lib/actions";
import { WaterIntake } from "@/lib/db";
import { toast } from "sonner";
import { RainOfCups } from "./rain-of-cups";
import { Button } from "./ui/button";

interface HydrationTrackerFormProps {
  userId: number;
  waterIntakes: WaterIntake[];
}

export function HydrationTrackerForm({
  userId,
  waterIntakes,
}: HydrationTrackerFormProps) {
  const formatDateKey = (date: Date) =>
    `${date.getFullYear()}-${date.getMonth()}-${date.getDay()}`;

  const [state, mutate] = useOptimistic(
    waterIntakes,
    (
      state,
      { date, operation }: { date: Date; operation: "add" | "remove" },
    ) => {
      const newStateKey = formatDateKey(date);
      let found = false;

      const updatedState = state.map((waterIntake) => {
        const waterIntakeKey = formatDateKey(waterIntake.date);
        if (newStateKey === waterIntakeKey) {
          found = true;
          return {
            ...waterIntake,
            cups:
              operation === "add"
                ? waterIntake.cups + 1
                : Math.max(waterIntake.cups - 1, 0),
          };
        }
        return waterIntake;
      });

      if (!found && operation === "add") {
        updatedState.push({
          date: date,
          cups: 1,
          id: Math.random(), // Consider a more robust ID generation strategy for production
          user_id: userId,
        });
      }

      return updatedState;
    },
  );

  const handleAddCup = async () => {
    mutate({ date: new Date(), operation: "add" });
    await addCup(userId, new Date());
  };

  const handleRemoveCup = async () => {
    mutate({ date: new Date(), operation: "remove" });
    try {
      await removeCup(userId, new Date());
    } catch (error) {
      toast("Erro ao remover copo");
    }
  };

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

  const totalCups = state?.reduce((acc, curr) => acc + curr.cups, 0) || 0;

  return (
    <>
      <div className="flex flex-col items-center gap-2">
        <p className="text-center ">
          Total: {state?.reduce((acc, curr) => acc + curr.cups, 0) || 0}
        </p>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <GlassWaterIcon className="h-6 w-6" />
            <span className="text-2xl font-semibold">
              {state && state[0] ? state[0].cups : 0}
            </span>
          </div>
          <span className="text-2xl">/ ??</span>
        </div>
      </div>
      <div className="flex w-full max-w-sm flex-col gap-4">
        <div className="grid w-full gap-4 md:grid-cols-2">
          <form action={handleAddCup}>
            <Button className="w-full" variant="outline">
              + 1 Copo
            </Button>
          </form>
          <form action={handleRemoveCup}>
            <Button className="w-full" variant="outline">
              - 1 Copo
            </Button>
          </form>{" "}
        </div>
        {state?.map((waterIntake) => (
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
        {totalCups >= 5 && <RainOfCups />}
      </div>
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
