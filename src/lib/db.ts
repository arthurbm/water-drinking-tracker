import { sql } from "@vercel/postgres";
import { relations } from "drizzle-orm";
import { date, integer, pgTable, serial, varchar } from "drizzle-orm/pg-core";
import { drizzle } from "drizzle-orm/vercel-postgres";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 64 }).notNull(),
  password: varchar("password", { length: 64 }).notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  waterIntakes: many(waterIntakes),
}));

export type User = typeof users.$inferSelect; // return type when queried
export type NewUser = typeof users.$inferInsert; // insert type

export const waterIntakes = pgTable("water_intakes", {
  id: serial("id").primaryKey(),
  date: date("date").notNull(),
  cups: integer("cups").notNull(),
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
    waterIntakes,
  }
});