<script setup lang="ts">
import LevelDisplay from "./LevelDisplay.vue";
import { ref, useTemplateRef } from "vue";
import { readBase64 } from "../levelLoader.ts";
import useEditorStore from "../editorStore.ts";
import { storeToRefs } from "pinia";

const { level } = storeToRefs(useEditorStore());

const upload = useTemplateRef("upload");

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
</script>

<template>
    <h2>EDIT MODE</h2>
    <input type="file" accept="image/*" id="upload" ref="upload" v-on:change="performUpload" :disabled>
    <LevelDisplay edit :level />
    <button v-on:click="level = { image: '', frame: '' }">Clear</button>
    <label for="upload" tabindex="0">{{ text }}</label>
    <!--  TODO   -->
</template>

<style scoped>
#upload {
    display: none;
}

label[for="upload"] {
    background-color: aquamarine;
    justify-self: center;
}
</style>