<template>
    <v-container class="grey darken-3 mt-n4 ml-n4 rounded-br-xl mb-6 px-8" v-if="setList">
        <v-row no-gutters>
            <v-col cols="3" sm="2" class="player" v-if="previousSong">
                <p class="white--text body-1 font-weight-light mb-0 mr-sm-2 text-right overflow" style="width: 100%">{{previousSong.title}}</p>
            </v-col>
            <v-col cols="1" class="btn">
                <v-btn aria-label="previous" fab small text @click="handlePreviousSong" class="mx-auto">
                    <v-icon class="white--text">skip_previous</v-icon>
                </v-btn>
            </v-col>
            <v-col cols="3" sm="2">
                <p class="white--text text-center mb-0 body-1 font-weight-bold mt-2 overflow">{{currentSong ? currentSong.title : 'Playing nothing'}}</p>
            </v-col>
            <v-col cols="1" class="btn">
                <v-btn aria-label="next" fab small text @click="handleNextSong">
                    <v-icon class="white--text">skip_next</v-icon>
                </v-btn>
            </v-col>
            <v-col cols="3" sm="2" class="player" v-if="nextSong">
                <p class="white--text mb-0 body-1 font-weight-light ml-sm-2 overflow" >{{nextSong.title}}</p>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
export default {
    props: {
        id: {
            required: true,
            type: String
        }
    },
    computed: {
        setList() {
            return this.$store.getters['events/setList'];
        },
        currentSong() {
            return this.$store.getters['events/currentSong'];
        },
        previousSong() {
            if (this.currentSong) {
                const index = this.setList.findIndex(song => this.currentSong.id === song.id);
                if (index === 0) {
                    return this.setList[this.setList.length - 1];
                } else {
                    return this.setList[index - 1];
                }
            } else {
                return this.setList[this.setList.length - 1];
            }
        },
        nextSong() {
            if (this.currentSong) {
                const index = this.setList.findIndex(song => this.currentSong.id === song.id);
                if (index + 1 >= this.setList.length) {
                    return this.setList[0];
                } else {
                    return this.setList[index + 1];
                }
            } else {
                return this.setList[0];
            }
        }
    },
    methods: {
        handlePreviousSong() {
            if (this.currentSong) {
                const index = this.setList.findIndex(song => this.currentSong.id === song.id)
                if (index === 0) {
                    this.$store.dispatch('events/setCurrentSong', {id: this.id, song: this.setList[this.setList.length - 1]});
                    } else {
                    this.$store.dispatch('events/setCurrentSong', {id: this.id, song: this.setList[index - 1]});
                }
            } else {
                this.$store.dispatch('events/setCurrentSong', {id: this.id, song: this.setList[this.setList.length - 1]});
            }
        }, 
        handleNextSong() {
            if (this.currentSong) {
                const index = this.setList.findIndex(song => this.currentSong.id === song.id);
                if (index + 1 < this.setList.length) {
                    this.$store.dispatch('events/setCurrentSong', {id: this.id, song: this.setList[index + 1]});
                } else {
                    this.$store.dispatch('events/setCurrentSong', {id: this.id, song: this.setList[0]});
                }
            } else {
                this.$store.dispatch('events/setCurrentSong', {id: this.id, song: this.setList[0]});
            }
        }
    },
    mounted() {
        this.$store.dispatch('events/loadSeltList', this.id);
        this.$store.dispatch('events/loadCurrentSong', this.id);
    }
}
</script>

<style scoped>
    .player {
        display: flex;
        align-items: center;
    }

    .overflow {
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
    }
    .btn {
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>