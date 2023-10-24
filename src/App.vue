<script setup>
import { RouterView } from 'vue-router'
import NavBar from './components/NavBar.vue';
import { useAuthStore } from './stores/auth';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
const authStore = useAuthStore()
const { currentUser } = storeToRefs(authStore)
const isLoggedIn = computed(() => {
      return currentUser.value
})
</script>

<template>
      <v-app>
            <NavBar v-if="isLoggedIn"/>
            <RouterView></RouterView>
      </v-app>
</template>

