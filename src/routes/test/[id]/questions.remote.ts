import * as v from 'valibot';
import { error } from '@sveltejs/kit';
import { query } from '$app/server';
import { Question } from '$lib/types/question';

export const getQuestion = query(
    v.object({
	questionId: v.string(),
    }),
    async ({ questionId }): Promise<Question> => {
	const question = await Question.load(questionId);

	if (!question) {
	    throw error(404, 'Question not found');
	}

	question.hideAnswer();
	return question;
    }
);


/*export const checkAnswer = query(
    v.object({
	questionId: v.string(),
	answer: v.clas,
    }),
    async ({ questionId, answer }) => {
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
    }
);

function simplifyRaw(answer: string): string {
    return (answer ?? "").trim().toLowerCase();
}*/
