<script setup lang="ts">
import { storeToRefs } from "pinia";
import useEditorStore from "../editorStore.ts";
import type { Tool } from "../tool.ts";

const { tool } = defineProps<{ tool: Tool; }>();

const { currentTool } = storeToRefs(useEditorStore());
</script>

<template>
    <button :class="{ active: tool === currentTool }" v-on:click="currentTool = tool">
        <slot></slot>
    </button>
</template>

<style scoped>
button {
    padding: 0.2em;
    font-size: 1.25rem;
    width: 2em;
}

.active {
    background-color: greenyellow;
}
</style>