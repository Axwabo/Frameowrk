<script setup lang="ts" xmlns="">
import useGameStore from "../gameStore.ts";
import { loadLevels } from "../levelLoader.ts";
import LevelDisplay from "./LevelDisplay.vue";
import { storeToRefs } from "pinia";
import Cat from "./Cat.vue";
import LevelFooter from "./LevelFooter.vue";
import { useTemplateRef, watch } from "vue";
import useAnimationFrame from "../composables/useAnimationFrame.ts";
import useWindowEvent from "../composables/useWindowEvent.ts";

const { levels } = useGameStore();

const { levelIndex, attempt, mouseX, mouseY, submitted } = storeToRefs(useGameStore());

const display = useTemplateRef("display");

const car = useTemplateRef("car");

let top = 0;
let left = 0;

let mouseDown = false;

await loadLevels(levels);

useAnimationFrame(() => {
    const previousTop = top;
    const previousLeft = left;
    top = car.value!.top - Math.cos(car.value!.angle) * 50;
    left = car.value!.left + Math.sin(car.value!.angle) * 50;
    if (!mouseDown || submitted.value)
        return;
    const canvas = display.value!.drawingCanvas!;
    const { x, y } = canvas.getBoundingClientRect();
    const ctx = canvas.getContext("2d")!;
    ctx.lineWidth = 3;
    ctx.strokeStyle = "black";
    ctx.beginPath();
    ctx.moveTo(previousLeft - x, previousTop - y);
    ctx.lineTo(left - x, top - y);
    ctx.stroke();
});

watch(attempt, () => display.value?.drawingCanvas?.getContext("2d")?.clearRect(0, 0, Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER));

watch(submitted, async value => {
    if (!value)
        return;
    const canvas = new OffscreenCanvas(display.value!.width, display.value!.height);
    const ctx = canvas.getContext("2d")!;
    const frame = display.value!.frameImage!;
    const response = await fetch(frame.src);
    const text = await response.text();
    const div = document.createElement("div");
    div.innerHTML = text;
    const svg = div.querySelector("svg");
    if (!svg)
        return;
    svg.setAttributeNS(null, "width", canvas.width.toFixed(0));
    svg.setAttributeNS(null, "height", canvas.height.toFixed(0));
    ctx.drawImage(svg, 0, 0);
    canvas.convertToBlob().then(e => open(URL.createObjectURL(e)))
});

useWindowEvent("mousedown", () => mouseDown = true);
useWindowEvent("mouseup", () => mouseDown = false);
useWindowEvent("mousemove", ev => {
    mouseX.value = ev.clientX;
    mouseY.value = ev.clientY + 5;
});
useWindowEvent("touchmove", ev => {
    mouseX.value = ev.changedTouches[0]!.clientX;
    mouseY.value = ev.changedTouches[0]!.clientY;
});
</script>

<template>
    <h2>Level {{ levelIndex + 1 }}</h2>
    <LevelDisplay :level="levels[levelIndex]!" ref="display" />
    <Cat :key="attempt" ref="car" />
    <LevelFooter />
</template>