<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import { urlFor } from '@/services/sanity'
import gsap from 'gsap'

const props = defineProps({
  event: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['close'])

const currentIndex = ref(0)
const imageRef = ref(null)
const direction = ref(1)

// Touch/swipe state
const touchStartX = ref(0)
const touchStartY = ref(0)
const touchDeltaX = ref(0)
const isSwiping = ref(false)

const images = computed(() => {
  const gallery = props.event.gallery || []
  return [props.event.coverImage, ...gallery]
})

const getImageUrl = (index) => {
  return urlFor(images.value[index])
    .width(1920)
    .height(1280)
    .fit('max')
    .auto('format')
    .url()
}

const currentImageUrl = computed(() => getImageUrl(currentIndex.value))

// Preload adjacent images
const preloadImage = (index) => {
  if (index >= 0 && index < images.value.length) {
    const img = new Image()
    img.src = getImageUrl(index)
  }
}

watch(currentIndex, (i) => {
  preloadImage(i + 1)
  preloadImage(i - 1)
}, { immediate: true })

const canGoPrev = computed(() => currentIndex.value > 0)
const canGoNext = computed(() => currentIndex.value < images.value.length - 1)

const navigate = (dir) => {
  if (dir === -1 && !canGoPrev.value) return
  if (dir === 1 && !canGoNext.value) return
  direction.value = dir
  currentIndex.value += dir
}

const goToPrev = () => navigate(-1)
const goToNext = () => navigate(1)

const handleKeydown = (e) => {
  if (e.key === 'Escape') emit('close')
  if (e.key === 'ArrowLeft') goToPrev()
  if (e.key === 'ArrowRight') goToNext()
}

// Touch handlers
const onTouchStart = (e) => {
  touchStartX.value = e.touches[0].clientX
  touchStartY.value = e.touches[0].clientY
  touchDeltaX.value = 0
  isSwiping.value = false
}

const onTouchMove = (e) => {
  const deltaX = e.touches[0].clientX - touchStartX.value
  const deltaY = e.touches[0].clientY - touchStartY.value

  // Only treat as swipe if mostly horizontal
  if (!isSwiping.value && Math.abs(deltaX) > 10 && Math.abs(deltaX) > Math.abs(deltaY)) {
    isSwiping.value = true
  }

  if (isSwiping.value) {
    e.preventDefault()
    touchDeltaX.value = deltaX

    // Live drag feedback on the image
    if (imageRef.value) {
      gsap.set(imageRef.value, {
        x: deltaX * 0.4,
        opacity: 1 - Math.abs(deltaX) / 800,
      })
    }
  }
}

const onTouchEnd = () => {
  if (!isSwiping.value) return

  const threshold = 60

  if (touchDeltaX.value < -threshold && canGoNext.value) {
    goToNext()
  } else if (touchDeltaX.value > threshold && canGoPrev.value) {
    goToPrev()
  } else {
    // Snap back
    if (imageRef.value) {
      gsap.to(imageRef.value, { x: 0, opacity: 1, duration: 0.3, ease: 'power2.out' })
    }
  }

  touchDeltaX.value = 0
  isSwiping.value = false
}

// Trackpad swipe (wheel events)
let wheelAccum = 0
let wheelTimeout = null
const onWheel = (e) => {
  e.preventDefault()
  wheelAccum += e.deltaX

  clearTimeout(wheelTimeout)
  wheelTimeout = setTimeout(() => {
    if (wheelAccum > 50) goToNext()
    else if (wheelAccum < -50) goToPrev()
    wheelAccum = 0
  }, 20)
}

// Animate image on index change
watch(currentIndex, async () => {
  await nextTick()
  if (imageRef.value) {
    gsap.fromTo(imageRef.value,
      { opacity: 0, x: direction.value * 40, scale: 0.98 },
      { opacity: 1, x: 0, scale: 1, duration: 0.2, ease: 'power2.out' }
    )
  }
})

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)

  // Entry animation
  gsap.fromTo('.lightbox-overlay',
    { opacity: 0 },
    { opacity: 1, duration: 0.4, ease: 'power2.out' }
  )
  gsap.fromTo('.lightbox-title',
    { opacity: 0, x: -10 },
    { opacity: 1, x: 0, duration: 0.5, delay: 0.15, ease: 'power2.out' }
  )
  gsap.fromTo('.lightbox-date',
    { opacity: 0, y: 10 },
    { opacity: 1, y: 0, duration: 0.5, delay: 0.2, ease: 'power2.out' }
  )
  if (imageRef.value) {
    gsap.fromTo(imageRef.value,
      { opacity: 0, scale: 0.9 },
      { opacity: 1, scale: 1, duration: 0.6, delay: 0.1, ease: 'power3.out' }
    )
  }
  gsap.fromTo('.lightbox-footer',
    { opacity: 0, y: 10 },
    { opacity: 1, y: 0, duration: 0.4, delay: 0.25, ease: 'power2.out' }
  )
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <div
    class="lightbox-overlay"
    @click.self="emit('close')"
    @touchstart="onTouchStart"
    @touchmove="onTouchMove"
    @touchend="onTouchEnd"
    @wheel.prevent="onWheel"
  >
    <button class="close-btn" @click="emit('close')" aria-label="Close gallery">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    </button>

    <h2 class="lightbox-title">{{ event.title }}</h2>
    <time class="lightbox-date" :datetime="event.date">{{ formatDate(event.date) }}</time>

    <div class="image-stage">
      <button
        v-if="canGoPrev"
        class="nav-btn prev-btn"
        @click="goToPrev"
        aria-label="Previous image"
      >
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
          <path d="M15 4 L8 12 L15 20" />
        </svg>
      </button>

      <img
        ref="imageRef"
        :key="currentIndex"
        :src="currentImageUrl"
        :alt="`${event.title} - Image ${currentIndex + 1}`"
        class="lightbox-image"
        draggable="false"
      />

      <button
        v-if="canGoNext"
        class="nav-btn next-btn"
        @click="goToNext"
        aria-label="Next image"
      >
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
          <path d="M9 4 L16 12 L9 20" />
        </svg>
      </button>
    </div>

    <div class="lightbox-footer">
      <div class="dot-indicators">
        <button
          v-for="(_, i) in images"
          :key="i"
          class="dot"
          :class="{ active: i === currentIndex }"
          @click="direction = i > currentIndex ? 1 : -1; currentIndex = i"
          :aria-label="`Go to image ${i + 1}`"
        />
      </div>
      <span class="image-counter">{{ currentIndex + 1 }} / {{ images.length }}</span>
    </div>
  </div>
