<script setup lang="ts">
import AppHeader from './components/AppHeader.vue';
import AppFooter from './components/AppFooter.vue';
</script>

<template>
  <div class="min-h-screen flex flex-col bg-base-200 text-base-content">

    <app-header />
    <main class="flex-1 w-full max-w-7xl mx-auto p-4 md:p-8">
      <router-view />
    </main>
    <app-footer />
  </div>
</template>
