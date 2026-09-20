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

    let allQuestions = getLessonQuestions(lesson);
    let limit = 10;
    for (let i = 0; i < limit; i++) {

    }

    return {
        lesson,
        questionIds,
    };
};

