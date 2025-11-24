import { defineStore } from "pinia";
import { shallowReactive } from "vue";
import type Level from "./level.ts";

interface State {
    levels: Level[];
    customLevels: Map<string, Level>;
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
        customLevels: shallowReactive(new Map<string, Level>()),
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