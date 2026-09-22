import { db, lessons } from '$lib/server';
import { getLessonQuestions } from '$lib/server';

import { eq } from "drizzle-orm";

import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const [lesson] = await db.select().from(lessons).where(eq(lessons.id, params.id));

	if (!lesson) {
        error(404, "That lesson can't be found, so you can't take a test on it. Did you type the URL manually? If so, try clicking 'Discover Topics' above and find it that way.");
	}

    let allQuestions = await getLessonQuestions(lesson.id);
    let questionIds: string[] = allQuestions.map(x => x.id);
    let totalMarks: number = questionIds.length; // TODO: add mark counter

    return {
        lesson,
        questionIds,
        totalMarks,
    };
};

