import { db, lessons } from '$lib/server';
import { Lesson } from "./lesson";
import { eq } from 'drizzle-orm';

export class Course {
    constructor(
        public id: string,
        public name: string,
        public topics: CourseTopic[] = []
    ) {}

    static loadId(id: string): Course {

    }
}

export class CourseTopic {
    constructor(
        public id: string,
        public name: string,
    ) {}

    get lessons() {
	await db.execute(sql`select * from ${lessons} where ${lessons.id} = ${id}`);
    }
}

