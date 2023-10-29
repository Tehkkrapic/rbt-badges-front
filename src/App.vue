<script setup>
import { RouterView } from 'vue-router'
import NavBar from './components/NavBar.vue';
</script>

<template>
      <v-app>
            <NavBar v-if="!$route.meta.hideNavbar"/>
            <RouterView></RouterView>
      </v-app>
</template>

