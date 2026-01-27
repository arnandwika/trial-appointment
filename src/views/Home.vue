<template>
  <div class="home min-h-screen flex flex-column">
    <Navbar />

    <section class="fex-1 hero relative">
      <div
        class="overlay text-white flex flex-column align-items-center justify-content-center text-center px-3 md:px-6"
      >
        <h1 class="text-3xl md:text-5xl font-bold mb-3 line-height-3">
          Revitalize and Strenghten Your Body
        </h1>

        <p class="text-base md:text-xl max-w-30rem mb-4 line-height-3">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Minus porro dicta commodi aspernatur, explicabo cumque voluptas quasi enim error eum sed dolorum in asperiores corporis quam fugit recusandae nobis quos.
        </p>

        <Button label="Book a Class" rounded @click="routing('timetable')" />
      </div>
    </section>

    <!-- ABOUT SECTION -->
    <section class="about py-6">
      <div
        class="container grid align-items-center gap-4 px-3 md:px-6"
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
        <div class="col-12 md:col-4">
          <h1 class="text-2xl md:text-4xl mb-3">
            About Morgen Pilates & Yoga Studio
          </h1>
          <p class="text-base md:text-lg line-height-3">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Laborum quam incidunt, reiciendis officia recusandae consequatur molestiae eum pariatur illum, voluptates tempora dolorem reprehenderit! Quibusdam magni natus veniam sit optio unde?
          </p>
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
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Minus porro dicta commodi aspernatur, explicabo cumque voluptas quasi enim error eum sed dolorum in asperiores corporis quam fugit recusandae nobis quos.
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
  max-width: 520px;
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
