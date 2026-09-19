import { db, courses } from '$lib/server';

export async function load() {
    const allCourses = await db.select().from(courses);
    return { courses: allCourses };
}
