<template>
    <h2>Merchandise page for bands</h2>
</template>

<script>
export default {
    mounted() {
        this.$store.dispatch('setLoadingComponent', false)
    }
}
</script>