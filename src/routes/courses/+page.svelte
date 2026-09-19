<script lang="ts">
    let { data } = $props();
</script>

<h1>Choose a course subject</h1>

{#each data.courses as course}
<a href="/course/{course.id}">{course.title}</a>
{/each}

