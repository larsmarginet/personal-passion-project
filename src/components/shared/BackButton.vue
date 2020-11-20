<template>
    <router-link :to="link" class="grey--text text--darken-2 back-btn">
        <v-icon small>arrow_back_ios</v-icon>
        <span>back</span>
    </router-link>
</template>

<script>
export default {
    props: {
        link: {
            required: true,
            type: String
        }
    }
}
</script>

<style scoped>
.back-btn {
  text-decoration: none;
  display: flex;
  align-items: center;
}

.back-btn:hover {
  font-weight: bold;
}

.back-btn:hover .v-icon {
  animation: arrow 800ms ease-in-out infinite;
}

@keyframes arrow {
  0% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(-3px);
  }
  100% {
    transform: translateX(0);
  }
}
</style>