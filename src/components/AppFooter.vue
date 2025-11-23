<script setup lang="ts">
const emit = defineEmits([ "play", "edit" ]);
</script>

<template>
    <footer>
        <input type="radio" name="mode" id="playMode" checked v-on:input="emit('play')">
        <label for="playMode" tabindex="0">Play</label>
        <input type="radio" name="mode" id="editMode" v-on:input="emit('edit')">
        <label for="editMode" tabindex="0">Edit</label>
    </footer>
</template>

<style scoped>
footer {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
}

input[type="radio"] {
    display: none;
}

label {
    padding: 0.5rem 2rem;
    background-color: lightgray;
    font-weight: bold;
    font-size: 1.5rem;
    cursor: pointer;
}

input:checked + label {
    background-color: greenyellow;
}
</style>