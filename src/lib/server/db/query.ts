import { eq, and, inArray } from 'drizzle-orm';
import { db } from './index';
import { course_topics, topic_lessons, lessons, lesson_questions, basic_questions } from './schema';

export async function getCourseTopics(courseId: string) {
    const rows = await db
    .select({
        topic: course_topics,
        lesson: lessons,
    })
    .from(course_topics)
    .leftJoin(
        topic_lessons,
        and(
            eq(course_topics.topic_id, topic_lessons.topic_id),
            eq(course_topics.course_id, topic_lessons.course_id)
        )
    )
    .leftJoin(lessons, eq(topic_lessons.lesson_id, lessons.id))
    .where(eq(course_topics.course_id, courseId));

    const topicsMap = new Map<string, typeof course_topics.$inferSelect & { lessons: (typeof lessons.$inferSelect)[] }>();

    for (const { topic, lesson } of rows) {
        if (!topicsMap.has(topic.topic_id)) {
            topicsMap.set(topic.topic_id, {
                ...topic,
                lessons: [],
            });
        }

        if (lesson) {
            topicsMap.get(topic.topic_id)!.lessons.push(lesson);
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
        type: lesson_questions.question_type,
        simple: basic_questions,
        // definition: definitionQuestions,
    })
    .from(lesson_questions)
    .leftJoin(basic_questions, eq(lesson_questions.question_id, basic_questions.id))
    // .leftJoin(definitionQuestions, eq(lessonQuestions.questionId, definitionQuestions.id))
    .where(eq(lesson_questions.lesson_id, lessonId));

    return rows
    .map(({ type, simple /*, definition */ }) => {
        if (type === 'simple' && simple) return { ...simple, type: 'simple' as const };
        // if (type === 'definition' && definition) return { ...definition, type: 'definition' as const };
        return null;
    })
    .filter((q): q is NonNullable<typeof q> => q !== null);
}
