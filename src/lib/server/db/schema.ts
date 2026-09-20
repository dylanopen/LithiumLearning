import { sql } from 'drizzle-orm';
import { foreignKey, integer, jsonb, pgEnum, pgTable, primaryKey, text } from 'drizzle-orm/pg-core';

export const courses = pgTable("courses", {
    id: text("id").primaryKey(),
    title: text("title").notNull(),
    level: text("level").notNull(),
    examBoard: text("exam_board"),
    gradeScale: text("grade_scale"),
}).enableRLS();

export const courseTopics = pgTable("course_topics", {
    id: text("id").notNull(),
    courseId: text("course_id").notNull().references(() => courses.id),
    title: text("title").notNull(),
    index: integer("index").notNull(),
}, (table) => [
    primaryKey({ columns: [table.id, table.courseId] }),
]).enableRLS();

export const lessons = pgTable("lessons", {
    id: text("id").primaryKey(),
    title: text("title").notNull(),
    readContent: text("read_content"),
    prerequisites: jsonb("prerequisites").$type<string[]>().notNull().default([]),
}).enableRLS();

export const topicLessons = pgTable("topic_lessons", {
    lessonId: text("lesson_id").notNull().references(() => lessons.id),
    courseId: text("course_id").notNull(),
    topicId: text("topic_id").notNull(),
}, (table) => [
    primaryKey({ columns: [table.courseId, table.topicId, table.lessonId] }),
    foreignKey({
        columns: [table.topicId, table.courseId],
        foreignColumns: [courseTopics.id, courseTopics.courseId],
    }),
]).enableRLS();

export const questionTypesEnum = pgEnum("question_types", ["simple", "definition", "problem"]);

export const lessonQuestions = pgTable("lesson_questions", {
    lessonId: text("lesson_id").notNull(),
    questionId: text("question_id").notNull(),
    questionType: questionTypesEnum().notNull(),
}, (table) => [
    primaryKey({ columns: [table.lessonId, table.questionId] }),
]).enableRLS();

export const simpleQuestions = pgTable("simple_questions", {
    id: text("id").primaryKey(),
    prompt: text("prompt").notNull(),
    answers: jsonb("answers").$type<string[]>().notNull().default([]),
    hint: text("hint"),
    explanation: text("explanation"),
}).enableRLS();
