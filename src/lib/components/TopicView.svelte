<script lang="ts">
    import LessonCard from "$lib/components/LessonCard.svelte";
    let { topic, lessons } = $props();
</script>

<h3>{topic.title}</h3>

{#each lessons as lesson}
<LessonCard {lesson} />
{/each}

