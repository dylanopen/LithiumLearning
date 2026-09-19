<script lang="ts">
    import CourseCard from "../../../lib/components/CourseCard.svelte";
    let { data } = $props();
    console.log(data.course);
</script>

<CourseCard course={data.course} />

