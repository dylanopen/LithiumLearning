class Course {
    id: string;
    name: string;
    topics: CourseTopic[];

    constructor(id: string, name: string, topics: CourseTopic[] = []) {
        this.id = id;
        this.name = name;
        this.topics = topics;
    }
}

class CourseTopic {
    id: string;
    name: string;
    lessons: Lesson[];
    
    constructor(id: string, name: string, lessons: Lesson[] = []) {
        this.id = id;
        this.name = name;
        this.lessons = lessons;
    }
}

class Lesson {
    readContent: string;
    questions: Question[];

    constructor(readContent: string = "", questions: Question[] = []) {
        this.readContent = readContent;
        this.questions = questions;
    }
}

