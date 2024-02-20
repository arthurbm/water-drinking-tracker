import { drizzle } from 'drizzle-orm/postgres-js';
import { pgTable, serial, varchar, integer, date } from 'drizzle-orm/pg-core';
import { and, eq } from 'drizzle-orm';
import postgres from 'postgres';
import { genSaltSync, hashSync } from 'bcrypt-ts';

let client = postgres(`${process.env.POSTGRES_URL!}`);
let db = drizzle(client);

let users = pgTable('User', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 64 }),
  password: varchar('password', { length: 64 }),
});

let waterIntake = pgTable('WaterIntake', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id').references(() => users.id),
  date: date('date'),
  cups: integer('cups'),
});

export async function getUser(email: string) {
  return await db.select().from(users).where(eq(users.email, email));
}

export async function createUser(email: string, password: string) {
  let salt = genSaltSync(10);
  let hash = hashSync(password, salt);

  return await db.insert(users).values({ email, password: hash });
}


export async function getDailyIntake(user_id: number, intakeDate: Date) {
  const dateString = intakeDate.toISOString().split('T')[0];

  return await db.select().from(waterIntake)
    .where(and(eq(waterIntake.user_id, user_id), eq(waterIntake.date, dateString)));
}

export async function addCup(user_id: number, date: Date) {
  // Check if there's already an entry for today
  let intake = await getDailyIntake(user_id, date);

  if (intake.length === 0) {
    // If not, create a new entry for today with 1 cup
    return await db.insert(waterIntake).values({ user_id, date: date.toISOString().split('T')[0], cups: 1 });
  } else {
    // If yes, increment the cups by 1
    const cups = intake[0]?.cups ?? 0; // Add null check and default value of 0
    return await db.update(waterIntake)
      .set({ cups: cups + 1 })
      .where(eq(waterIntake.id, intake[0].id));
  }
}

export async function removeCup(user_id: number, intakeDate: Date) {
  let intake = await getDailyIntake(user_id, intakeDate);

  // Check if the intake record exists and cups are more than 0
  if (intake && intake[0] && intake[0].cups && intake[0].cups > 0) {
    // Decrement the cups by 1
    return await db.update(waterIntake)
      .set({ cups: intake[0].cups - 1 })
      .where(eq(waterIntake.id, intake[0].id));
  } else {
    // Handle the case where there is no record for the date or cups are already 0
    // You could return an error message or handle this case as you see fit
    throw new Error('No water intake record found for the date or the cups are already at 0.');
  }
}

