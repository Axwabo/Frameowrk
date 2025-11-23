<script setup lang="ts">
import LevelDisplay from "./LevelDisplay.vue";
import { ref, useTemplateRef } from "vue";
import { readBase64 } from "../levelLoader.ts";
import useEditorStore from "../editorStore.ts";
import { storeToRefs } from "pinia";
import ToolSelector from "./ToolSelector.vue";
import SvgEditor from "./SvgEditor.vue";

const { download } = useEditorStore();

const { saving, level } = storeToRefs(useEditorStore());

const upload = useTemplateRef("upload");

const display = useTemplateRef("display");

const text = ref("Select File");

const disabled = ref(false);

async function performUpload() {
    disabled.value = true;
    try {
        const file = upload.value!.files?.item(0);
        if (!file || !file.type.startsWith("image/"))
            return;
        text.value = file.name;
        level.value.image = await readBase64(file);
    } catch (e) {
        console.error(e);
        alert((e as Error)?.message);
    } finally {
        disabled.value = false;
    }
}

if (!window.matchMedia("(pointer: fine)"))
    alert("Editing is not supported on mobile devices");
</script>

<template>
    <h2>EDIT MODE</h2>
    <input type="file" accept="image/*" id="upload" ref="upload" v-on:change="performUpload" :disabled>
    <LevelDisplay edit :level ref="display" />
    <div class="options">
        <ToolSelector tool="Move">⇆</ToolSelector>
        <ToolSelector tool="Line">/</ToolSelector>
        <ToolSelector tool="Rect">□</ToolSelector>
        <ToolSelector tool="Circle">〇</ToolSelector>
        <ToolSelector tool="Delete">❌</ToolSelector>
    </div>
    <div class="options">
        <label for="upload" tabindex="0">{{ text }}</label>
        <button v-on:click="text = 'Select File'; level = { image: '', frame: '' }">Clear</button>
        <SvgEditor />
        <button v-on:click="download(display!.image!, display!.editor!.vector!.innerHTML, display!.width, display!.height)"
                :disabled="saving || !level.image || !level.frame">Download
        </button>
    </div>
</template>

<style scoped>
#upload {
    display: none;
}

label[for="upload"] {
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