<script setup lang="ts">
import { useTemplateRef } from "vue";
import { storeToRefs } from "pinia";
import useEditorStore from "../editorStore.ts";

const { history } = useEditorStore();

const { level } = storeToRefs(useEditorStore());

const inputDialog = useTemplateRef("inputDialog");
</script>

<template>
    <button v-on:click="inputDialog!.showModal()">Edit SVG</button>
    <dialog ref="inputDialog">
        <button v-on:click="inputDialog!.close()">Close</button>
        <textarea v-model="level.frame" v-on:change="history.push(level.frame)"></textarea>
    </dialog>
</template>

<style scoped>
dialog[open] {
    display: grid;
    gap: 1rem;
}

textarea {
    min-width: 50vw;
    min-height: 50vh;
}
</style>