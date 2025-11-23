<script setup lang="ts">
import type Level from "../level.ts";
import { ref, useTemplateRef } from "vue";
import FrameEditor from "./FrameEditor.vue";
import useWindowEvent from "../composables/useWindowEvent.ts";

const { level, edit } = defineProps<{ level: Level; edit?: boolean; }>();

const image = useTemplateRef("image");

const editor = useTemplateRef("editor");

const frameImage = useTemplateRef("frameImage");

const drawingCanvas = useTemplateRef("drawingCanvas");

const width = ref(0);
const height = ref(0);

const radius = ref(160);

function onLoaded() {
    if (!image.value)
        return;
    const rect = image.value.getBoundingClientRect();
    radius.value = Math.floor(160 * Math.min(rect.width / rect.height));//TODO
    width.value = Math.floor(rect.width + 160);
    height.value = Math.floor(rect.height + 160);
}

defineExpose({ image, width, height, editor, frameImage, drawingCanvas });

useWindowEvent("resize", onLoaded);
</script>

<template>
    <div class="level">
        <img id="image" :src="level.image" alt="" draggable="false" v-on:load="onLoaded" ref="image">
        <template v-if="edit">
            <div id="frame" class="frame" :style="`width: ${width - 1}px; height: ${height - 1}px;`"></div>
            <div id="editor" class="frame" :style="`width: ${width}px; height: ${height}px;`">
                <FrameEditor ref="editor" :width :height />
            </div>
        </template>
        <template v-else>
            <img class="frame" alt="" draggable="false" ref="frameImage" :src="level.frame" :width :height>
            <canvas class="frame" ref="drawingCanvas" :width :height></canvas>
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
    pointer-events: none;
    z-index: 1;
}

#frame {
    border: 1px solid gray;
    pointer-events: none;
}

.frame {
    position: absolute;
    top: 50%;
    left: 50%;
    translate: -50% -50%;
}

img.frame {
    opacity: 0.5;
}
</style>