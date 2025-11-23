import { defineStore } from "pinia";
import { reactive } from "vue";
import type Level from "./level.ts";

interface State {
    level: Level;
}

const store = defineStore("editor", {
    state: (): State => ({
        level: reactive({
            image: "",
            frame: ""
        })
    })
});

export default function useEditorStore() {
    return store();
}