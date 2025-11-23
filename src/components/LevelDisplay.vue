<script setup lang="ts">
import type Level from "../level.ts";
import { ref, useTemplateRef } from "vue";
import FrameEditor from "./FrameEditor.vue";

const { level, edit } = defineProps<{ level: Level; edit?: boolean; }>();

const image = useTemplateRef("image");

const width = ref(0);
const height = ref(0);

function onLoaded() {
    if (!image.value)
        return;
    const rect = image.value.getBoundingClientRect();
    width.value = Math.floor(rect.width + 160);
    height.value = Math.floor(rect.height + 160);
}

defineExpose({ image, width, height });
</script>

<template>
    <div class="level">
        <img id="image" :src="level.image" alt="" draggable="false" v-on:load="onLoaded" ref="image">
        <div id="editor" class="frame" v-if="edit" :style="`width: ${width}px; height: ${height}px;`">
            <FrameEditor />
        </div>
        <template v-else>
            <canvas class="frame" :width :height></canvas>
            <img class="frame" alt="" draggable="false" :src="level.frame" :width :height>
        </template>
    </div>
</template>

<style scoped>
.level {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow-y: hidden;
}

#image {
    max-height: calc(100% - 160px);
    max-width: calc(90vw - 160px);
}

#editor {
    box-sizing: border-box;
    border: 1px solid gray;
}

.frame {
    position: absolute;
    top: 50%;
    left: 50%;
    translate: -50% -50%;
    z-index: -1;
}
</style>