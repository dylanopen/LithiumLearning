import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const courses = pgTable("courses", {
    id: text("id").primaryKey(),
    title: text("title").notNull(),
    level: text("level").notNull(),
    examBoard: text("exam_board"),
    gradeScale: text("grade_scale"),
});

export type InsertCourse = typeof courses.$inferInsert;
export type SelectCourse = typeof courses.$inferSelect;

