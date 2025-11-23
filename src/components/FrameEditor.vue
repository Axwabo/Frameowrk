<script setup lang="ts">
import { storeToRefs } from "pinia";
import useEditorStore from "../editorStore.ts";
import { useTemplateRef } from "vue";

const { width, height } = defineProps<{ width: number, height: number; }>();

const { level, currentTool } = storeToRefs(useEditorStore());

const vector = useTemplateRef("vector");

let element: Element | null = null;

let startX = 0;
let startY = 0;

defineExpose({ vector });

function onClick(ev: Event) {
    if (currentTool.value !== "Delete")
        return;
    const target = ev.target as SVGElement;
    if (target.tagName === "svg")
        return;
    target.remove();
    commit();
}

function onMouseDown(ev: MouseEvent) {
    if (currentTool.value !== "Line")
        return;
    startX = ev.offsetX;
    startY = ev.offsetY;
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", `M${startX} ${startY} L${startX} ${startY}`);
    path.setAttribute("stroke", "black");
    path.setAttribute("stroke-width", "3");
    vector.value!.append(path);
    element = path;
}

function onMouseMove(ev: MouseEvent) {
    if (currentTool.value !== "Line" || !element)
        return;
    element.setAttributeNS(null, "d", `M${startX} ${startY} L${ev.offsetX} ${ev.offsetY}`);
}

function commit() {
    level.value.frame = vector.value!.innerHTML;
}
</script>

<template>
    <svg xmlns="http://www.w3.org/2000/svg"
         :class="[currentTool.toLowerCase()]" id="editorSVG" v-html="level.frame" ref="vector" :width :height :viewBox="`0 0 ${width} ${height}`"
         v-on:click="onClick"
         v-on:mousedown="onMouseDown"
         v-on:mousemove="onMouseMove"
         v-on:mouseup="element = null; commit()"></svg>
</template>

<style>
#editorSVG {
    z-index: 1;
}

#editorSVG.select * {
    cursor: pointer;
}

#editorSVG.move * {
    cursor: move;
}

#editorSVG.delete * {
    cursor: pointer;
}

#editorSVG:is(.line, .rect, .circle) {
    cursor: crosshair;
}

#editorSVG:is(.line, .rect, .circle) * {
    pointer-events: none;
}
</style>