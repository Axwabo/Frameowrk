<script setup lang="ts">
import { ref } from "vue";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import useGameStore from "../gameStore.ts";
import { storeToRefs } from "pinia";
import useEditorStore from "../editorStore.ts";
import { builtInLevelCount } from "../levelLoader.ts";

const { levels, customLevels } = useGameStore();

const { levelIndex, attempt } = storeToRefs(useGameStore());

const { view } = storeToRefs(useEditorStore());

const disabled = ref(false);

async function exportAll() {
    disabled.value = true;
    try {
        const cache = await caches.open("CustomLevels");
        const zip = new JSZip();
        const keys = await cache.keys();
        for (const key of keys) {
            const response = await cache.match(key);
            if (response)
                zip.file(decodeURI(new URL(key.url).pathname.substring(1)) + ".zip", response.blob());
        }
        const blob = await zip.generateAsync({ type: "blob" });
        saveAs(blob, "Custom Frameowrk Levels.zip");
    } catch (e) {
        console.log(e);
        alert("Export failed: " + (e as Error)?.message);
    }
    disabled.value = false;
}

async function deleteAll() {
    if (!confirm("Delete all custom levels?"))
        return;
    disabled.value = true;
    await caches.delete("CustomLevels");
    customLevels.clear();
    levels.splice(builtInLevelCount);
    disabled.value = false;
}
</script>

<template>
    <h2>LEVELS</h2>
    <div id="levelList">
        <button v-for="(thisLevel, index) in levels" v-on:click="attempt = 0; levelIndex = index; view = 'Play'">
            {{ index < builtInLevelCount ? index + 1 : customLevels.get(thisLevel) }}
        </button>
    </div>
    <button v-on:click="exportAll" :disabled>Export All Custom Levels</button>
    <button v-on:click="deleteAll" :disabled>Delete Custom Levels</button>
</template>

<style scoped>
#levelList {
    overflow-y: auto;
    scrollbar-gutter: stable;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem;
}
</style>