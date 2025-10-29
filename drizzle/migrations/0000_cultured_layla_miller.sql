CREATE TABLE "camps" (
	"name" varchar(255) PRIMARY KEY NOT NULL,
	"type" varchar(20) NOT NULL,
	"borough" varchar(255) NOT NULL,
	"age_range" jsonb NOT NULL,
	"languages" text[] NOT NULL,
	"dates" jsonb NOT NULL,
	"hours" varchar(255),
	"cost_amount" numeric(10, 2) NOT NULL,
	"cost_period" varchar(20) NOT NULL,
	"financial_aid" varchar(500) NOT NULL,
	"link" varchar(500) NOT NULL,
	"phone" varchar(50) NOT NULL,
	"phone_extension" varchar(20),
	"notes" text
);
