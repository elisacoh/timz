CREATE TABLE "users" (
  "id" serial PRIMARY KEY,
  "email" varchar(255) UNIQUE NOT NULL,
  "password_hash" text NOT NULL,
  "role" varchar(20) NOT NULL DEFAULT 'client',
  "name" varchar(255) NOT NULL,
  "phone" varchar(20),
  "profile_image" text,
  "created_at" timestamp DEFAULT 'now()'
);

CREATE TABLE "professionals" (
  "id" serial PRIMARY KEY,
  "user_id" int UNIQUE NOT NULL,
  "bio" text,
  "rating" float DEFAULT 0,
  "location" varchar(255),
  "created_at" timestamp DEFAULT 'now()'
);

CREATE TABLE "services" (
  "id" serial PRIMARY KEY,
  "profession_id" int NOT NULL,
  "pro_id" int NOT NULL,
  "name" varchar(255) NOT NULL,
  "description" text,
  "price" decimal(10,2) NOT NULL,
  "duration" int NOT NULL,
  "created_at" timestamp DEFAULT 'now()'
);

CREATE TABLE "waitlist" (
  "id" serial PRIMARY KEY,
  "pro_id" int NOT NULL,
  "client_id" int NOT NULL,
  "status" varchar(20) DEFAULT 'waiting',
  "created_at" timestamp DEFAULT 'now()'
);

CREATE TABLE "bookings" (
  "id" serial PRIMARY KEY,
  "client_id" int NOT NULL,
  "pro_id" int NOT NULL,
  "date" timestamp NOT NULL,
  "status" varchar(20) NOT NULL DEFAULT 'pending',
  "payment_status" varchar(20) NOT NULL DEFAULT 'unpaid',
  "urgent_booking" boolean DEFAULT false,
  "created_at" timestamp DEFAULT 'now()'
);

CREATE TABLE "payments" (
  "id" serial PRIMARY KEY,
  "user_id" int NOT NULL,
  "booking_id" int NOT NULL,
  "amount" decimal(10,2) NOT NULL,
  "status" varchar(20) NOT NULL DEFAULT 'pending',
  "payment_method" varchar(50) NOT NULL,
  "created_at" timestamp DEFAULT 'now()'
);

CREATE TABLE "chat_messages" (
  "id" serial PRIMARY KEY,
  "sender_id" int NOT NULL,
  "receiver_id" int NOT NULL,
  "conversation_id" int NOT NULL,
  "message" text NOT NULL,
  "timestamp" timestamp DEFAULT 'now()',
  "status" varchar(20) DEFAULT 'sent'
);

CREATE TABLE "reviews" (
  "id" serial PRIMARY KEY,
  "client_id" int NOT NULL,
  "pro_id" int NOT NULL,
  "rating" float NOT NULL,
  "comment" text,
  "created_at" timestamp DEFAULT 'now()'
);

CREATE TABLE "notifications" (
  "id" serial PRIMARY KEY,
  "user_id" int NOT NULL,
  "type" varchar(50) NOT NULL,
  "message" text NOT NULL,
  "status" varchar(20) DEFAULT 'unread',
  "created_at" timestamp DEFAULT 'now()'
);

CREATE TABLE "closed_clients" (
  "id" serial PRIMARY KEY,
  "pro_id" int NOT NULL,
  "client_id" int NOT NULL,
  "status" varchar(20) DEFAULT 'pending',
  "created_at" timestamp DEFAULT 'now()'
);

CREATE TABLE "portfolio" (
  "id" serial PRIMARY KEY,
  "pro_id" int NOT NULL,
  "image_url" text NOT NULL,
  "description" text,
  "created_at" timestamp DEFAULT 'now()'
);

CREATE TABLE "categories" (
  "id" serial PRIMARY KEY,
  "name" varchar(255) UNIQUE NOT NULL,
  "created_at" timestamp DEFAULT 'now()'
);

CREATE TABLE "professions" (
  "id" serial PRIMARY KEY,
  "category_id" int NOT NULL,
  "name" varchar(255) UNIQUE NOT NULL,
  "created_at" timestamp DEFAULT 'now()'
);

CREATE TABLE "professional_professions" (
  "id" serial PRIMARY KEY,
  "pro_id" int NOT NULL,
  "profession_id" int NOT NULL,
  "requires_portfolio" boolean DEFAULT false,
  "instant_booking" boolean DEFAULT false,
  "closed_list" boolean DEFAULT false,
  "urgent_service" boolean DEFAULT false,
  "created_at" timestamp DEFAULT 'now()'
);

CREATE TABLE "calendars" (
  "id" serial PRIMARY KEY,
  "pro_id" int NOT NULL,
  "profession_id" int NOT NULL,
  "available_days" text NOT NULL,
  "breaks" text,
  "days_off" text,
  "created_at" timestamp DEFAULT 'now()'
);

CREATE TABLE "professional_services" (
  "id" serial PRIMARY KEY,
  "pro_id" int NOT NULL,
  "service_id" int NOT NULL,
  "created_at" timestamp DEFAULT 'now()'
);

ALTER TABLE "professionals" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "services" ADD FOREIGN KEY ("profession_id") REFERENCES "professions" ("id");

ALTER TABLE "services" ADD FOREIGN KEY ("pro_id") REFERENCES "professionals" ("id");

ALTER TABLE "waitlist" ADD FOREIGN KEY ("pro_id") REFERENCES "professionals" ("id");

ALTER TABLE "waitlist" ADD FOREIGN KEY ("client_id") REFERENCES "users" ("id");

ALTER TABLE "bookings" ADD FOREIGN KEY ("client_id") REFERENCES "users" ("id");

ALTER TABLE "bookings" ADD FOREIGN KEY ("pro_id") REFERENCES "professionals" ("id");

ALTER TABLE "payments" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "payments" ADD FOREIGN KEY ("booking_id") REFERENCES "bookings" ("id");

ALTER TABLE "chat_messages" ADD FOREIGN KEY ("sender_id") REFERENCES "users" ("id");

ALTER TABLE "chat_messages" ADD FOREIGN KEY ("receiver_id") REFERENCES "users" ("id");

ALTER TABLE "reviews" ADD FOREIGN KEY ("client_id") REFERENCES "users" ("id");

ALTER TABLE "reviews" ADD FOREIGN KEY ("pro_id") REFERENCES "professionals" ("id");

ALTER TABLE "notifications" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "closed_clients" ADD FOREIGN KEY ("pro_id") REFERENCES "professionals" ("id");

ALTER TABLE "closed_clients" ADD FOREIGN KEY ("client_id") REFERENCES "users" ("id");

ALTER TABLE "portfolio" ADD FOREIGN KEY ("pro_id") REFERENCES "professionals" ("id");

ALTER TABLE "professions" ADD FOREIGN KEY ("category_id") REFERENCES "categories" ("id");

ALTER TABLE "professional_professions" ADD FOREIGN KEY ("pro_id") REFERENCES "professionals" ("id");

ALTER TABLE "professional_professions" ADD FOREIGN KEY ("profession_id") REFERENCES "professions" ("id");

ALTER TABLE "calendars" ADD FOREIGN KEY ("pro_id") REFERENCES "professionals" ("id");

ALTER TABLE "calendars" ADD FOREIGN KEY ("profession_id") REFERENCES "professions" ("id");

ALTER TABLE "professional_services" ADD FOREIGN KEY ("pro_id") REFERENCES "professionals" ("id");

ALTER TABLE "professional_services" ADD FOREIGN KEY ("service_id") REFERENCES "services" ("id");
