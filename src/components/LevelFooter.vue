<script setup lang="ts">
import useGameStore from "../gameStore.ts";
import { storeToRefs } from "pinia";

const { attempt } = storeToRefs(useGameStore());
</script>

<template>
    <p>Move your mouse to control the cat. Hold left click to draw.</p>
    <div class="buttons">
        <button v-on:click="attempt++">Restart</button>
        <button>Submit</button>
        <button>Next</button>
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