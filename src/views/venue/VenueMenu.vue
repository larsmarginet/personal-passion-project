<template>
    <h2>Food &amp; drinks page for venues</h2>
</template>

<script>
export default {
    mounted() {
        this.$store.dispatch('setLoadingComponent', false)
    }
}
</script>