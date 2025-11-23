<script setup lang="ts">
import { storeToRefs } from "pinia";
import useEditorStore from "../editorStore.ts";
import { useTemplateRef } from "vue";
import useWindowEvent from "../composables/useWindowEvent.ts";

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

function append(tag: keyof SVGElementTagNameMap) {
    const newElement = document.createElementNS("http://www.w3.org/2000/svg", tag);
    newElement.setAttribute("stroke", "black");
    newElement.setAttribute("stroke-width", "3");
    vector.value!.append(newElement);
    element = newElement;
    return newElement;
}

function getMatrix() {
    return new DOMMatrix(getComputedStyle(element!).transform);
}

function onMouseDown(ev: MouseEvent) {
    startX = ev.offsetX;
    startY = ev.offsetY;
    switch (currentTool.value) {
        case "Move":
            const svg = ev.target as SVGElement;
            if (svg.tagName !== "svg")
                element = svg;
            break;
        case "Line":
            const path = append("path");
            path.setAttribute("d", `M${startX} ${startY} L${startX} ${startY}`);
            break;
        case "Rect":
            const rect = append("rect");
            rect.setAttribute("x", startX.toFixed(0));
            rect.setAttribute("y", startY.toFixed(0));
            rect.setAttribute("fill", "none");
            break;
        case "Circle":
            const circle = append("circle");
            circle.setAttribute("cx", startX.toFixed(0));
            circle.setAttribute("cy", startY.toFixed(0));
            circle.setAttribute("fill", "none");
            break;
    }
}

function onMouseMove(ev: MouseEvent) {
    if (!element)
        return;
    const dx = ev.offsetX - startX;
    const dy = ev.offsetY - startY;
    switch (currentTool.value) {
        case "Move":
            const matrix = getMatrix();
            matrix.translateSelf(ev.movementX, ev.movementY, 0);
            element.setAttributeNS(null, "transform", matrix.toString());
            break;
        case "Line":
            element.setAttributeNS(null, "d", `M${startX} ${startY} L${ev.offsetX} ${ev.offsetY}`);
            break;
        case "Rect":
            element.setAttributeNS(null, "width", dx.toFixed(0));
            element.setAttributeNS(null, "height", dy.toFixed(0));
            break;
        case "Circle":
            element.setAttributeNS(null, "r", Math.sqrt(dx * dx + dy * dy).toFixed(0));
            break;
    }
}

function commit() {
    level.value.frame = vector.value!.innerHTML;
    element = null;
}

useWindowEvent("mouseup", commit);
</script>

<template>
    <svg xmlns="http://www.w3.org/2000/svg"
         :class="[currentTool.toLowerCase()]" id="editorSVG" v-html="level.frame" ref="vector" :width :height :viewBox="`0 0 ${width} ${height}`"
         v-on:click="onClick"
         v-on:mousedown="onMouseDown"
         v-on:mousemove="onMouseMove"></svg>
</template>

<style>
#editorSVG {
    z-index: 1;
    cursor: default;
}

#editorSVG.select * {
    cursor: pointer;
}

#editorSVG.move * {
    cursor: move;
}

#editorSVG.move:active {
    cursor: move;
}

#editorSVG.delete * {
    cursor: pointer;
}

#editorSVG.delete :is(path, circle, rect):hover {
    stroke: rgba(150, 0, 0);
}

#editorSVG:is(.line, .rect, .circle) {
    cursor: crosshair;
}

#editorSVG:is(.line, .rect, .circle) * {
    pointer-events: none;
}
</style>