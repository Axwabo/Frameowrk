<script setup lang="ts">
import type Level from "../level.ts";
import { ref, useTemplateRef } from "vue";

const { level } = defineProps<{ level: Level; }>();

const image = useTemplateRef("image");

const width = ref(0);
const height = ref(0);

function onLoaded() {
    if (!image.value)
        return;
    const rect = image.value.getBoundingClientRect();
    width.value = rect.width + 160;
    height.value = rect.height + 160;
}
</script>

<template>
    <div class="level">
        <img id="image" :src="level.image" alt="" v-on:load="onLoaded" ref="image">
        <canvas class="frame" :width :height></canvas>
        <img class="frame" alt="" :src="level.frame" :width :height>
    </div>
</template>

<style scoped>
.level {
    position: relative;
}

#image {
    max-height: calc(50vh);
    max-width: calc(90vw - 160px);
}

.frame {
    position: absolute;
    top: 50%;
    left: 50%;
    translate: -50% -50%;
    z-index: -1;
}
</style>