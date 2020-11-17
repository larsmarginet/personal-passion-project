<template>
  <v-app style="background: #F2F2F2">
    <TheHeader />
    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
import TheHeader from './components/TheHeader'
export default {
  name: 'App',
  components: {
    TheHeader
  }
};
</script>
