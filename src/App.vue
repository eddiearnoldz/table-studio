<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue';
import gsap from 'gsap'
import TablesLogo from '/assets/logos/tables_logo.svg'
import TablesLogoSingle from '/assets/logos/tables_logo_T.svg'

const videoLoaded = ref(false);


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

onMounted(() => {
  nextTick(() => {
    animateTitle();
    preloadVideo('/assets/tables_video_background(1).webm'); // Preload the video
  });
});

</script>



<template>
  <div v-if="!videoLoaded" class="loading-screen">
    <h1 v-html="splitTitle('Tables.')"></h1>
  </div>
  <div v-show="videoLoaded" class="content">
    <header>
      <transition name="fade">
        <img :src="TablesLogoSingle" alt="Tables Logo" class="header-logo"/>
      </transition>
      <!-- <ul class="nav">
        <li @click="toggleAbout">About</li>
        <li @click="toggleContact">Contact</li>
      </ul> -->
    </header>

    <main>
      <video autoplay loop muted playsinline class="video-background" @canplaythrough="videoLoaded = true">
        <source src="/assets/tables_video_background(1).webm" type="video/webm" />
        Your browser does not support the video tag.
      </video>
      <transition name="fade">
        <img :src="TablesLogo" alt="Tables Logo" class="logo"/>
      </transition>
      <transition name="fade">
        <div class="displayInfo about-section">
          <p class="cormorant-garamond-regular">Welcome to Tables.</p>
          <p class="cormorant-garamond-regular">We’re a dynamic event design and culinary studio reimagining the art of dining experiences. We craft each gathering with thoughtful concepts that transform dinners into distinctive, memorable events.  By uniting luxury hospitality with creative collaborations and impactful design, we produce gastronomic moments that celebrate originality and spark authentic connection. </p>
        </div>
      </transition>
      <transition name="fade">
        <div class="displayInfo contact-section">
          <a class="cormorant-garamond-regular" href="mailto:info@tables.studio">Contact: hello@tableslondon.com</a>
          <a class="cormorant-garamond-regular" href="https://instagram.com" target="_blank">@tables-london</a>
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

.header-logo {
  width: 7vw;
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
  font-size: 1.1rem;
  z-index: 3;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: calc(100% - 4rem);
  color: white;
  opacity: 0.8;
}

.displayInfo:first-of-type {
  margin-top: 5vh
}

.displayInfo a {
  text-decoration: none;
  cursor: pointer;
  transition: transform 0.3s;
  color: white;
}

main {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  padding-top: 25vh;
  padding-bottom: 15vh;
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
    justify-content: flex-end;
    gap: 10vh;
  }

  header {
    width: calc(100% - 4rem);
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

  .displayInfo:first-of-type {
    margin-top: unset;
  }

  .displayInfo {
    /* align-self: flex-end; */
    /* margin-bottom: 100px; */
    width: 30vw;
    justify-content: center;
    /* height: 30vh; */
  }

  .nav li:hover,
  .displayInfo a:hover {
    transform: scale(1.1);
    transition: transform 0.3s;
  }

}
</style>

