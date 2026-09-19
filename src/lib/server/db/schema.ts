import { sql } from 'drizzle-orm';
import { integer, pgTable, serial, text, timestamp, primaryKey } from 'drizzle-orm/pg-core';

export const courses = pgTable("courses", {
    id: text("id").primaryKey(),
    title: text("title").notNull(),
    level: text("level").notNull(),
    examBoard: text("exam_board"),
    gradeScale: text("grade_scale"),
}).enableRLS();

export const courseTopics = pgTable("course_topics", {
    id: text("id").notNull(),
    courseId: text("course_id").notNull(),
    title: text("title").notNull(),
    index: integer("index").notNull(),
}, (table) => [
    primaryKey({ columns: [table.id, table.courseId] }),
]).enableRLS();

export const lessons = pgTable("lessons", {
    id: text("id").primaryKey(),
    title: text("title").notNull(),
    readContent: text("read_content"),
    prerequisites: text("prerequisites").array().notNull().default(sql`'{}'::text[]`),
}).enableRLS();

export const topicLessons = pgTable("topic_lessons", {
    lessonId: text("lesson_id").notNull(),
    courseId: text("course_id").notNull(),
    topicId: text("topic_id").notNull(),
}, (table) => [
    primaryKey({ columns: [table.courseId, table.topicId, table.lessonId] }),
]).enableRLS();

