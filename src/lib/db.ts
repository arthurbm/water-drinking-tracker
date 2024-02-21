import { sql } from "@vercel/postgres";
import { relations } from "drizzle-orm";
import { date, integer, pgTable, serial, varchar } from "drizzle-orm/pg-core";
import { drizzle } from "drizzle-orm/vercel-postgres";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 64 }),
  password: varchar("password", { length: 64 }),
});

export const usersRelations = relations(users, ({ many }) => ({
  waterIntakes: many(waterIntakes),
}));

export const waterIntakes = pgTable("water_intakes", {
  id: serial("id").primaryKey(),
  date: date("date"),
  cups: integer("cups"),
  user_id: integer("user_id").references(() => users.id, {
    onDelete: "cascade",
  }),
});

export const waterIntakesRelations = relations(waterIntakes, ({ one }) => ({
  users: one(users, {
    fields: [waterIntakes.user_id],
    references: [users.id],
  }),
}));

export const db = drizzle(sql, {
  schema: {
    users,
    usersRelations,
    waterIntakes,
    waterIntakesRelations,
  }
});