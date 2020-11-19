<template>
  <div class="home">
    <VenueEvents v-if="user && user.type === 'venue'"/>
    <BandEvents v-else-if="user && user.type === 'band'"/>
    <p v-else>Oops... something went wrong</p>
  </div>
</template>

<script>
import VenueEvents from './venue/VenueEvents'
import BandEvents from './band/BandEvents'
export default {
  name: 'Home',
  components: {
    VenueEvents,
    BandEvents
  },
  computed: {
    user() {
      return this.$store.getters.user
    }
  }
}
</script>
