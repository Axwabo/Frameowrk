import { defineStore } from "pinia";
import { shallowReactive } from "vue";
import type Level from "./level.ts";

interface State {
    levels: Level[];
    levelIndex: number;
    completionScores: number[];
}

const store = defineStore("game", {
    state: (): State => ({
        levels: shallowReactive([]),
        levelIndex: 0,
        completionScores: shallowReactive([])
    })
});

export default function useGameStore() {
    return store();
}