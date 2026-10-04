import { query } from '$app/server';
import { db } from '$lib/server/db';
import { lessons, topicLessons, courses, course_topics } from '$lib/server/db/schema';
import { Course, CourseTopic } from '$lib/types/curriculum';
import { Lesson } from '$lib/types/lesson';
import { sql } from 'drizzle-orm';
import * as v from 'valibot';
import { fetchQuestionsByLessonId } from './lesson.remote';

export const fetchCourses = query(
    async (): Promise<Course[]> => {
        const data = await db.execute<typeof courses.$inferSelect>(sql`
                                SELECT *
                                FROM ${courses}
                                `);
        console.log(JSON.stringify(data));
        return data.map((row) => new Course(
            row.id,
            row.title,
            row.level,
            row.exam_board,
            row.grade_scale,
        ));
    }
)

export const fetchCourseById = query(
    v.object({
        courseId: v.string(),
    }),
    async ({ courseId }): Promise<Course> => {
        const data = await db.execute<typeof courses.$inferSelect>(sql`
                                SELECT *
                                FROM ${courses}
                                WHERE ${courses.id} = ${courseId}
                                `);
        const row = data[0];
        return new Course(
            row.id,
            row.title,
            row.level,
            row.exam_board,
            row.grade_scale,
        );
    }
)

export const fetchCourseTopicsByCourseId = query(
    v.object({
        courseId: v.string(),
    }),
    async ({ courseId }): Promise<CourseTopic[]> => {
        const data = await db.execute<typeof course_topics.$inferSelect>(sql`
                                SELECT *
                                FROM ${course_topics}
                                WHERE ${course_topics.course_id} = ${courseId}
                                `);
        return data.map((row) => new CourseTopic(
            row.topic_id,
            row.course_id,
            row.title,
            row.index,
        ));
    }
)

export const fetchCourseTopicByCourseIdAndTopicId = query(
    v.object({
        courseId: v.string(),
        topicId: v.string(),
    }),
    async ({ courseId, topicId }): Promise<CourseTopic> => {
        const data = await db.execute<typeof course_topics.$inferSelect>(sql`
                                SELECT *
                                FROM ${course_topics}
                                WHERE ${course_topics.course_id} = ${courseId}
                                AND ${course_topics.topic_id} = ${topicId}
                                `);
        const row = data[0];
        return new CourseTopic(
            row.topic_id,
            row.course_id,
            row.title,
            row.index,
        );
    }
)

export const fetchLessonsByCourse = query(
    v.object({
        courseId: v.string(),
    }),
    async ({ courseId }): Promise<Lesson[]> => {
        const data = await db.execute<typeof lessons.$inferSelect>(sql`
                                SELECT l.*
                                FROM ${lessons} l
                                JOIN ${topicLessons} tl ON l.${lessons.id} = tl.${topicLessons.lesson_id}
                                WHERE tl.${topicLessons.course_id} = ${courseId}
                                `);
        return await Promise.all(data.map(parseLessonData));
    }
)

export const fetchLessonsByTopic = query(
    v.object({
        topicId: v.string(),
        courseId: v.string(),
    }),
    async ({ topicId, courseId }): Promise<Lesson[]> => {
        const data = await db.execute<typeof lessons.$inferSelect>(sql`
                                SELECT l.*
                                FROM ${lessons} l
                                JOIN ${topicLessons} tl ON l.${lessons.id} = tl.${topicLessons.lesson_id}
                                WHERE tl.${topicLessons.topic_id} = ${topicId}
                                AND tl.${topicLessons.course_id} = ${courseId}
                                `);
        return await Promise.all(data.map(parseLessonData));
    }
)

const parseLessonData = async (lessonData: typeof lessons.$inferSelect): Promise<Lesson> => {
    return new Lesson(
        lessonData.id,
        lessonData.title,
        lessonData.read_content,
        await fetchQuestionsByLessonId({ lessonId: lessonData.id }),
    );
};

