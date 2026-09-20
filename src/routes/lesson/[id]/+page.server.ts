import { db, lessons } from '$lib/server';
import { getLessonPrerequisites, getLessonQuestions } from '$lib/server';

import { eq } from "drizzle-orm";

import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const [lesson] = await db.select().from(lessons).where(eq(lessons.id, params.id));

	if (!lesson) {
        error(404, "That lesson can't be found. Did you type the URL manually? If so, try clicking 'Discover Topics' above and find it that way.");
	}

    let prerequisites = await getLessonPrerequisites(lesson.id);
    let questions = await getLessonQuestions(lesson.id);

    return {
        lesson,
        questions,
        prerequisites,
    };
};

