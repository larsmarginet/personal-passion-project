<template>
  <v-app style="background: #F2F2F2">
    <TheHeader />
    <v-main class="ma-4">
      <transition name="fade" mode="out-in" 
        v-on:before-enter="beforeEnter"
        v-on:enter="enter"
        v-on:after-enter="afterEnter"
        v-on:enter-cancelled="enterCancelled">
        <router-view></router-view>
      </transition>
    </v-main>
  </v-app>
</template>

<script>
import TheHeader from './components/TheHeader'
export default {
  name: 'App',
  components: {
    TheHeader
  }, 
  methods: {
    beforeEnter() {
      console.log('beforeEnter')
    },
    enter() {
      console.log('enter')
    },
    afterEnter() {
      console.log('afterEnter')
    },
    enterCancelled() {
      console.log('enterCancelled')
    },
  }
};
</script>

<style>
.fade-enter {
  opacity: 0;
  transform: translateY(-30px);
}

.fade-enter-active {
  transition: all 300ms ease-out;
}

.fade-enter-to {
  opacity: 1;
  transform: translateY(0);
}

.fade-leave {
  opacity: 1;
  transform: translateY(0);
}

.fade-leave-active {
  transition: all 300ms ease-in;
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

</style>