export abstract class Question {
    public abstract readonly type: string;
    constructor(
        public id: string,
        public prompt: string
    ) {}

    abstract verifyAnswer(answer: string): boolean;
}

export class BasicQuestion extends Question {
    readonly type: string = "basic";

    constructor(
        id: string,
        prompt: string,
        public correctAnswers: string[]
    ) {
        super(id, prompt);
    }

    public override verifyAnswer(answer: string): boolean {
        return (this.correctAnswers.includes(answer));
    }
}

