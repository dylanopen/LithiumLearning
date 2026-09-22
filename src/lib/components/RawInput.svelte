<script lang="ts">
    let { submit } = $props();

    function submitInputBox() {
        let inputBox = document.getElementById("input-box");
        let rawValue = inputBox.value;
        submit(rawValue);
    }
</script>

<input type="text" id="input-box" />
<button on:click={submitInputBox}>Submit</button>

