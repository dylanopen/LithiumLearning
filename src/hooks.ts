import type { Transport } from '@sveltejs/kit';
import { Course, CourseTopic } from '$lib/types/curriculum';
import { Lesson } from '$lib/types/lesson';
import { Question, Answer, MarkingEngine, BasicQuestion, ExactMarkingEngine } from '$lib/types/question';

const models: Record<string, any> = {
    Course,
    CourseTopic,
    Lesson,
    Question,
    Answer,
    MarkingEngine,
    ExactMarkingEngine,
    BasicQuestion,
};

export const transport: Transport = {
    Model: {
        encode: (v: any) => v?.constructor?.name in models && [v.constructor.name, { ...v }],
        decode: ([name, data]: [string, any]) => {
            const Cls = models[name];
            return Cls ? Object.assign(Object.create(Cls.prototype), data) : data;
        }
    }
};
