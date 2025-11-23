<script setup lang="ts">
import { storeToRefs } from "pinia";
import useEditorStore from "../editorStore.ts";
import { useTemplateRef } from "vue";
import useWindowEvent from "../composables/useWindowEvent.ts";

const { width, height } = defineProps<{ width: number, height: number; }>();

const { history } = useEditorStore();

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
    newElement.setAttribute("transform-origin", `${startX.toFixed(0)} ${startY.toFixed(0)}`);
    vector.value!.append(newElement);
    element = newElement;
    return newElement;
}

function transform(modify: (matrix: DOMMatrix) => void) {
    const matrix = new DOMMatrix(getComputedStyle(element!).transform);
    modify(matrix);
    element?.setAttributeNS(null, "transform", matrix.toString());
}

function onMouseDown(ev: MouseEvent) {
    startX = ev.offsetX;
    startY = ev.offsetY;
    switch (currentTool.value) {
        case "Move":
        case "Rotate":
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
        case "Circumference":
            const selectedCircle = ev.target as SVGElement;
            if (selectedCircle.tagName === "circle")
                element = selectedCircle;
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
            transform(m => m.translateSelf(ev.movementX, ev.movementY, 0));
            break;
        case "Line":
            element.setAttributeNS(null, "d", `M${startX} ${startY} L${ev.offsetX} ${ev.offsetY}`);
            break;
        case "Rect":
            element.setAttributeNS(null, "width", Math.abs(dx).toFixed(0));
            element.setAttributeNS(null, "height", Math.abs(dy).toFixed(0));
            if (dx < 0)
                element.setAttributeNS(null, "x", ev.offsetX.toFixed(0));
            if (dy < 0)
                element.setAttributeNS(null, "y", ev.offsetY.toFixed(0));
            break;
        case "Circumference":
            const rawOffset = element.getAttributeNS(null, "stroke-dashoffset");
            const offset = rawOffset ? parseFloat(rawOffset) : 0;
            const newOffset = Math.max(0, Math.min(100, offset + ev.movementX));
            if (newOffset > 0)
                element.setAttributeNS(null, "stroke-dashoffset", newOffset + "%");
            else
                element.removeAttributeNS(null, "stroke-dashoffset");
            break;
        case "Circle":
            const radius = Math.round(Math.sqrt(dx * dx + dy * dy));
            element.setAttributeNS(null, "r", radius.toString());
            element.setAttributeNS(null, "stroke-dasharray", (radius * 2 * Math.PI).toString());
            break;
        case "Rotate":
            transform(m => m.rotateSelf(0, 0, ev.movementX));
            break;
    }
}

function commit() {
    const previous = level.value.frame;
    const html = vector.value!.innerHTML;
    level.value.frame = html;
    element = null;
    if (previous !== html && history[history.length - 1] !== html)
        history.push(previous);
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

#editorSVG.move:has(:active) {
    cursor: move;
}

#editorSVG.rotate * {
    cursor: nw-resize;
}

#editorSVG.rotate:has(:active) {
    cursor: nw-resize;
}

#editorSVG.circumference circle {
    cursor: ew-resize;
}

#editorSVG.circumference:has(circle:active) {
    cursor: ew-resize;
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