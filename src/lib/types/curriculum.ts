import { fetchCourseById, fetchLessonsByCourse, fetchLessonsByTopic, fetchCourseTopicsByCourseId } from '$lib/api/curriculum.remote';

export class Course {
    constructor(
        public id: string,
        public name: string,
        public level: string | null,
        public examBoard: string | null,
        public gradeScale: string | null,
    ) {}

    get topics() {
        return fetchCourseTopicsByCourseId({ courseId: this.id });
    }

    get lessons() {
        return fetchLessonsByCourse({ courseId: this.id });
    }

    static async load(id: string) {
        return await fetchCourseById({ courseId: id });
    }
}

export class CourseTopic {
    constructor(
        public topicId: string,
        public courseId: string,
        public title: string,
        public index: number,
    ) {}

    get lessons() {
        return fetchLessonsByTopic({ topicId: this.topicId, courseId: this.courseId });
    }

    static async load(topicId: string, courseId: string) {
        return await fetchLessonsByTopic({ topicId, courseId });
    }
}

