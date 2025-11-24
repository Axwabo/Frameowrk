<script setup lang="ts">
import useEditorStore from "../editorStore.ts";
import { storeToRefs } from "pinia";

const { view } = storeToRefs(useEditorStore());

const editingSupported = window.matchMedia("(pointer: fine)").matches;

function tryEdit() {
    if (editingSupported)
        view.value = "Edit";
    else
        alert("Editing is not supported on mobile devices");
}
</script>

<template>
    <footer>
        <input type="radio" name="mode" id="playMode" :checked="view === 'Play'" v-on:input="view = 'Play'">
        <label for="playMode" tabindex="0">Play</label>
        <input type="radio" name="mode" id="levelsMode" :checked="view === 'Levels'" v-on:input="view = 'Levels'">
        <label for="levelsMode" tabindex="0">Levels</label>
        <input type="radio" name="mode" id="editMode" :checked="view === 'Edit'" v-on:input="tryEdit" :disabled="!editingSupported">
        <label for="editMode" tabindex="0" v-on:click="tryEdit">Edit</label>
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
}

input:checked + label {
    background-color: greenyellow;
}
</style>