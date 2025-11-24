<script setup lang="ts">
import PWABadge from "./components/PWABadge.vue"
import PlayMode from "./components/PlayMode.vue";
import Loading from "./components/Loading.vue";
import EditMode from "./components/EditMode.vue";
import AppHeader from "./components/AppHeader.vue";
import AppFooter from "./components/AppFooter.vue";
import LevelsView from "./components/LevelsView.vue";
import { storeToRefs } from "pinia";
import useEditorStore from "./editorStore.ts";

const { view } = storeToRefs(useEditorStore());
</script>

<template>
    <PWABadge />
    <AppHeader />
    <Suspense>
        <component :is="view === 'Edit' ? EditMode : view === 'Levels' ? LevelsView : PlayMode" />
        <template #fallback>
            <Loading />
        </template>
    </Suspense>
    <AppFooter />
</template>
