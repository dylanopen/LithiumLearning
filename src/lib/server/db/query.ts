import { eq, and, inArray } from 'drizzle-orm';
import { db } from './index';
import { courseTopics, topicLessons, lessons, lessonQuestions, simpleQuestions } from './schema';

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
        const cleaned = raw.replace(/^\{|\}$/g, '').trim();
        return cleaned ? cleaned.split(',').map((item) => item.replace(/^"|"$/g, '')) : [];
    }
    return [];
}

export async function getLessonPrerequisites(lessonId: string) {
    const [targetLesson] = await db
    .select({ prerequisites: lessons.prerequisites })
    .from(lessons)
    .where(eq(lessons.id, lessonId));

    if (!targetLesson) return [];

    const prereqIds = parsePgArray(targetLesson.prerequisites);

    if (prereqIds.length === 0) {
        return [];
    }

    return await db
    .select()
    .from(lessons)
    .where(inArray(lessons.id, prereqIds));
}

export async function getLessonQuestions(lessonId: string) {
  const rows = await db
    .select({
      type: lessonQuestions.questionType,
      simple: simpleQuestions,
      // definition: definitionQuestions,
    })
    .from(lessonQuestions)
    .leftJoin(simpleQuestions, eq(lessonQuestions.questionId, simpleQuestions.id))
    // .leftJoin(definitionQuestions, eq(lessonQuestions.questionId, definitionQuestions.id))
    .where(eq(lessonQuestions.lessonId, lessonId));

  // Map flat joins to single tagged question objects
  return rows
    .map(({ type, simple /*, definition */ }) => {
      if (type === 'simple' && simple) return { ...simple, type: 'simple' as const };
      // if (type === 'definition' && definition) return { ...definition, type: 'definition' as const };
      return null;
    })
    .filter((q): q is NonNullable<typeof q> => q !== null);
}
