import { onMounted, onUnmounted } from "vue";

export default function useAnimationFrame(callback: (delta: number) => void) {
    let frame = 0;
    let now = 0;

    onMounted(() => {
        now = performance.now();
        window.requestAnimationFrame(handler);
    });
    onUnmounted(() => {
        cancelAnimationFrame(frame);
        frame = -1;
    });

    function handler() {
        if (frame === -1)
            return;
        frame = window.requestAnimationFrame(handler);
        callback(Math.min(0.2, (performance.now() - now) * 0.001));
        now = performance.now();
    }
}