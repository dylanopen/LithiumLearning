<script lang="ts">
    let { question } = $props();
</script>

<h3>{question.prompt}</h3>

{#if question.type === "simple"}
<p>{question.answers}</p>
{/if}

{#if question.explanation}
<details>
    <summary>View explanation</summary>
    <p>{question.explanation}</p>
</details>
{/if}

