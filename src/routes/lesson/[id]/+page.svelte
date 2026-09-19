<script lang="ts">
    import LessonCard from "$lib/components/LessonCard.svelte";
    let { data } = $props();
</script>

<h2>{data.lesson.title}</h2>

{#if data.prerequisites.length}
<hr/>
<h3>Prerequisites</h3>
<span class="subtext">We recommend practising these topics before attempting <b>{data.lesson.title.toLowerCase()}</b>:</span>
<br/>

{#each data.prerequisites as prerequisite}
<LessonCard lesson={prerequisite} />
{/each}
{/if}

<hr/>

<p>{data.lesson.readContent}</p>

