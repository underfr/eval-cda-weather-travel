<template>
  <div class="max-lg:collapse bg-base-200 lg:mb-48 shadow-sm w-full rounded-md">
    <input id="navbar-1-toggle" class="peer hidden" type="checkbox" />
    <label for="navbar-1-toggle" class="fixed inset-0 hidden max-lg:peer-checked:block"></label>
    <div class="collapse-title navbar">
      <div class="navbar-start">
        <label for="navbar-1-toggle" class="btn btn-ghost lg:hidden">
          <svg aria-label="Menu" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
               viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M4 6h16M4 12h8m-8 6h16" />
          </svg>
        </label>
        <button class="btn btn-ghost text-xl">Weather Travel</button>
      </div>
      <div class="navbar-center hidden lg:flex">
        <ul class="menu menu-horizontal px-1">
          <li>
            <router-link to="/">
              <button>Accueil</button>
            </router-link>
          </li>

          <template v-if="!isLoggedIn">
            <li>
              <router-link to="/login">
                <button>Se connecter</button>
              </router-link>
            </li>
            <li>
              <router-link to="/register">
                <button>S'inscrire</button>
              </router-link>
            </li>
            <li>
              <router-link to="/city-search">
                <button>city-search</button>
              </router-link>
            </li>
          </template>
          <li v-if="isLoggedIn">
            <button @click="logout">Se déconnecter</button>
          </li>
          <li v-if="isLoggedIn">
            <router-link to="/dashboard">
              <button>Dashboard</button>
            </router-link>
          </li>
        </ul>
      </div>
    </div>

    <div class="collapse-content lg:hidden z-1">
      <ul class="menu">
        <li><button>Accueil</button></li>
        <template v-if="!isLoggedIn">
          <li><router-link to="/login"><button>Se connecter</button></router-link></li>
          <li><router-link to="/register"><button>S'inscrire</button></router-link></li>
        </template>
        <li v-if="isLoggedIn">
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { onAuthStateChanged, signOut, type Unsubscribe } from 'firebase/auth';
import { auth } from '../services/firebase.ts';
import router from "../router";

const isLoggedIn = ref<boolean>(false);
let unsubscribe: Unsubscribe;

async function logout(): Promise<void> {
  await signOut(auth);
  await router.push({ name: 'login' });
}

onMounted(() => {
  // Écoute en temps réel si un utilisateur est connecté ou non
  unsubscribe = onAuthStateChanged(auth, (user) => {
    isLoggedIn.value = !!user;
  });
});

onUnmounted(() => {
  // Nettoyage du listener quand le composant est détruit
  if (unsubscribe) unsubscribe();
});
</script>