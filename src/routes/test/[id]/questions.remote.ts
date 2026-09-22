import * as v from 'valibot';
import { db, simpleQuestions } from '$lib/server';
import { eq } from 'drizzle-orm';
import { error } from '@sveltejs/kit';
import { query } from '$app/server';

export const getQuestion = query(v.string(), async (questionId) => {
    const id = String(questionId);

    const [q] = await db.select().from(simpleQuestions).where(eq(simpleQuestions.id, id));
    
    if (!q) {
        throw error(404, 'Question not found');
    }

    return { id: q.id, prompt: q.prompt };
});

const AnswerAttemptSchema = v.object({
    questionId: v.string(),
    answer: v.string(),
});

export const checkAnswer = query(AnswerAttemptSchema, async ({ questionId, answer }) => {
    const [q] = await db.select().from(simpleQuestions).where(eq(simpleQuestions.id, questionId));
    let simpleAnswer = simplifyRaw(answer);
    if (!q) {
        error(404, 'Question not found');
    }
    let isCorrect = false;
    for (let correctAnswer of q.answers) {
        if (simplifyRaw(correctAnswer) === simpleAnswer)
        if (correctAnswer.trim().toLowerCase() === (answer ?? '').trim().toLowerCase()) {
            isCorrect = true;
        }
    }
    let correctAnswer = q.answers[0];
    return { isCorrect, correctAnswer: isCorrect ? undefined : correctAnswer, explanation: q.explanation };
});

function simplifyRaw(answer: string): string {
    return (answer ?? "").trim().toLowerCase();
}
