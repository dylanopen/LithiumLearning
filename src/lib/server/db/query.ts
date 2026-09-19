import { eq, and } from 'drizzle-orm';
import { db } from './index';
import { courseTopics, topicLessons, lessons } from './schema';

export async function getCourseTopics(courseId: string) {
  const rows = await db
    .select({
      topic: courseTopics,
      lesson: lessons,
    })
    .from(courseTopics)
    .leftJoin(
      topicLessons,
      and(
        eq(courseTopics.id, topicLessons.topicId),
        eq(courseTopics.courseId, topicLessons.courseId)
      )
    )
    .leftJoin(lessons, eq(topicLessons.lessonId, lessons.id))
    .where(eq(courseTopics.courseId, courseId));

  const topicsMap = new Map<string, typeof courseTopics.$inferSelect & { lessons: (typeof lessons.$inferSelect)[] }>();

  for (const { topic, lesson } of rows) {
    if (!topicsMap.has(topic.id)) {
      topicsMap.set(topic.id, {
        ...topic,
        lessons: [],
      });
    }

    if (lesson) {
      topicsMap.get(topic.id)!.lessons.push(lesson);
    }
  }

  return Array.from(topicsMap.values());
}
