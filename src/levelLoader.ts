import JSZip from "jszip";
import type Level from "./level.ts";

export default async function loadLevel(data: Promise<Blob>): Promise<Level> {
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