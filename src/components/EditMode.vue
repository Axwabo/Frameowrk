<script setup lang="ts">
import LevelDisplay from "./LevelDisplay.vue";
import { ref, useTemplateRef } from "vue";
import { loadLevel, readBase64 } from "../levelLoader.ts";
import useEditorStore from "../editorStore.ts";
import { storeToRefs } from "pinia";
import ToolSelector from "./ToolSelector.vue";
import SvgEditor from "./SvgEditor.vue";
import useWindowEvent from "../composables/useWindowEvent.ts";
import useGameStore from "../gameStore.ts";

const { cache, download, history } = useEditorStore();

const { levels, customLevels } = useGameStore();

const { saving, level } = storeToRefs(useEditorStore());

const upload = useTemplateRef("upload");
const importInput = useTemplateRef("import");

const display = useTemplateRef("display");

const text = ref("Select File");

const disabled = ref(false);

async function performUpload(file: File | null | undefined) {
    if (!file)
        return;
    disabled.value = true;
    try {
        if (file.type.startsWith("image/")) {
            level.value.image = await readBase64(file);
            text.value = file.name;
        } else if (file.type.startsWith("application/")) {
            level.value = await loadLevel(file, true);
            text.value = file.name;
        }
    } catch (e) {
        console.error(e);
        alert((e as Error)?.message);
    } finally {
        disabled.value = false;
    }
}

function undo() {
    if (history.length)
        level.value.frame = history.pop()!;
}

useWindowEvent("paste", ev => performUpload(ev.clipboardData?.files[0]));
</script>

<template>
    <h2>EDIT MODE</h2>
    <input type="file" accept="image/*" id="upload" ref="upload" v-on:change="performUpload(upload!.files?.item(0))" :disabled>
    <input type="file" accept="application/zip" id="import" ref="import" v-on:change="performUpload(importInput!.files?.item(0))" :disabled>
    <LevelDisplay edit :level ref="display" />
    <div class="options">
        <ToolSelector tool="Move">⇆</ToolSelector>
        <ToolSelector tool="Line">/</ToolSelector>
        <ToolSelector tool="Rect">□</ToolSelector>
        <ToolSelector tool="Ellipse">⬭</ToolSelector>
        <ToolSelector tool="Circle">〇</ToolSelector>
        <ToolSelector tool="Circumference">⤵</ToolSelector>
        <ToolSelector tool="Rotate">🔄</ToolSelector>
        <button class="tool" title="Undo" :disabled="!history.length" v-on:click="undo">↩</button>
        <ToolSelector tool="Delete">❌</ToolSelector>
    </div>
    <div class="options">
        <label for="import" tabindex="0">Import Level</label>
        <label for="upload" tabindex="0">{{ text }}</label>
        <button v-on:click="text = 'Select File'; level = { image: '', frame: '' }">Clear</button>
        <SvgEditor />
        <button v-on:click="download(display!.image!, display!.editor!.vector!.innerHTML, display!.width, display!.height)"
                :disabled="saving || !level.image || !level.frame">Download
        </button>
        <button v-on:click="cache(display!.image!, display!.editor!.vector!.innerHTML, display!.width, display!.height, levels, customLevels)"
                :disabled="saving || !level.image || !level.frame">Cache
        </button>
    </div>
</template>

<style scoped>
input[type="file"] {
    display: none;
}

label {
    background-color: aquamarine;
    justify-self: center;
}

.options {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
}
</style>