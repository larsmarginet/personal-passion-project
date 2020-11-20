<template>
    <v-container>
        <v-row>
            <v-col cols="12" md="3" order-md="2" offset-md="12">
                <v-row justify="end" justify-md="start" class="px-4">
                    <v-btn href="/venue/events/create" depressed color="primary">Add event</v-btn>
                </v-row>
            </v-col>
            <v-col cols="12" md="9" order-md="1">
                <v-card class="pa-4" rounded="lg" hover>
                    <v-card-title>
                        <v-avatar size="48" >
                            <img class="rounded-avatar" src="https://firebasestorage.googleapis.com/v0/b/concery-292c2.appspot.com/o/logos%2Fdivided.jpg?alt=media&token=9ff6f63a-7eb2-4eae-b1bd-19b64b96f0ca" alt="divided"/>
                        </v-avatar>
                        <span class="ml-5 headline font-weight-bold">Divided</span>   
                        <v-spacer></v-spacer>
                        <v-menu offset-y left>
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn icon v-bind="attrs" v-on="on" >
                                    <v-icon color="grey--text">more_vert</v-icon>
                                </v-btn>
                            </template>
                            <v-list>
                                <v-list-item link>
                                    <v-icon class="mr-2">create</v-icon>
                                    <v-list-item-title>update</v-list-item-title>
                                </v-list-item>
                                <v-list-item link>
                                    <v-icon class="mr-2">delete</v-icon>
                                    <v-list-item-title>delete</v-list-item-title>
                                </v-list-item>
                            </v-list>
                        </v-menu>
                    </v-card-title>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
export default {
    mounted() {
        this.$store.dispatch('setLoadingComponent', false)
    }
}
</script>

<style scoped>
.rounded-avatar {
    border-radius: 50%;
}
</style>