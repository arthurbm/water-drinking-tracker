CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(64),
	"password" varchar(64)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "water_intakes" (
	"id" serial PRIMARY KEY NOT NULL,
	"date" date,
	"cups" integer,
	"user_id" integer
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "water_intakes" ADD CONSTRAINT "water_intakes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
