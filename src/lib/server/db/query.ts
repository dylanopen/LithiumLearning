import { eq, and, inArray } from 'drizzle-orm';
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

function parsePgArray(raw: string[] | string | null | undefined): string[] {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  if (typeof raw === 'string') {
    // Strips curly braces {} and splits by comma
    const cleaned = raw.replace(/^\{|\}$/g, '').trim();
    return cleaned ? cleaned.split(',').map((item) => item.replace(/^"|"$/g, '')) : [];
  }
  return [];
}

export async function getLessonPrerequisites(lessonId: string) {
  // 1. Fetch the target lesson's prerequisites column
  const [targetLesson] = await db
    .select({ prerequisites: lessons.prerequisites })
    .from(lessons)
    .where(eq(lessons.id, lessonId));

  if (!targetLesson) return [];

  // 2. Parse into a guaranteed JavaScript string[]
  const prereqIds = parsePgArray(targetLesson.prerequisites);

  // Guard clause: if array is empty, return early to avoid firing invalid SQL
  if (prereqIds.length === 0) {
    return [];
  }

  // 3. Fetch matching prerequisite lessons
  return await db
    .select()
    .from(lessons)
    .where(inArray(lessons.id, prereqIds));
}

