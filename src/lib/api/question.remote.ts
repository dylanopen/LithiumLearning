import { query } from '$app/server';
import { db } from '$lib/server/db';
import { basicQuestions } from '$lib/server/db/schema';
import { Answer, BasicQuestion, type Question } from '$lib/types/question';
import { sql } from 'drizzle-orm';
import * as v from 'valibot';

export const fetchBasicQuestionById = query(
    v.object({
        questionId: v.string(),
    }),
    async ({ questionId }): Promise<BasicQuestion | null> => {
        const basicQuestionData = await db.execute<typeof basicQuestions.$inferSelect>(sql`
            SELECT *
            FROM ${basicQuestions}
            WHERE ${basicQuestions.id} = ${questionId}
        `);
        const bq = basicQuestionData[0];
        if (!bq) {
            return null;
        }

        return new BasicQuestion(
            bq.id,
            bq.prompt,
            new Answer(bq.answers, bq.hint, bq.explanation),
        );
    }
)

