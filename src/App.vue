<script setup lang="ts">
import PWABadge from "./components/PWABadge.vue"
import PlayMode from "./components/PlayMode.vue";
import Loading from "./components/Loading.vue";
import EditMode from "./components/EditMode.vue";
import AppHeader from "./components/AppHeader.vue";
import AppFooter from "./components/AppFooter.vue";
import { ref } from "vue";

const edit = ref(false);
</script>

<template>
    <PWABadge />
    <AppHeader />
    <Suspense>
        <component :is="edit ? EditMode : PlayMode" />
        <template #fallback>
            <Loading />
        </template>
    </Suspense>
    <AppFooter v-on:play="edit = false" v-on:edit="edit = true" />
</template>
