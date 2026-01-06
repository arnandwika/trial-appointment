<template>
  <div class="home">
    <Navbar />

    <section class="hero">
      <div class="overlay text-color-light">
        <h1 class="">
          Strength, Balance, and Grace<br />
          in Every Movement
        </h1>

        <p>
          Transform your body and mind with expert-led Pilates
          sessions designed for all levels. Build core strength,
          improve flexibility, and move with confidence in a calm
          and supportive space.
        </p>

        <Button
          label="Book a Class"
          rounded
        />
      </div>
    </section>
    <section class="about">
      <div class="container about-grid">
        <img src="@/assets/about.jpg" alt="About Yoo-Na Pilates" />
        <div class="about-content">
          <h1>About Morgan Pilates</h1>
          <p>...</p>
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