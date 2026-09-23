export abstract class Question {
    public abstract readonly type: string;
    constructor(
        public id: string,
        public prompt: string,
        public markingEngine: MarkingEngine
    ) {}
}

export abstract class MarkingEngine {
    public abstract isCorrect(correctAnswer: Answer, studentAnswer: string): boolean;
}

export class ExactMarkingEngine extends MarkingEngine {
    public isCorrect(correctAnswer: Answer, studentAnswer: string): boolean {
        return correctAnswer.answers.includes(studentAnswer);
    }
}

export class Answer {
    constructor(
        public answers: string[],
        public hint: string = "",
        public explanation: string = ""
    ) {}
}

export class BasicQuestion extends Question {
    readonly type: string = "basic";

    constructor(
        id: string,
        prompt: string,
        public correctAnswer: Answer
    ) {
        super(id, prompt, new ExactMarkingEngine());
    }

}

