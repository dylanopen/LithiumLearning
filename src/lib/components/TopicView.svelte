<script lang="ts">
    let { topic, lessons } = $props();
</script>

<h3>{topic.title}</h3>

{#each lessons as lesson}
<a href="/lesson/{lesson.id}">{lesson.title}</a><br/>
{/each}

