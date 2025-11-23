<script setup lang="ts">
import { storeToRefs } from "pinia";
import useEditorStore from "../editorStore.ts";
import { useTemplateRef } from "vue";

const { width, height } = defineProps<{ width: number, height: number; }>();

const { level, currentTool } = storeToRefs(useEditorStore());

const vector = useTemplateRef("vector");

defineExpose({ vector });

function onClick(ev: Event) {
    const target = ev.target as SVGElement;
    console.log(target)
    /*TODO*/
}
</script>

<template>
    <svg v-html="level.frame" ref="vector" v-on:click="onClick" :width :height :viewBox="`0 0 ${width} ${height}`"></svg>
</template>

<style scoped>

</style>