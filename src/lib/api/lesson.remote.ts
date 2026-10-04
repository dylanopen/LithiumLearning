import { query } from '$app/server';
import { db } from '$lib/server/db';
import { lesson_questions, lessons, basic_questions } from '$lib/server/db/schema';
import { Lesson } from '$lib/types/lesson';
import { Answer, BasicQuestion, type Question } from '$lib/types/question';
import { sql, inArray } from 'drizzle-orm';
import * as v from 'valibot';

export const fetchLessonById = query(
    v.object({
        lessonId: v.string(),
    }),
    async ({ lessonId }): Promise<Lesson | null> => {
        const data = await db.execute<typeof lessons.$inferSelect>(sql`
                                SELECT *
                                FROM ${lessons}
                                WHERE ${lessons.id} = ${lessonId}
                                `);
        const lessonData = data[0];
        if (!lessonData) {
            return null;
        }

        return new Lesson(
            lessonData.id,
            lessonData.title,
            lessonData.read_content,
        );
    }
)

export const fetchQuestionsByLessonId = query(
    v.object({
        lessonId: v.string(),
    }),
    async ({ lessonId }): Promise<Question[]> => {
        const basicQuestionsData = await db.execute<typeof basic_questions.$inferSelect>(sql`
            SELECT bq.*
            FROM ${lesson_questions} lq
            INNER JOIN ${basic_questions} bq ON lq.question_id = bq.id
            WHERE lq.lesson_id = ${lessonId}
            AND lq.question_type = 'basic'
        `);

        return basicQuestionsData.map((bq) => new BasicQuestion(
            bq.id,
            bq.prompt,
            new Answer(bq.answers, bq.hint, bq.explanation),
        ));
    }
);

export const fetchLessonPrerequisitesByLessonId = query(
    v.object({
        lessonId: v.string(),
    }),
    async ({ lessonId }): Promise<Lesson[]> => {
        const rows = await db.execute<{ prerequisites: string[] | null }>(sql`
            SELECT prerequisites
            FROM ${lessons}
            WHERE id = ${lessonId}
        `);

        const prereqIds = rows[0]?.prerequisites;

        if (!prereqIds || prereqIds.length === 0) {
            return [];
        }

        const data = await db.execute<typeof lessons.$inferSelect>(sql`
            SELECT *
            FROM ${lessons}
            WHERE ${inArray(lessons.id, prereqIds)}
        `);

        return data.map((row) => new Lesson(
            row.id,
            row.title,
            row.read_content,
        ));
    }
);
