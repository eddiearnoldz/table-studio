<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue';
import gsap from 'gsap'
import TablesLogo from '/assets/logos/tables_logo.svg'
import TablesLogoSingle from '/assets/logos/tables_logo_T.svg'

const videoLoaded = ref(false);
const videoSrc = ref('');


const splitTitle = (title) => {
  return title.split('').map((letter) => `<span class="name-animation">${letter}</span>`).join('');
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

const preloadVideo = (videoSrc) => {
  const video = document.createElement('video');
  video.src = videoSrc;
  video.oncanplaythrough = () => {
    videoLoaded.value = true;
    fadeInContent();
  };
  video.load();
};



const updateVideoSource = () => {
  const isMobile = window.innerWidth < 768;
  videoSrc.value = isMobile ? '/assets/tables_mobile_background.mp4' : '/assets/tables_background_video.mp4';
  preloadVideo(videoSrc.value);
};

onMounted(() => {
  nextTick(() => {
    animateTitle();
    updateVideoSource();
  });

  window.addEventListener('resize', updateVideoSource);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateVideoSource);
});

</script>



<template>
  <div v-if="!videoLoaded" class="loading-screen">
    <h1 v-html="splitTitle('Tables.')"></h1>
  </div>
  <div v-show="videoLoaded" class="content">
    <transition name="fade">
    <header>
          <img :src="TablesLogoSingle" alt="Tables Logo" class="header-logo"/>
          <p >Welcome to Tables.</p>
        <!-- <ul class="nav">
          <li @click="toggleAbout">About</li>
          <li @click="toggleContact">Contact</li>
        </ul> -->
      </header>
    </transition>

    <main>
      <video autoplay loop muted playsinline class="video-background">
        <source :src="videoSrc" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <transition name="fade">
        <div class="displayInfo about-section">
          <p >We’re a dynamic event design and culinary studio reimagining the art of dining experiences. Blending luxury hospitality with creative collaborations.</p>
        </div>
      </transition>
      <transition name="fade">
        <img :src="TablesLogo" alt="Tables Logo" class="logo"/>
      </transition>
      <transition name="fade">
        <div class="displayInfo contact-section">
          <a href="mailto:hello@tableslondon.com">Contact: hello@tableslondon.com</a>
          <a  href="https://instagram.com/tables.london" target="_blank">@tables.london</a>
        </div>
      </transition>
    </main>
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
  justify-content: start;
  align-items: center;
  width: calc(100% - 2rem);
}

header p{
    font-size: 1.5rem;
    color: white;
    margin-left: 10px;
    margin-top: 12px;
    opacity: 0.8;
}

.header-logo {
  width: 35px;
  max-width: 40px;
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
  opacity: 0.9;
  color: white;
  text-decoration: none;
}

.displayInfo {
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
  font-size: 1.5rem;
  z-index: 3;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: calc(100% - 4rem);
  color: white;
  opacity: 0.8;
}

.displayInfo p {
    font-family: "Inter", sans-serif;
    font-weight: 100;
    font-size: 1.2rem;
}

.displayInfo:first-of-type {
  margin-bottom: 5vh
}

.displayInfo:last-of-type {
  margin-top: 5vh
}

.displayInfo a {
  text-decoration: none;
  cursor: pointer;
  transition: transform 0.3s;
  color: white;
  font-family: "Inter", sans-serif;
  font-weight: 100;
  font-size: 1.2rem;
}

main {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  padding-top: 10vh;
  padding-bottom: 10vh;
  font-family: "Cormorant Garamond", serif;
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
  width: 40vw;
  max-width: 250px;
  z-index: 2;
  pointer-events: none;
}

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

.nav li,
p, img {
  -webkit-touch-callout: none;
    -webkit-user-select: none;
     -khtml-user-select: none;
       -moz-user-select: none; 
        -ms-user-select: none; 
            user-select: none;
}

@media screen and (min-width: 768px) {
  main {
    height: 100vh;
    min-height: 800px;
    padding-top: unset;
    padding-bottom: unset;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
    gap: 10vh;
  }

  header {
    width: calc(100% - 4rem);
  }

  header p{
    margin-top: 6px;
    font-size: 2rem
  }

  .nav li {
    font-size: 1.5rem;
    letter-spacing: 0.2rem;
  }

  .logo {
    position: absolute;
    left:50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }

  .displayInfo {
    width: 30vw;
    justify-content: center;
    margin-top: 5vh;
    text-align: left;
    margin: 10vh 0 5vh;
    padding: 0 2rem;
  }

  .nav li:hover,
  .displayInfo a:hover {
    transform: translateY(5px);
    transition: transform 0.3s;
  }

  .displayInfo:last-of-type {
    margin-top: unset;
    text-align: right;
    padding: 1rem 1.5rem;
  }

}
</style>

