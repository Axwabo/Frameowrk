<script setup lang="ts">
import PWABadge from "./components/PWABadge.vue"
import PlayMode from "./components/PlayMode.vue";
</script>

<template>
    <PWABadge />
    <Suspense>
        <PlayMode />
        <template #fallback>
            <progress />
        </template>
    </Suspense>
</template>
