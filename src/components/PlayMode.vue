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

const { levelIndex, attempt, mouseX, mouseY } = storeToRefs(useGameStore());

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
    if (!mouseDown)
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

useWindowEvent("mousedown", () => mouseDown = true);
useWindowEvent("mouseup", () => mouseDown = false);
useWindowEvent("mousemove", ev => {
    mouseX.value = ev.clientX;
    mouseY.value = ev.clientY + 5;
});
</script>

<template>
    <h2>Level {{ levelIndex + 1 }}</h2>
    <LevelDisplay :level="levels[levelIndex]!" ref="display" />
    <Cat :key="attempt" ref="car" />
    <LevelFooter />
</template>