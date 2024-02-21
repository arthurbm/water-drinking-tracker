import { and, eq } from "drizzle-orm";
import { db, users, waterIntakes } from "./db";
import { genSaltSync, hashSync } from "bcrypt-ts";

export async function getUser(email: string) {
  return await db.select().from(users).where(eq(users.email, email));
}

export async function createUser(email: string, password: string) {
  let salt = genSaltSync(10);
  let hash = hashSync(password, salt);

  return await db.insert(users).values({ email, password: hash });
}

export async function getDailyIntake(user_id: number, intakeDate: Date) {
  const dateString = intakeDate.toISOString().split("T")[0];

  return await db
    .select()
    .from(waterIntakes)
    .where(
      and(eq(waterIntakes.user_id, user_id), eq(waterIntakes.date, dateString)),
    );
}

export async function addCup(user_id: number, date: Date) {
  // Check if there's already an entry for today
  let intake = await getDailyIntake(user_id, date);

  if (intake.length === 0) {
    // If not, create a new entry for today with 1 cup
    return await db
      .insert(waterIntakes)
      .values({ user_id, date: date.toISOString().split("T")[0], cups: 1 });
  } else {
    // If yes, increment the cups by 1
    const cups = intake[0]?.cups ?? 0; // Add null check and default value of 0
    return await db
      .update(waterIntakes)
      .set({ cups: cups + 1 })
      .where(eq(waterIntakes.id, intake[0].id));
  }
}

export async function removeCup(user_id: number, intakeDate: Date) {
  let intake = await getDailyIntake(user_id, intakeDate);

  // Check if the intake record exists and cups are more than 0
  if (intake && intake[0] && intake[0].cups && intake[0].cups > 0) {
    // Decrement the cups by 1
    return await db
      .update(waterIntakes)
      .set({ cups: intake[0].cups - 1 })
      .where(eq(waterIntakes.id, intake[0].id));
  } else {
    // Handle the case where there is no record for the date or cups are already 0
    // You could return an error message or handle this case as you see fit
    throw new Error(
      "No water intake record found for the date or the cups are already at 0.",
    );
  }
}
