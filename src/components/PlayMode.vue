<script setup lang="ts">
import useGameStore from "../gameStore.ts";
import base from "../base.ts";
import loadLevel from "../levelLoader.ts";

const { levels } = useGameStore();

const builtInLevelCount = 1;

for (let i = 0; i < builtInLevelCount; i++) {
    const level = await fetch(`${base}levels/${i + 1}.zip`);
    if (level.ok)
        levels.push(await loadLevel(level.blob()));
}
</script>

<template>
    <img :src="levels[0]!.image">
    <img :src="levels[0]!.frame" alt="" width="50" height="50">
</template>

<style scoped>

</style>