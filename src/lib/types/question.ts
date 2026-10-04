import { fetchBasicQuestionById } from "$lib/api/question.remote";

export abstract class Question {
    public abstract readonly type: string;
    constructor(
        public id: string,
        public prompt: string,
        public markingEngine: MarkingEngine
    ) {}
}

export abstract class MarkingEngine {
    public constructor(public correctAnswer: Answer) {}
    public abstract isCorrect(studentAnswer: string): boolean;
}

export class ExactMarkingEngine extends MarkingEngine {
    public isCorrect(studentAnswer: string): boolean {
        return this.correctAnswer.answers.includes(studentAnswer);
    }
}

export class Answer {
    constructor(
        public answers: string[],
        public hint: string | null,
        public explanation: string | null,
    ) {}
}

export class BasicQuestion extends Question {
    readonly type: string = "basic";

    constructor(
        id: string,
        prompt: string,
        public correctAnswer: Answer
    ) {
        super(id, prompt, new ExactMarkingEngine(correctAnswer));
    }

    static async load(id: string): Promise<BasicQuestion | null> {
        return await fetchBasicQuestionById({ questionId: id });
    }
}

