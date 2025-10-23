CREATE TABLE `categories` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`slug` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `category_slug_idx` ON `categories` (`slug`);--> statement-breakpoint
CREATE TABLE `post_categories` (
	`post_id` integer NOT NULL,
	`category_id` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `unique_post_category` ON `post_categories` (`post_id`,`category_id`);--> statement-breakpoint
CREATE TABLE `posts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`content` text NOT NULL,
	`slug` text NOT NULL,
	`author` text NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`published` integer DEFAULT false NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `post_slug_idx` ON `posts` (`slug`);