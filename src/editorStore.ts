import { defineStore } from "pinia";
import { reactive } from "vue";
import type Level from "./level.ts";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import type { Tool } from "./tool.ts";
import type { View } from "./view.ts";

interface State {
    level: Level;
    saving: boolean;
    currentTool: Tool;
    history: string[];
    view: View;
}

async function createZip(element: HTMLImageElement, frame: string, width: number, height: number) {
    const canvas = new OffscreenCanvas(element.naturalWidth, element.naturalHeight);
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(element, 0, 0);
    const image = await canvas.convertToBlob();
    const zip = new JSZip();
    zip.file("image.png", image);
    zip.file("frame.svg", `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}">${frame}</svg>`);
    return await zip.generateAsync({ type: "blob" });
}

const store = defineStore("editor", {
    state: (): State => ({
        level: reactive({
            image: "",
            frame: ""
        }),
        saving: false,
        currentTool: "Line",
        history: reactive([]),
        view: "Play"
    }),
    actions: {
        async cache(image: HTMLImageElement, frame: string, width: number, height: number) {
            const name = prompt("Enter name of custom level");
            if (!name)
                return;
            this.saving = true;
            try {
                const cache = await caches.open("CustomLevels");
                const blob = await createZip(image, frame, width, height);
                await cache.put(`/${name}`, new Response(blob));
            } catch (e) {
                console.error(e);
                alert("Couldn't download level: " + (e as Error)?.message);
            } finally {
                this.saving = false;
            }
        },
        async download(image: HTMLImageElement, frame: string, width: number, height: number) {
            this.saving = true;
            try {
                const blob = await createZip(image, frame, width, height);
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