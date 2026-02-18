<script setup>
import { useRoute } from 'vue-router'
import TablesLogoSingle from '/assets/logos/tables_logo_T.svg'

const route = useRoute()
</script>

<template>
  <div class="app-shell">
    <header>
      <router-link to="/" class="logo-link">
        <img :src="TablesLogoSingle" alt="Tables Logo" class="header-logo"/>
      </router-link>
      <nav class="main-nav">
        <router-link to="/events" :class="{ active: route.name === 'events' }">Events</router-link>
      </nav>
    </header>

    <router-view v-slot="{ Component }">
      <transition name="page-fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<style scoped>
.app-shell {
  min-height: 100vh;
}

header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background: linear-gradient(to bottom, rgba(14, 13, 13, 0.95), transparent);
}

.logo-link {
  display: flex;
  align-items: center;
}

.header-logo {
  width: 35px;
  max-width: 40px;
  opacity: 1;
  transition: opacity 0.5s ease;
}

.header-logo:hover {
  opacity: 0.7;
}

.main-nav {
  display: flex;
  gap: 2rem;
}

.main-nav a {
  color: white;
  text-decoration: none;
  font-family: "Inter", sans-serif;
  font-weight: 300;
  font-size: 1rem;
  opacity: 0.7;
  transition: opacity 0.3s;
  position: relative;
}

.main-nav a:hover,
.main-nav a.active {
  opacity: 1;
}

.main-nav a.active::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  right: 0;
  height: 1px;
  background: white;
}

.page-fade-enter-active,
.page-fade-leave-active {
  transition: opacity 0.4s ease;
}

.page-fade-enter-from,
.page-fade-leave-to {
  opacity: 0;
}

@media screen and (min-width: 768px) {
  header {
    padding: 1rem 2rem;
  }

  .main-nav {
    gap: 3rem;
  }

  .main-nav a {
    font-size: 1.1rem;
  }
}
</style>
