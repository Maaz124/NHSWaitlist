CREATE TABLE "anxiety_guides" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"completed_sections" jsonb,
	"personal_notes" jsonb,
	"symptom_checklist" jsonb,
	"coping_tools_rating" jsonb,
	"worksheet_entries" jsonb,
	"quiz_answers" jsonb,
	"action_plan_data" jsonb,
	"symptom_tracking_worksheet" jsonb,
	"personal_management_plan" jsonb,
	"progress_data" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "anxiety_modules" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"week_number" integer NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"estimated_minutes" integer NOT NULL,
	"activities_total" integer NOT NULL,
	"activities_completed" integer DEFAULT 0,
	"minutes_completed" integer DEFAULT 0,
	"is_locked" boolean DEFAULT true,
	"completed_at" timestamp,
	"last_accessed_at" timestamp,
	"content_data" jsonb,
	"user_progress" jsonb
);
--> statement-breakpoint
CREATE TABLE "lifestyle_assessments" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"exercise_frequency" numeric(3, 1),
	"exercise_types" jsonb,
	"diet_quality" numeric(3, 1),
	"social_connections" numeric(3, 1),
	"stress_management" jsonb,
	"sleep_quality" numeric(3, 1),
	"screen_time" numeric(4, 1),
	"outdoor_time" numeric(3, 1),
	"hobbies" jsonb,
	"barriers" jsonb,
	"eating_habits" jsonb,
	"nutrition_challenges" jsonb,
	"social_support" jsonb,
	"social_challenges" jsonb,
	"personal_goals" jsonb,
	"personal_notes" jsonb,
	"completed_sections" jsonb,
	"progress_data" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "module_activities" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"module_id" varchar NOT NULL,
	"activity_type" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"content" jsonb NOT NULL,
	"estimated_minutes" integer NOT NULL,
	"order_index" integer NOT NULL,
	"is_completed" boolean DEFAULT false,
	"completed_at" timestamp,
	"user_response" jsonb
);
--> statement-breakpoint
CREATE TABLE "mood_entries" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"entry_date" date NOT NULL,
	"mood" integer NOT NULL,
	"energy" integer NOT NULL,
	"anxiety" integer NOT NULL,
	"sleep" integer NOT NULL,
	"emotions" jsonb,
	"activities" jsonb,
	"thoughts" text,
	"gratitude" jsonb,
	"challenges" text,
	"wins" text,
	"notes" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "onboarding_responses" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"responses" jsonb NOT NULL,
	"risk_score" integer NOT NULL,
	"baseline_anxiety_level" text NOT NULL,
	"completed_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "payment_plans" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"price_amount" integer NOT NULL,
	"currency" varchar(3) DEFAULT 'usd',
	"interval_type" varchar(20),
	"interval_count" integer DEFAULT 1,
	"stripe_price_id" varchar,
	"stripe_product_id" varchar,
	"is_active" boolean DEFAULT true,
	"features" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "payment_transactions" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"subscription_id" varchar,
	"stripe_payment_intent_id" varchar,
	"stripe_invoice_id" varchar,
	"amount" integer NOT NULL,
	"currency" varchar(3) DEFAULT 'usd',
	"status" varchar(20) NOT NULL,
	"payment_method" varchar(50),
	"description" text,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "payment_transactions_stripe_payment_intent_id_unique" UNIQUE("stripe_payment_intent_id")
);
--> statement-breakpoint
CREATE TABLE "progress_reports" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"report_data" jsonb NOT NULL,
	"generated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "sleep_assessments" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"bed_time" varchar,
	"wake_time" varchar,
	"sleep_latency" integer,
	"night_wakes" integer,
	"sleep_quality" integer,
	"daytime_energy" integer,
	"anxiety_level" integer,
	"sleep_environment" jsonb,
	"pre_sleep_routine" jsonb,
	"hindrances" jsonb,
	"personal_plan" jsonb,
	"personal_notes" jsonb,
	"additional_notes" text,
	"completed_sections" jsonb,
	"progress_data" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "thought_records" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"situation" text NOT NULL,
	"emotion" text NOT NULL,
	"intensity" integer NOT NULL,
	"physical_sensations" text,
	"automatic_thought" text,
	"evidence_for" text,
	"evidence_against" text,
	"balanced_thought" text,
	"new_emotion" text,
	"new_intensity" integer,
	"action_plan" text,
	"selected_distortions" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_payment_methods" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"stripe_payment_method_id" varchar,
	"type" varchar(20) NOT NULL,
	"card_brand" varchar(20),
	"card_last4" varchar(4),
	"card_exp_month" integer,
	"card_exp_year" integer,
	"is_default" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "user_payment_methods_stripe_payment_method_id_unique" UNIQUE("stripe_payment_method_id")
);
--> statement-breakpoint
CREATE TABLE "user_subscriptions" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"plan_id" varchar NOT NULL,
	"stripe_subscription_id" varchar,
	"stripe_customer_id" varchar,
	"status" varchar(20) NOT NULL,
	"current_period_start" timestamp,
	"current_period_end" timestamp,
	"cancel_at_period_end" boolean DEFAULT false,
	"trial_start" timestamp,
	"trial_end" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "user_subscriptions_stripe_subscription_id_unique" UNIQUE("stripe_subscription_id")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"phone_number" text,
	"nhs_number" text,
	"has_paid" boolean DEFAULT false,
	"paid_amount" integer DEFAULT 0,
	"paid_currency" text DEFAULT 'usd',
	"is_admin" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "weekly_assessments" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"week_number" integer NOT NULL,
	"responses" jsonb NOT NULL,
	"risk_score" integer NOT NULL,
	"risk_level" text NOT NULL,
	"needs_escalation" boolean DEFAULT false,
	"completed_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "weekly_thought_records" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"module_id" varchar NOT NULL,
	"week_number" integer NOT NULL,
	"situation" text NOT NULL,
	"emotion" text NOT NULL,
	"intensity" integer NOT NULL,
	"physical_sensations" text,
	"automatic_thought" text,
	"evidence_for" text,
	"evidence_against" text,
	"balanced_thought" text,
	"new_emotion" text,
	"new_intensity" integer,
	"action_plan" text,
	"selected_distortions" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "anxiety_guides" ADD CONSTRAINT "anxiety_guides_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "anxiety_modules" ADD CONSTRAINT "anxiety_modules_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lifestyle_assessments" ADD CONSTRAINT "lifestyle_assessments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "module_activities" ADD CONSTRAINT "module_activities_module_id_anxiety_modules_id_fk" FOREIGN KEY ("module_id") REFERENCES "public"."anxiety_modules"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mood_entries" ADD CONSTRAINT "mood_entries_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "onboarding_responses" ADD CONSTRAINT "onboarding_responses_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_transactions" ADD CONSTRAINT "payment_transactions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_transactions" ADD CONSTRAINT "payment_transactions_subscription_id_user_subscriptions_id_fk" FOREIGN KEY ("subscription_id") REFERENCES "public"."user_subscriptions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "progress_reports" ADD CONSTRAINT "progress_reports_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sleep_assessments" ADD CONSTRAINT "sleep_assessments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "thought_records" ADD CONSTRAINT "thought_records_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_payment_methods" ADD CONSTRAINT "user_payment_methods_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_subscriptions" ADD CONSTRAINT "user_subscriptions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_subscriptions" ADD CONSTRAINT "user_subscriptions_plan_id_payment_plans_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."payment_plans"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "weekly_assessments" ADD CONSTRAINT "weekly_assessments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "weekly_thought_records" ADD CONSTRAINT "weekly_thought_records_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "weekly_thought_records" ADD CONSTRAINT "weekly_thought_records_module_id_anxiety_modules_id_fk" FOREIGN KEY ("module_id") REFERENCES "public"."anxiety_modules"("id") ON DELETE no action ON UPDATE no action;