CREATE TABLE "saved_smoothies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"name" text NOT NULL,
	"recipe" jsonb NOT NULL,
	"mood" jsonb,
	"user_profile" jsonb,
	"ingredients" text[],
	"goals" text[],
	"total_nutrition" jsonb,
	"cost" numeric(10, 2),
	"image_url" text,
	"notes" text,
	"is_favorite" text DEFAULT 'false',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "saved_smoothies" ADD CONSTRAINT "saved_smoothies_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;