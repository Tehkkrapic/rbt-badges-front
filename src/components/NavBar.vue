
<script setup>
import { ref } from 'vue';
import { useDisplay } from 'vuetify'
import { watch } from 'vue';
import { useAuthStore } from '../stores/auth';
import router from '../router';

const authStore = useAuthStore()
const display = useDisplay()
const drawer = ref(false);

watch(display.mdAndUp, newVal => {
    drawer.value = false
})

const logout = () => {
  authStore.logout()
}

</script>

<template>
   <v-app-bar
        color="blue"
      >
        
        <template v-slot:prepend>
          <v-app-bar-nav-icon class="d-md-none" @click="drawer = !drawer"></v-app-bar-nav-icon>
        </template>

        <v-app-bar-title>Riteh Blockchain Team</v-app-bar-title>

        <v-spacer></v-spacer>

        <div class="d-none d-md-block">

            
        <v-btn prepend-icon="mdi-home" to="/">
            Home
        </v-btn>
        <!--
        <v-btn prepend-icon="mdi-account" to="/administrators">
            Administrators
        </v-btn>
        -->
        <v-btn prepend-icon="mdi-logout" @click="logout">
            Logout
        </v-btn>        
        </div>
        </v-app-bar>
        <v-navigation-drawer
            v-model="drawer"
            temporary
        >

        <v-divider></v-divider>

        <v-list density="compact" nav>
          <v-list-item prepend-icon="mdi-home" title="Home" :to="{name: 'badgeGrid', params: {blockchain: 'ETHEREUM'}}"></v-list-item>
          <!--
          <v-list-item prepend-icon="mdi-account" title="Administrators" value="administrators" to="/administrators"></v-list-item>
          <v-list-item prepend-icon="mdi-view-list" title="Blockchains" value="blockchains" to="/blockchains"></v-list-item>
          -->
          <v-list-item prepend-icon="mdi-logout" title="Logout" value="logout" @click="logout"></v-list-item>
        </v-list>
      </v-navigation-drawer>
</template>

<style>

</style>
