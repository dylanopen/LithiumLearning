<script lang="ts">
    import { getQuestion } from "./questions.remote.ts";

    let { data } = $props();
    let currentQuestionNumber = $state(1);
    let currentQuestionId = $derived(data.questionIds[currentQuestionNumber - 1]);
    let currentQuestion = $state({});

    $effect(async () => {
        console.log(currentQuestionId);
        currentQuestion = await getQuestion(currentQuestionId);
        console.log(currentQuestion);
    });

    $inspect(currentQuestion);
</script>

<h2>Test: {data.lesson.title}</h2>

<p>Question {currentQuestionNumber} of {data.questionIds.length}</p>

<hr/>

<p>{currentQuestion.prompt}</p>

