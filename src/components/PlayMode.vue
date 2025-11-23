<script setup lang="ts">
import useGameStore from "../gameStore.ts";
import { loadLevels } from "../levelLoader.ts";
import LevelDisplay from "./LevelDisplay.vue";
import { storeToRefs } from "pinia";

const { levels } = useGameStore();

const { levelIndex } = storeToRefs(useGameStore());

await loadLevels(levels);
</script>

<template>
    <h2>Level {{ levelIndex + 1 }}</h2>
    <LevelDisplay :level="levels[levelIndex]!" />
    <p>Move your mouse to control the cat. Hold left click to draw.</p>
</template>