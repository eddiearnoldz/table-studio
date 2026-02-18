<script setup>
import { ref, onMounted } from 'vue'
import { client, queries } from '@/services/sanity'
import EventsGrid from '@/components/EventsGrid.vue'
import EventLightbox from '@/components/EventLightbox.vue'
import gsap from 'gsap'

const events = ref([])
const pageTitle = ref('Events')
const pageDescription = ref('Explore our curated dining experiences')
const loading = ref(true)
const selectedEvent = ref(null)

const fetchEvents = async () => {
  try {
    const [eventsData, pageData] = await Promise.all([
      client.fetch(queries.allEvents),
      client.fetch(queries.eventsPage),
    ])
    events.value = eventsData || []
    if (pageData) {
      pageTitle.value = pageData.title || pageTitle.value
      pageDescription.value = pageData.description || pageDescription.value
    }
  } catch (error) {
    console.error('Error fetching events:', error)
  } finally {
    loading.value = false
  }
}

const openLightbox = (event) => {
  selectedEvent.value = event
  document.body.style.overflow = 'hidden'
}

const closeLightbox = () => {
  selectedEvent.value = null
  document.body.style.overflow = ''
}

onMounted(async () => {
  await fetchEvents()
  gsap.to('.events-content', { opacity: 1, duration: 0.8 })
})
</script>

<template>
  <div class="events-content">
    <div class="events-header">
      <h1>{{ pageTitle }}</h1>
      <p>{{ pageDescription }}</p>
    </div>

    <div v-if="loading" class="loading">
      <p>Loading events...</p>
    </div>

    <EventsGrid
      v-else-if="events.length > 0"
      :events="events"
      @open-event="openLightbox"
    />

    <div v-else class="no-events">
      <p>No events available at the moment.</p>
    </div>

    <EventLightbox
      v-if="selectedEvent"
      :event="selectedEvent"
      @close="closeLightbox"
    />
  </div>
</template>

<style scoped>
.events-content {
  opacity: 0;
  min-height: 100vh;
  padding: 8rem 2rem 4rem;
  background-color: rgb(14, 13, 13);
}

.events-header {
  text-align: center;
  margin-bottom: 4rem;
  color: white;
}

.events-header h1 {
  font-family: "Cormorant Garamond", serif;
  font-size: 3rem;
  font-weight: 300;
  margin-bottom: 1rem;
  letter-spacing: 0.05em;
}

.events-header p {
  font-family: "Inter", sans-serif;
  font-size: 1.1rem;
  font-weight: 200;
  opacity: 0.7;
}

.loading,
.no-events {
  text-align: center;
  padding: 4rem 2rem;
  color: white;
  font-family: "Inter", sans-serif;
  font-weight: 200;
  opacity: 0.7;
}

@media screen and (min-width: 768px) {
  .events-content {
    padding: 10rem 4rem 6rem;
  }

  .events-header h1 {
    font-size: 4rem;
  }

  .events-header p {
    font-size: 1.3rem;
  }
}
</style>
