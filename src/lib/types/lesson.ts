import type { Question } from "./question";

export class Lesson {
    constructor(
        public readContent: string = "",
        public questions: Question[] = []
    ) {}
}

