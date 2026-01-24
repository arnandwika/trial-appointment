<template>
  <div class="home">
    <Navbar />

    <section class="hero relative">
      <div
        class="overlay text-white flex flex-column align-items-center justify-content-center text-center px-3 md:px-6"
      >
        <h1 class="text-3xl md:text-5xl font-bold mb-3 line-height-3">
          Strength, Balance, and Grace<br />
          in Every Movement
        </h1>

        <p class="text-base md:text-xl max-w-30rem mb-4 line-height-3">
          Transform your body and mind with expert-led Pilates sessions
          designed for all levels. Build core strength, improve
          flexibility, and move with confidence in a calm and supportive
          space.
        </p>

        <Button label="Book a Class" rounded />
      </div>
    </section>

    <!-- ABOUT SECTION -->
    <section class="about py-6">
      <div
        class="container grid align-items-center gap-4 px-3 md:px-6"
      >
        <!-- Image -->
        <div class="col-12 md:col-5">
          <img
            src="@/assets/about.jpg"
            alt="About Morgen Pilates & Yoga Studio"
            class="w-full border-round-lg shadow-2"
          />
        </div>

        <!-- Text -->
        <div class="col-12 md:col-6">
          <h1 class="text-2xl md:text-4xl mb-3">
            About Morgen Pilates & Yoga Studio
          </h1>
          <p class="text-base md:text-lg line-height-3">
            ...
          </p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import Navbar from '@/components/Navbar.vue'
</script>

<style lang="scss" scoped>

.hero {
  height: 100vh;
  background-image: url('~@/assets/hero.jpg');
  background-size: cover;
  background-position: center;
  position: relative;
}

.overlay {
  position: absolute;
  top: 50%;
  left: 6%;
  transform: translateY(-50%);
  max-width: 520px;
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
