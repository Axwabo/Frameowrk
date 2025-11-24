import { defineStore } from "pinia";
import { shallowReactive } from "vue";
import type Level from "./level.ts";

interface State {
    levels: Level[];
    levelIndex: number;
    completionScores: number[];
    attempt: number;
    mouseX: number;
    mouseY: number;
    paused: boolean;
}

const store = defineStore("game", {
    state: (): State => ({
        levels: shallowReactive([]),
        levelIndex: 0,
        completionScores: shallowReactive([]),
        attempt: 0,
        mouseX: 0,
        mouseY: 0,
        paused: false
    })
});

export default function useGameStore() {
    return store();
}