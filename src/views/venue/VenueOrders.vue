<template>
    <h2>orders</h2>
</template>

<script>
export default {
     mounted() {
        this.$store.dispatch('setLoadingComponent', false);
        this.$store.dispatch('events/loadEventsForVenue');
    }
}
</script>