<script setup lang="ts">
import { computed, ref } from "vue";

const top = ref(50);
const left = ref(Math.floor(window.innerWidth / 2));
const rotate = ref(0);
const topPx = computed(() => `${top.value}px`);
const leftPx = computed(() => `${left.value}px`);
const rotateDeg = computed(() => `${rotate.value}deg`);
</script>

<template>
    <span id="car">🐱</span>
</template>

<style scoped>
#car {
    font-size: 2em;
    position: absolute;
    top: v-bind(topPx);
    left: v-bind(leftPx);
    transform-origin: top center;
    translate: -50% 0;
    rotate: v-bind(rotateDeg);
}
</style>