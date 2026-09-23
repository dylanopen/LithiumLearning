export abstract class Question {
    public abstract readonly type: string;
    constructor(
        public id: string,
        public prompt: string
    ) {}

    abstract verifyAnswer(answer: string): boolean;
}

export class Answer {
    constructor(
        public answers: string[] = [],
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
        super(id, prompt);
    }

    public override verifyAnswer(answer: string): boolean {
        return this.correctAnswer.answers.includes(answer);
    }
}

