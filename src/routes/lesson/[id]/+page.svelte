<script lang="ts">
    import LessonCard from "$lib/components/LessonCard.svelte";
    import QuestionPreview from "$lib/components/QuestionPreview.svelte";
    let { data } = $props();
</script>

<h2>{data.lesson.title}</h2>

{#if data.prerequisites.length}
<hr/>
<h3>Prerequisites</h3>
<span class="subtext">We recommend practising these topics before attempting <i>{data.lesson.title.toLowerCase()}</i>:</span>
<br/>

{#each data.prerequisites as prerequisite}
<LessonCard lesson={prerequisite} />
{/each}
{/if}

<hr/>

<p>{data.lesson.readContent}</p>
<hr />

<h2>Lesson content</h2>

{#each data.questions as question}
<QuestionPreview {question} />
{/each}

