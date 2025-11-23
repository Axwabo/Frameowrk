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
    let svgBlob = await svg.async("blob");
    return {
        image: URL.createObjectURL(await image.async("blob")),
        frame: URL.createObjectURL(new Blob([ svgBlob ], { type: "image/svg" }))
    };
}