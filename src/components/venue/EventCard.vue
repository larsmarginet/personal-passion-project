<template>
    <v-card class="pa-4 mb-4" rounded="lg" flat>
        <v-card-title>
            <v-avatar size="48" :color="`${event.bandLogoUrl ? 'primary' : 'error'}`">
                <img class="rounded-avatar" :src="event.bandLogoUrl" :alt="event.bandName" v-if="event.bandLogoUrl"/>
                <v-icon v-else large dark>error</v-icon>
            </v-avatar>
            <span class="ml-5 headline font-weight-bold">{{event.bandName}}</span>   
            <v-spacer></v-spacer>
            <v-menu offset-y left>
                <template v-slot:activator="{ on, attrs }">
                    <v-btn icon v-bind="attrs" v-on="on" >
                        <v-icon color="grey--text">more_vert</v-icon>
                    </v-btn>
                </template>
                <v-list>
                    <v-list-item :to="`venue/events/${event.id}`">
                        <v-icon class="mr-2">create</v-icon>
                        <v-list-item-title>update</v-list-item-title>
                    </v-list-item>
                    <v-list-item link @click="handleRemoveEvent">
                        <v-icon class="mr-2">delete</v-icon>
                        <v-list-item-title>delete</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>
        </v-card-title>
        <v-card-text>
            <v-row justify="start">
                <p>{{convertStart(event.start)}}<span class="mx-1">-</span></p>
                <p>{{convertEnd(event.start, event.end)}}</p>
            </v-row>
        </v-card-text>
    </v-card>
</template>

<script>
import format from 'date-fns/format'
export default {
    props: {
        event: {
            required: true,
            type: Object
        }
    },
    methods: {
        convertStart(time) {
            const currentDate = new Date();
            const currentTimeStamp = currentDate.getTime();
            if (currentTimeStamp + 86400000 > time && currentTimeStamp < time) {
                // if event was one day before now
                return `Tomorrow ${format(time, 'kk:mm')}`;
            } else if (currentTimeStamp - 86400000 < time && currentTimeStamp > time) {
                // if event was one day after now
                return `Yesterday ${format(time, 'kk:mm')}`;
            } else {
                return format(time, 'iii dd/LL kk:mm');
            }
        },
        convertEnd(start, end) {
            if (format(start, 'dd/LL') === format(end, 'dd/LL')) {
                return format(end, 'kk:mm');
            } else {
                return format(end, 'iii dd/LL kk:mm')
            }
        }, 
        handleRemoveEvent() {

        }
    },
}
</script>