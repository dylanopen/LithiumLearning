<script lang="ts">
    import Badge from "./Badge.svelte";
    let { course } = $props();
</script>

<a href="/course/{course.id}">
    <div class="border-solid border-lime-400 outline-1">
        <Badge color=darkorange text={course.level} />
        <Badge color=green text={course.examBoard} />
        <br/>
        <h3>{course.title}</h3>
    </div>
</a>

<style>
div, h3 {
    display: inline-block;
}

div {
    margin: 10px;
    padding: 5px;
}
</style>

