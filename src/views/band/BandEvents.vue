<template>
    <v-container>
        <h2>Events page for bands</h2>
        <v-sheet height="500" width="100%" color="primary">

        </v-sheet>
    </v-container>
</template>

<script>
export default {
    mounted() {
        this.$store.dispatch('setLoadingComponent', false)
    }
}
</script>