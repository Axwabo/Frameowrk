import JSZip from "jszip";
import type Level from "./level.ts";
import base from "./base.ts";

const builtInLevelCount = 1;

export async function loadLevels(target: Level[]) {
    if (target.length !== 0)
        return;

    for (let i = 0; i < builtInLevelCount; i++) {
        const level = await fetch(`${base}levels/${i + 1}.zip`);
        if (level.ok)
            target.push(await loadLevel(level.blob()));
    }
}

export async function loadLevel(data: Blob | Promise<Blob>, plain?: boolean): Promise<Level> {
    const zip = await JSZip.loadAsync(data);
    const png = zip.files["image.png"];
    if (!png)
        throw new Error("Image not found");
    const svg = zip.files["frame.svg"];
    if (!svg)
        throw new Error("Frame not found");
    const image = `data:image/png;base64,${await png.async("base64")}`;
    if (!plain)
        return { image, frame: `data:image/svg+xml;base64,${await svg.async("base64")}` };
    const text = await svg.async("text");
    const container = document.createElement("div");
    container.innerHTML = text;
    const frame = container.querySelector("svg")?.innerHTML ?? "";
    return { image, frame };
}

export async function readBase64(file: Blob) {
    const reader = new FileReader();
    await new Promise((resolve, reject) => {
        reader.addEventListener("load", resolve);
        reader.addEventListener("error", reject);
        reader.readAsDataURL(file);
    });
    return reader.result as string;

}