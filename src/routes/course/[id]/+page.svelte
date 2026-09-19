<script lang="ts">
    import CourseCard from "$lib/components/CourseCard.svelte";
    import TopicView from "$lib/components/TopicView.svelte";
    let { data } = $props();
</script>

<CourseCard course={data.course} />

{#each data.topics as topic}
<TopicView {topic} lessons={topic.lessons} />
<br/>
{/each}

