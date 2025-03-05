CREATE TYPE "public"."task_status" AS ENUM('pending', 'completed', 'in_progress');--> statement-breakpoint
CREATE TABLE "tasks" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text,
	"description" text,
	"status" "task_status" DEFAULT 'pending',
	"due_date" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
