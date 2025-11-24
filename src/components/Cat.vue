<script setup lang="ts">
import { computed, ref } from "vue";
import useAnimationFrame from "../composables/useAnimationFrame.ts";
import { storeToRefs } from "pinia";
import useGameStore from "../gameStore.ts";

const { mouseX, mouseY, paused } = storeToRefs(useGameStore());

const top = ref(100);
const left = ref(Math.floor(window.innerWidth / 2));
const angle = ref(0);
const topPx = computed(() => `${top.value}px`);
const leftPx = computed(() => `${left.value}px`);
const rotateDeg = computed(() => `${angle.value * 180 / Math.PI}deg`);

defineExpose({ top, left, angle });

useAnimationFrame(delta => {
    if (paused.value)
        return;
    let dx = mouseX.value - left.value;
    let dy = mouseY.value - top.value;
    const magnitude = Math.sqrt(dx * dx + dy * dy);
    dx /= magnitude;
    dy /= magnitude;
    const speed = magnitude < 150 ? 50 : 100;
    if (magnitude <= 5) {
        angle.value += delta * 5;
        return;
    }
    angle.value = -Math.atan2(dx, dy);
    top.value += dy * delta * speed;
    left.value += dx * delta * speed;
});
</script>

<template>
    <span id="car">🐱</span>
</template>

<style scoped>
#car {
    opacity: 0.8;
    position: absolute;
    z-index: 1;
    font-size: 30px;
    top: v-bind(topPx);
    left: v-bind(leftPx);
    transform-origin: top center;
    translate: -50% 0;
    rotate: v-bind(rotateDeg);
    scale: 1 -1;
}
</style>