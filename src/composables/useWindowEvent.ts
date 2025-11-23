import { onMounted, onUnmounted } from "vue";

export default function useWindowEvent<T extends keyof WindowEventMap>(type: T, callback: (ev: WindowEventMap[T]) => void) {
    onMounted(() => window.addEventListener(type, callback));
    onUnmounted(() => window.removeEventListener(type, callback));
}