import { fetchLessonById } from "$lib/api/lesson.remote";
import type { Question } from "./question";

export class Lesson {
    constructor(
        public id: string,
        public title: string,
        public readContent: string | null,
        public questions: Question[] = []
    ) {}

    static async load(lessonId: string) {
        const lessonData = await fetchLessonById({ lessonId });
        if (!lessonData) {
            throw new Error(`Lesson with ID ${lessonId} not found`);
        }
        return new Lesson(
            lessonData.id,
            lessonData.title,
            lessonData.readContent,
            lessonData.questions,
        );
    }
}

