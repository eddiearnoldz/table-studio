<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

const images = ref([
  '/assets/images/chef.webp',
  '/assets/images/event_space.webp',
  '/assets/images/food.webp',
  '/assets/images/ikebana.webp'
]);

const duplicatedImages = ref([...images.value, ...images.value]);

const showAbout = ref(false);
const showContact = ref(false);

const hideSections = () => {
  showAbout.value = false;
  showContact.value = false;
};

const toggleAbout = () => {
  showAbout.value = !showAbout.value;
  if (showAbout.value) showContact.value = false;
};

const toggleContact = () => {
  showContact.value = !showContact.value;
  if (showContact.value) showAbout.value = false;
};

const handleClickOutside = (event) => {
  const aboutSection = document.querySelector('.about-section');
  const contactSection = document.querySelector('.contact-section');
  if (
    !aboutSection?.contains(event.target) &&
    !contactSection?.contains(event.target) &&
    !event.target.closest('header')
  ) {
    hideSections();
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<template>
  <header>
    <h2 class="logo">Tables Studio</h2>
    <ul class="nav">
      <li @click="toggleAbout">About</li>
      <li @click="toggleContact">Contact</li>
    </ul>
  </header>

  <transition name="fade">
    <div v-if="showAbout" class="displayInfo about-section">
      <p>Tables studio is a bespoke, conceptual events production company in London, bringing your wildest dreams to life. </p>
    </div>
  </transition>

  <transition name="fade">
    <div v-if="showContact" class="displayInfo contact-section">
      <a href="mailto:info@tables.studio">info@tables.studio</a>
      <a href="https://instagram.com" target="_blank">@tables-studio</a>
    </div>
  </transition>

  <main>
    <h1>Tables Studio</h1>
    <div id="container">
      <div class="scroll">
        <div class="m-scroll">
          <div v-for="(img, index) in duplicatedImages" :key="'img-' + index" class="carousel-item">
            <img :src="img" alt="carousel image" />
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
body {
  margin: 0;
}

header {
  position: absolute;
  top: 0;
  z-index: 1;
  color: white;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: calc(100% - 2rem);
}

.nav {
  list-style: none;
  display: flex;
  gap: 1rem;
}

.logo {
  cursor: pointer;
  transition: transform 0.3s;
  font-family: 'Koulen';
  letter-spacing: 0.1rem;
  line-height: 100%;
  font-size: 2rem;
  margin: 0;
}

.nav li {
  cursor: pointer;
  text-decoration: none;
  transition: transform 0.3s;
  font-family: 'Koulen';
  font-size: 1.5rem;
  letter-spacing: 0.1rem;
}

.nav li:hover,
.logo:hover  {
transform: scale(1.1);
transition: transform 0.3s;
}

.displayInfo {
  position: absolute;
  top: 100px;
  left: 0;
  right: 0;
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
  font-size: 2rem;
  z-index: 3;
  color: white;
  opacity: 1;
  mix-blend-mode: difference;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.displayInfo a {
  text-decoration: none;
  color: white;
  opacity: 1;
  mix-blend-mode: exclusion;
}

main {
  display: flex;
  justify-content: center;
}

#container {
  width: 100%;
  height: 100vh;
  position: relative;
  overflow: hidden;
  z-index: 0;
}

.scroll {
  position: relative;
  width: 100vw;
  background-color: #000;
  overflow: hidden;
  z-index: 1;
  margin: 0;
  padding: 0;
  height: 100vh;
}

.m-scroll {
  overflow: hidden;
  height: 100%;
  white-space: nowrap;
  animation: scrollText 50s infinite linear;
  margin: 0;
  font-size: 0;
  display: flex;
  justify-content: space-between;
  width: fit-content;
}

@keyframes scrollText {
  from {
    transform: translateX(0%);
  }
  to {
    transform: translateX(-50%);
  }
}

.carousel-item {
  display: inline-block;
  height: 100%;
  width: 75vw; /* Adjust to show four items */
}

.carousel-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

main h1 {
  position: absolute;
  bottom: 0;
  color: white;
  opacity: 1;
  mix-blend-mode: difference;
  font-size: clamp(2rem, 17vw, 20rem);
  line-height: 0.3;
  z-index: 3;
  font-family: 'Koulen';
  letter-spacing: 0.5vw;
}

.logo,
main h1 {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

@media (min-width: 768px) {

  header {
    width: calc(100% - 4rem);
    padding: 1rem 2rem;
  }
  .carousel-item {
    width: 33vw;
  }

  .nav li {
    font-size: 2rem;
    letter-spacing: 0.2rem;
  }

  .logo {
    font-size: 3rem;
    letter-spacing: 0.2rem;
  }
}
</style>
