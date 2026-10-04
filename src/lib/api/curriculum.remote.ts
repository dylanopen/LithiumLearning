import { query } from '$app/server';
import { db } from '$lib/server/db';
import { lessons, topicLessons, courses, courseTopics } from '$lib/server/db/schema';
import { Course, CourseTopic } from '$lib/types/curriculum';
import { Lesson } from '$lib/types/lesson';
import { sql } from 'drizzle-orm';
import * as v from 'valibot';
import { fetchQuestionsByLessonId } from './lesson.remote';

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
            row.examBoard,
            row.gradeScale,
        );
    }
)

export const fetchCourseTopicsByCourseId = query(
    v.object({
        courseId: v.string(),
    }),
    async ({ courseId }): Promise<CourseTopic[]> => {
        const data = await db.execute<typeof courseTopics.$inferSelect>(sql`
                                SELECT *
                                FROM ${courseTopics}
                                WHERE ${courseTopics.courseId} = ${courseId}
                                `);
        return data.map((row) => new CourseTopic(
            row.topicId,
            row.courseId,
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
        const data = await db.execute<typeof courseTopics.$inferSelect>(sql`
                                SELECT *
                                FROM ${courseTopics}
                                WHERE ${courseTopics.courseId} = ${courseId}
                                AND ${courseTopics.topicId} = ${topicId}
                                `);
        const row = data[0];
        return new CourseTopic(
            row.topicId,
            row.courseId,
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
                                JOIN ${topicLessons} tl ON l.${lessons.id} = tl.${topicLessons.lessonId}
                                WHERE tl.${topicLessons.courseId} = ${courseId}
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
                                JOIN ${topicLessons} tl ON l.${lessons.id} = tl.${topicLessons.lessonId}
                                WHERE tl.${topicLessons.topicId} = ${topicId}
                                AND tl.${topicLessons.courseId} = ${courseId}
                                `);
        return await Promise.all(data.map(parseLessonData));
    }
)

const parseLessonData = async (lessonData: typeof lessons.$inferSelect): Promise<Lesson> => {
    return new Lesson(
        lessonData.id,
        lessonData.title,
        lessonData.readContent,
        await fetchQuestionsByLessonId({ lessonId: lessonData.id }),
    );
};

