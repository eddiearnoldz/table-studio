<script setup>
import { onMounted } from 'vue'
import { urlFor } from '@/services/sanity'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

defineProps({
  events: {
    type: Array,
    required: true,
  },
})

const emit = defineEmits(['open-event'])

onMounted(() => {
  const cards = document.querySelectorAll('.event-card')

  cards.forEach((card, i) => {
    gsap.set(card, { opacity: 0, y: 40 })

    ScrollTrigger.create({
      trigger: card,
      start: 'top 90%',
      once: true,
      onEnter: () => {
        gsap.to(card, {
          opacity: 1,
          y: 0,
          duration: 0.4,

          ease: 'power2.out',
        })
      },
    })
  })
})

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

const getImageUrl = (image) => {
  return urlFor(image).width(800).height(600).fit('crop').auto('format').url()
}
</script>

<template>
  <div class="events-grid">
    <article
      v-for="event in events"
      :key="event._id"
      class="event-card"
      @click="emit('open-event', event)"
    >
      <div class="event-image-wrapper">
        <img
          :src="getImageUrl(event.coverImage)"
          :alt="event.title"
          class="event-image"
          loading="lazy"
        />
        <div class="event-overlay">
          <span class="view-gallery">View Gallery</span>
        </div>
      </div>
      <div class="event-info">
        <h2>{{ event.title }}</h2>
        <time :datetime="event.date">{{ formatDate(event.date) }}</time>
      </div>
    </article>
  </div>
</template>

<style scoped>
.events-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;
  max-width: 1400px;
  margin: 0 auto;
}

.event-card {
  cursor: pointer;
  transition: transform 0.3s ease;
}

.event-card:hover {
  transform: translateY(-8px);
}

.event-image-wrapper {
  position: relative;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  border-radius: 4px;
  background-color: rgba(255, 255, 255, 0.05);
}

.event-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.event-card:hover .event-image {
  transform: scale(1.05);
}

.event-overlay {
  position: absolute;
  inset: 0;
  background: rgba(14, 13, 13, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.event-card:hover .event-overlay {
  opacity: 1;
}

.view-gallery {
  color: white;
  font-family: "Inter", sans-serif;
  font-size: 0.9rem;
  font-weight: 300;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 0.8rem 1.5rem;
  border: 1px solid white;
  border-radius: 2px;
}

.event-info {
  color: white;
}

.event-info h2 {
  font-family: "Cormorant Garamond", serif;
  font-size: 1.8rem;
  font-weight: 400;
  margin-bottom: 0.5rem;
}

.event-info time {
  font-family: "Inter", sans-serif;
  font-size: 0.95rem;
  font-weight: 200;
  opacity: 0.7;
}

@media screen and (min-width: 640px) {
  .events-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 4rem 3rem;
  }
}

@media screen and (min-width: 1200px) {
  .events-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