</template>

<style scoped>
.lightbox-overlay {
  position: fixed;
  inset: 0;
  background: rgb(0, 0, 0);
  z-index: 1000;
  opacity: 0;
  user-select: none;
  -webkit-user-select: none;
}

.image-stage {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.lightbox-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  will-change: transform, opacity;
}

.lightbox-title {
  position: absolute;
  top: 1rem;
  left: 0.75rem;
  z-index: 5;
  color: white;
  font-family: "Cormorant Garamond", serif;
  font-size: 1.5rem;
  font-weight: 300;
  letter-spacing: 0.04em;
  margin: 0;
  word-spacing: 100vw;
  line-height: 1.4;
  text-shadow: 0 1px 8px rgba(0, 0, 0, 0.8), 0 0 20px rgba(0, 0, 0, 0.5);
}

.lightbox-date {
  position: absolute;
  bottom: 1.5rem;
  left: 0.75rem;
  z-index: 5;
  color: white;
  font-family: "Cormorant Garamond", serif;
  font-size: 1.25rem;
  font-weight: 300;
  letter-spacing: 0.04em;
  text-shadow: 0 1px 8px rgba(0, 0, 0, 0.8), 0 0 20px rgba(0, 0, 0, 0.5);
}

.close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(0, 0, 0, 0.4);
  border: none;
  border-radius: 50%;
  color: white;
  cursor: pointer;
  padding: 0.75rem;
  opacity: 0.8;
  transition: opacity 0.3s, transform 0.3s;
  z-index: 10;
}

.close-btn:hover {
  opacity: 1;
  transform: rotate(90deg);
}

.nav-btn {
  position: absolute;
  background: transparent;
  border: none;
  color: white;
  cursor: pointer;
  padding: 0.5rem;
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 5;
}

.lightbox-overlay:hover .nav-btn {
  opacity: 0.4;
}

.nav-btn:hover {
  opacity: 0.9 !important;
}

.prev-btn {
  left: 1rem;
}

.next-btn {
  right: 1rem;
}

.lightbox-footer {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 5;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 3rem 1rem 1.5rem;
}

.dot-indicators {
  display: flex;
  gap: 0.5rem;
}

.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.25);
  cursor: pointer;
  padding: 0;
  transition: all 0.3s ease;
}

.dot.active {
  background: white;
  transform: scale(1.3);
}

.dot:hover:not(.active) {
  background: rgba(255, 255, 255, 0.5);
}

.image-counter {
  color: white;
  font-family: "Inter", sans-serif;
  font-size: 0.75rem;
  font-weight: 200;
  opacity: 0.4;
}

@media screen and (min-width: 768px) {
  .close-btn {
    top: 1.5rem;
    right: 1.5rem;
  }

  .prev-btn {
    left: 1.5rem;
  }

  .next-btn {
    right: 1.5rem;
  }
}

</style>
