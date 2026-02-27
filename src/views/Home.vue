<template>
  <div class="home min-h-screen flex flex-column">
    <Navbar />

    <section class="hero relative">
      <div
        class="overlay text-white flex flex-column align-items-center justify-content-center text-center px-3 md:px-6"
      >
        <h1 class="text-3xl md:text-5xl font-bold mb-3 line-height-3">
          Move better. Feel stronger.
        </h1>

        <p class="text-base md:text-xl font-semibold max-w-30rem mb-4 line-height-3">
          Morgen is a calm, thoughtfully designed space offering Reformer Pilates, Cadillac Pilates, and Yoga.<br><br>
          A modern Pilates and Yoga studio in Jakarta focused on mindful movement and lasting strength.
        </p>

        <Button label="Book a Class" rounded @click="routing('schedule')" />
      </div>
    </section>

    <!-- ABOUT SECTION -->
    <section class="about py-6">
      <div
        class="container grid align-items-center gap-2 pl-1 md:pl-4"
      >
        <!-- Image -->
        <div class="col-12 md:col-6">
          <img
            src="@/assets/home/about.jpg"
            alt="About Morgen Pilates & Yoga Studio"
            class="w-full border-round-lg shadow-2"
          />
        </div>

        <!-- Text -->
        <div class="col-12 md:col-5">
          <h1 class="text-2xl md:text-4xl mb-3">
            About Morgen
          </h1>
          <p class="text-base md:text-lg line-height-3">
            We focus on quality movement, proper alignment, and steady progress. Every session is guided with attention and care, creating a supportive environment for all levels — from beginners to experienced practitioners.<br>
          </p>
          <p class="text-base md:text-lg line-height-3">
            At Morgen, movement is simple, focused, and purposeful.<br>
          </p>
          <span class="text-base md:text-lg line-height-3">Why Morgen?</span>
          <ul class="text-base md:text-lg line-height-3">
            <li>Small class sizes</li>
            <li>Attentive instructors</li>
            <li>Clean, minimal studio environment</li>
            <li>Beginner-friendly options</li>
            <li>Focus on sustainable results</li>
          </ul>
          <Button label="View Classes" rounded @click="routing('course-classes')" />
        </div>
      </div>
    </section>

    <section class="hero2 relative">
      <div class="overlay2">
        <div
          style="opacity: 100%;"
          class="text-white flex flex-column align-items-center justify-content-center text-center px-3 md:px-6"
        >
          <h1 class="text-3xl md:text-5xl font-bold mb-3 line-height-3">
            See Our Beneficial Package
          </h1>

          <p class="text-base md:text-xl max-w-30rem mb-4 line-height-3">
            Start your practice.<br><br>
            Consistency creates change.<br><br>
            Begin your movement journey with us today.
          </p>

          <Button label="View Packages" rounded @click="routing('packages')" />
        </div>
      </div>
    </section>
    <Footer />
  </div>
</template>

<script setup>
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// const bookClass = () => {
//   if (!store.getters.user) {
//     openModal()
//   } else {
//     router.push('/timetable')
//   }
// }

const routing = (routeTo) => {
  router.push(routeTo)
}
</script>

<style lang="scss" scoped>

.hero {
  height: 90vh;
  background-image: url('~@/assets/home/hero.jpg');
  background-size: cover;
  background-position: center;
  position: relative;
}

.hero2 {
  height: 65vh;
  background-image: url('~@/assets/home/hero2.jpg');
  background-size: cover;
  background-position: center;
  position: relative;
}

.overlay {
  position: absolute;
  top: 50%;
  left: 6%;
  transform: translateY(-50%);
  max-width: 620px;
}

.overlay2 {
  background-color: rgba(0, 0, 0, 0.6);
  height: 100%;
}

.hero-btn {
  background-color: white;
  color: $text-color-dark;
  border: none;
  padding: 0.75rem 2.5rem;
  font-weight: 600;
}

.about {
  padding: 6rem 0;
  background-color: #f7efe4;

  .about-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
    align-items: center;
  }

  img {
    width: 100%;
    border-radius: 24px;
  }
}

.classes {
  padding: 6rem 0;
}
</style>
