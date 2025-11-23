import { defineStore } from "pinia";
import { reactive } from "vue";
import type Level from "./level.ts";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import type { Tool } from "./tool.ts";

interface State {
    level: Level;
    saving: boolean;
    currentTool: Tool;
}

async function createZip(element: HTMLImageElement, frame: string) {
    const canvas = new OffscreenCanvas(element.naturalWidth, element.naturalHeight);
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(element, 0, 0);
    const image = await canvas.convertToBlob();
    const zip = new JSZip();
    zip.file("image.png", image);
    zip.file("frame.svg", frame);
    return await zip.generateAsync({ type: "blob" });
}

const store = defineStore("editor", {
    state: (): State => ({
        level: reactive({
            image: "",
            frame: ""
        }),
        saving: false,
        currentTool: "Line"
    }),
    actions: {
        async download(element: HTMLImageElement) {
            this.saving = true;
            try {
                const blob = await createZip(element, this.level.frame);
                saveAs(blob, "FrameowrkLevel.zip");
            } catch (e) {
                console.error(e);
                alert("Couldn't download level: " + (e as Error)?.message);
            } finally {
                this.saving = false;
            }
        }
    }
});

export default function useEditorStore() {
    return store();
}