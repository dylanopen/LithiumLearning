<script lang="ts">
    import CourseCard from "../../lib/components/CourseCard.svelte";
    let { data } = $props();
</script>

<h1>Choose a course subject</h1>

{#each data.courses as course}
<CourseCard {course} />
{/each}

