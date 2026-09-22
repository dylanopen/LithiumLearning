import * as v from 'valibot';
import { db, simpleQuestions } from '$lib/server';
import { eq } from 'drizzle-orm';
import { error } from '@sveltejs/kit';
import { query } from '$app/server';

export const getQuestion = query(v.string(), async (questionId) => {
    const id = String(questionId);

    console.log("Executing backend for ID:", id);

    const [q] = await db.select().from(simpleQuestions).where(eq(simpleQuestions.id, id));
    
    if (!q) {
        throw error(404, 'Question not found');
    }

    const { correctAnswer, ...safeQuestion } = q;
    return safeQuestion;
});

export const checkAnswer = query(async ({ questionId, answer }: { questionId: string; answer: string }) => {
    const [q] = await db.select().from(simpleQuestions).where(eq(simpleQuestions.id, questionId));
    if (!q) {
        error(404, 'Question not found');
    }
    const isCorrect = q.correctAnswer.trim().toLowerCase() === (answer ?? '').trim().toLowerCase();
    return { isCorrect, correctAnswer: isCorrect ? undefined : q.correctAnswer };
});
