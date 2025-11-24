<script setup lang="ts">
import useGameStore from "../gameStore.ts";
import { storeToRefs } from "pinia";
import { builtInLevelCount } from "../levelLoader.ts";

const emit = defineEmits([ "submit", "screenshot" ]);

const { attempt, paused, levelIndex } = storeToRefs(useGameStore());
</script>

<template>
    <p>Move your mouse to control the cat. Hold left click to draw.</p>
    <div class="buttons">
        <button v-on:click="attempt++; paused = false">Restart</button>
        <button v-on:click="emit('screenshot')">Screenshot</button>
        <button v-on:click="levelIndex = Math.min(builtInLevelCount - 1, levelIndex + 1)">Next</button>
    </div>
</template>

<style scoped>
p {
    align-self: center;
}

.buttons {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
}
</style>