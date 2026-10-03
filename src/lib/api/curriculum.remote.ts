import { query } from '$app/server';
import { db } from '\$lib/server/db';
import { lessons } from '\$lib/server/db/schema';
import { sql } from 'drizzle-orm';
import { v } from 'valibot';

const LessonSchema = v.object({
    topicId: v.string(),
    courseId: v.string(),
});

export const fetchLessonsByTopic = query(
    LessonSchema,
    async ({ topicId, courseId }) => {
	const result = await db.execute(sql`
					SELECT l.* 
					FROM ${lessons} l
					JOIN ${topicLessons} tl ON l.${lessons.id} = tl.${topicLessons.lessonId}
					WHERE tl.${topicLessons.topicId} = ${targetTopicId}
					AND tl.${topicLessons.courseId} = ${targetCourseId}
					`);
    }
)
