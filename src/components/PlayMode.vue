<script setup lang="ts" xmlns="">
import useGameStore from "../gameStore.ts";
import { loadLevels } from "../levelLoader.ts";
import LevelDisplay from "./LevelDisplay.vue";
import { storeToRefs } from "pinia";
import Cat from "./Cat.vue";
import LevelFooter from "./LevelFooter.vue";
import { onMounted, onUnmounted, useTemplateRef } from "vue";

const { levels } = useGameStore();

const { levelIndex, attempt } = storeToRefs(useGameStore());

const display = useTemplateRef("display");

await loadLevels(levels);

onMounted(() => {

});
onUnmounted(() => {

});
</script>

<template>
    <h2>Level {{ levelIndex + 1 }}</h2>
    <LevelDisplay :level="levels[levelIndex]!" ref="display" />
    <Cat :key="attempt" />
    <LevelFooter />
</template>