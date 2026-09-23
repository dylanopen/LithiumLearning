import { Lesson } from "./lesson";

export class Course {
    constructor(
        public id: string,
        public name: string,
        public topics: CourseTopic[] = []
    ) {}
}

export class CourseTopic {
    constructor(
        public id: string,
        public name: string,
        public lessons: Lesson[] = []
    ) {}
}

