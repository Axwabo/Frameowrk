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

async function loadLevel(data: Promise<Blob>): Promise<Level> {
    const zip = await JSZip.loadAsync(data);
    const image = zip.files["image.png"];
    if (!image)
        throw new Error("Image not found");
    const svg = zip.files["frame.svg"];
    if (!svg)
        throw new Error("Frame not found");
    return {
        image: `data:image/png;base64,${await image.async("base64")}`,
        frame: `data:image/svg+xml;base64,${await svg.async("base64")}`
    };
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