<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue';
import gsap from 'gsap'
import TablesLogo from '/assets/logos/tables_logo.svg'

// Comment out image references and functions
// const images = ref([
//   '/assets/images/tables_background_one.webp',
//   '/assets/images/tables_background_two.webp',
//   '/assets/images/tables_background_three.webp',
//   '/assets/images/tables_background_four.webp',
//   '/assets/images/tables_background_five.webp',
// ]);

// const duplicatedImages = ref([...images.value, ...images.value]);

const showAbout = ref(false);
const showContact = ref(false);
const videoLoaded = ref(false);
const cursorX = ref(0);
const cursorY = ref(0);
const showCursor = ref(window.innerWidth > 768);

const hideSections = () => {
  showAbout.value = false;
  showContact.value = false;
};

const splitTitle = (title) => {
  return title.split('').map((letter) => `<span class="name-animation">${letter}</span>`).join('');
};

const toggleAbout = () => {
  if (!showAbout.value) {
    showAbout.value = true;
    showContact.value = false;
  }
};

const toggleContact = () => {
  if (!showContact.value) {
    showContact.value = true;
    showAbout.value = false;
  }
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

const handleMouseMove = (event) => {
  cursorX.value = event.clientX;
  cursorY.value = event.clientY;
};

const handleResize = () => {
  showCursor.value = window.innerWidth > 768;
  if (showCursor.value) {
    document.addEventListener('mousemove', handleMouseMove);
  } else {
    document.removeEventListener('mousemove', handleMouseMove);
  }
};

const animateTitle = () => {
  const letters = document.querySelectorAll('.name-animation');
  gsap.fromTo(
    letters,
    { opacity: 0},
    {  opacity: 1, stagger: {each: 0.2, from:"start"}, duration: 1, delay: 1,}
  );
};

const fadeInContent = () => {
  gsap.to('.content', { opacity: 1, duration: 1 });
};

// Comment out image preloading function
// const preloadImages = (imageArray) => {
//   let loadedCount = 0;
//   const totalImages = imageArray.length;

//   imageArray.forEach((src) => {
//     const img = new Image();
//     img.src = src;
//     img.onload = () => {
//       loadedCount++;
//       if (loadedCount === totalImages) {
//         imagesLoaded.value = true;
//         fadeInContent();
//       }
//     };
//   });
// };

const preloadVideo = (videoSrc) => {
  const video = document.createElement('video');
  video.src = videoSrc;
  video.oncanplaythrough = () => {
    videoLoaded.value = true;
    fadeInContent();
  };
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
  window.addEventListener('resize', handleResize);
  handleResize(); // Check initial width

  nextTick(() => {
    animateTitle();
    preloadVideo('/assets/tables_video_background.mp4'); // Preload the video
    // preloadImages(duplicatedImages.value); // Comment out image preloading
  });
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
  window.removeEventListener('resize', handleResize);
  document.removeEventListener('mousemove', handleMouseMove);
});
</script>



<template>
  <div v-if="!videoLoaded" class="loading-screen">
    <h1 v-html="splitTitle('Tables.')"></h1>
  </div>
  <div v-show="videoLoaded" class="content">
    <header>
      <transition name="fade">
        <img v-show="showAbout || showContact" :src="TablesLogo" alt="Tables Logo" @click="hideSections" class="header-logo"/>
      </transition>
      <ul class="nav">
        <li @click="toggleAbout">About</li>
        <li @click="toggleContact">Contact</li>
      </ul>
    </header>

    <main>
      <video autoplay loop muted class="video-background">
        <source src="/assets/tables_video_background.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <transition name="fade">
        <img v-show="!(showAbout || showContact)" :src="TablesLogo" alt="Tables Logo" class="logo"/>
      </transition>
      <transition name="fade">
        <div v-if="showAbout" class="displayInfo about-section">
          <p>Tables is a bespoke, conceptual events production company in London, bringing your wildest dreams to life. </p>
        </div>
      </transition>

      <transition name="fade">
        <div v-if="showContact" class="displayInfo contact-section">
          <a href="mailto:info@tables.studio">info@tables.london</a>
          <a href="https://instagram.com" target="_blank">@tables-london</a>
        </div>
      </transition>
      <!-- Commented out image carousel -->
      <!-- <div id="container">
        <div class="scroll">
          <div class="m-scroll">
            <div v-for="(img, index) in duplicatedImages" :key="'img-' + index" class="carousel-item">
              <img :src="img" alt="carousel image" />
            </div>
          </div>
        </div>
      </div> -->
    </main>
    <div v-if="showCursor" class="cursor" :style="{ left: `${cursorX}px`, top: `${cursorY}px` }"></div>
  </div>
</template>

<style scoped>
.loading-screen {
  background-color: var(--text-color);
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.loading-screen h1 {
  color: white;
  font-size: 4rem;
  font-family: 'Koulen';
  letter-spacing: 0.2rem;
}

.content {
  opacity: 0;
  transition: opacity 1s ease;
  height: 100%;
}

header {
  position: absolute;
  top: 0;
  z-index: 2;
  color: var(--text-color);
  padding: 1rem;
  display: flex;
  justify-content: end;
  align-items: center;
  width: calc(100% - 2rem);
}

.header-logo {
  position: absolute;
  top: 2rem;
  left: 2rem;
  width: 15vw;
  max-width: 80px;
  opacity: 1;
  transition: opacity 0.5s ease;
}

.nav {
  list-style: none;
  display: flex;
  gap: 1rem;
}

.nav li {
  text-decoration: none;
  transition: transform 0.3s;
  font-family: 'Koulen';
  font-size: 1.5rem;
  letter-spacing: 0.1rem;
}

.nav li:hover,
.displayInfo a:hover {
  transform: scale(1.1);
  transition: transform 0.3s;
}

.displayInfo {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
  font-size: 2rem;
  z-index: 3;
  color: var(--text-color);
  /* mix-blend-mode: difference; */
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: calc(100% - 4rem);
}

.displayInfo a {
  text-decoration: none;
  color: var(--text-color);
  opacity: 1;
  mix-blend-mode: exclusion;
  cursor: none;
  transition: transform 0.3s;
}

main {
  display: flex;
  justify-content: center;
  position: relative;
}

.video-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 1;
}



.logo {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 40vw;
  max-width: 250px;
  z-index: 2;
  /* mix-blend-mode: difference; */
}

.cursor {
  display: none;
  pointer-events: none;
}

/* Commented out carousel item styles */
/* .carousel-item {
  display: inline-block;
  height: 100%;
  width: 75vw; 
}

.carousel-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: grayscale(100%);
} 

#container {
  width: 100%;
  height: 100%;
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
  height: 100%;
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

*/

.fade-enter-active {
  transition: opacity 1s;
}

.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (min-width: 768px) {
  header {
    width: calc(100% - 4rem);
    padding: 1rem 2rem;
  }

  .nav li {
    font-size: 2rem;
    letter-spacing: 0.2rem;
  }

  .logo {
    font-size: 4rem;
    letter-spacing: 0.2rem;
  }

  .cursor {
    display: block;
    position: absolute;
    height: 30px;
    width: 30px;
    background-color: white;
    border-radius: 50%;
    mix-blend-mode: exclusion;
    opacity: 1;
    pointer-events: none;
    transition: transform 0.1s;
    z-index: 5;
  }

  .displayInfo {
    font-size: 2.5rem;
  }
}
</style>

