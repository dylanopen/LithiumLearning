import { query } from '$app/server';
import { db } from '$lib/server/db';
import { lessonQuestions, lessons, basicQuestions } from '$lib/server/db/schema';
import type { Lesson } from '$lib/types/lesson';
import { Answer, BasicQuestion, type Question } from '$lib/types/question';
import { sql } from 'drizzle-orm';
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

        return {
            id: lessonData.id,
            title: lessonData.title,
            readContent: lessonData.readContent,
            questions: await fetchQuestionsByLessonId({ lessonId }),
        };
    }
)

export const fetchQuestionsByLessonId = query(
    v.object({
        lessonId: v.string(),
    }),
    async ({ lessonId }): Promise<Question[]> => {
        const basicQuestionsData = await db.execute<typeof basicQuestions.$inferSelect>(sql`
                                SELECT bq.*
                                FROM ${lessonQuestions} lq
                                INNER JOIN ${basicQuestions} bq ON lq.questionId = bq.id
                                WHERE lq.lessonId = ${lessonId}
                                AND lq.questionType = 'basic'
                                `);

        return basicQuestionsData.map((bq) => new BasicQuestion(
            bq.id,
            bq.prompt,
            new Answer(bq.answers, bq.hint, bq.explanation),
        ));
    }
)

