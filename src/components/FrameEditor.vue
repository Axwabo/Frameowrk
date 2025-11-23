<script setup lang="ts">
import { storeToRefs } from "pinia";
import useEditorStore from "../editorStore.ts";
import { useTemplateRef } from "vue";

const { width, height } = defineProps<{ width: number, height: number; }>();

const { level, currentTool } = storeToRefs(useEditorStore());

const vector = useTemplateRef("vector");

defineExpose({ vector });

function onClick(ev: Event) {
    if (currentTool.value !== "Select")
        return;
    const target = ev.target as SVGElement;
    document.querySelector(".selected")?.classList.remove("selected");
    target.classList.add("selected");
}
</script>

<template>
    <svg id="editorSVG" v-html="level.frame" ref="vector" v-on:click="onClick" :width :height :viewBox="`0 0 ${width} ${height}`"></svg>
</template>

<style>
#editorSVG {
    z-index: 1;
}

.selected:not(svg) {
    fill: rgba(100, 100, 0);
}
</style>