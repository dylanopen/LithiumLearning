import { db, courses } from '$lib/server';

import { eq } from "drizzle-orm";

import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const [course] = await db.select().from(courses).where(eq(courses.id, params.id));

	if (!course) {
        error(404, "That course can't be found. Did you type the URL manually? If so, try clicking 'Discover Courses' above and find it that way.");
	}

    return {
        course
    };
};

