<script lang="ts">
    import RawInput from "$lib/components/RawInput.svelte"
    import { getQuestion, checkAnswer } from "./questions.remote.ts";

    let { data } = $props();
    let currentQuestionNumber = $state(1);
    let currentQuestionId = $derived(data.questionIds[currentQuestionNumber - 1]);
    let currentQuestion = $state({});

    let result = $state({});

    $effect(async () => {
        currentQuestion = await getQuestion(currentQuestionId);
    });

    async function submitAnswer(value) {
        result = await checkAnswer({ questionId: currentQuestionId, answer: value });
        console.log(result);
    }

    async function advanceQuestion() {
        currentQuestionNumber++;
    }
</script>

<h2>Test: {data.lesson.title}</h2>

<p>Question {currentQuestionNumber} of {data.questionIds.length}</p>

<hr/>

<p>{currentQuestion.prompt}</p>

<RawInput submit={submitAnswer} />

{#if result}
{#if result.isCorrect}
<span>Correct!</span> <button onclick={advanceQuestion}>Next Question</button>
{/if}
{/if}

