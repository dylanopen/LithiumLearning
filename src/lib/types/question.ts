import { fetchBasicQuestionById } from "$lib/api/question.remote";

export abstract class Question {
    public abstract readonly type: string;
    constructor(
        public id: string,
        public prompt: string,
        public markingEngine: MarkingEngine | undefined,
    ) {}

    static async load(id: string): Promise<Question | null> {
	// TODO: support more question types
	let question = await BasicQuestion.load(id);
	if (!question) return null;

	question.hideAnswer();
	return question;
    }

    public hideAnswer(): void {
	this.markingEngine = undefined;
    }
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
    public correctAnswer: Answer | undefined

    constructor(
        id: string,
        prompt: string,
        correctAnswer: Answer
    ) {
        super(id, prompt, new ExactMarkingEngine(correctAnswer));
	this.correctAnswer = correctAnswer;
    }

    static async load(id: string): Promise<BasicQuestion | null> {
        return await fetchBasicQuestionById({ questionId: id });
    }

    override hideAnswer(): void {
	super.hideAnswer();
	this.correctAnswer = undefined;
    }
}

