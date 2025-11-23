import { defineStore } from "pinia";
import { reactive } from "vue";
import type Level from "./level.ts";
import JSZip from "jszip";
import { saveAs } from "file-saver";

interface State {
    level: Level;
}

const store = defineStore("editor", {
    state: (): State => ({
        level: reactive({
            image: "",
            frame: ""
        })
    }),
    actions: {
        async download(element: HTMLImageElement) {
            const canvas = new OffscreenCanvas(element.naturalWidth, element.naturalHeight);
            const ctx = canvas.getContext("2d")!;
            ctx.drawImage(element, 0, 0);
            const image = await canvas.convertToBlob();
            const zip = new JSZip();
            zip.file("image.png", image);
            zip.file("frame.svg", this.level.frame);
            const blob = await zip.generateAsync({ type: "blob" });
            saveAs(blob, "FrameowrkLevel.zip");
        }
    }
});

export default function useEditorStore() {
    return store();
}