<template>
    <v-container>
        <h2 hidden>Room detail</h2>
        <v-row>
            <v-col cols="6" md="1" order-md="1">
                <BackButton link="/venue/rooms"/>
            </v-col>
            <v-col cols="6" sm="4" md="2" order-md="3">
                <v-row justify="end" justify-md="start" class="px-4">
                    <v-btn :disabled="save" depressed color="primary" @click="handleAddRoom" :loading="loadingAddRoom">save</v-btn>
                </v-row>
            </v-col>
            <v-col cols="12" sm="10" md="8" lg="6" order-md="1">
                <v-card flat class="mx-auto mb-10" rounded="xl" v-if="loadingRoom">
                    <v-skeleton-loader type="list-item" style="maxWidth: 250px" ></v-skeleton-loader>
                    <v-skeleton-loader type="list-item" style="maxWidth: 150px" class="mb-4  pb-5"></v-skeleton-loader>
                </v-card>
                <v-card flat class="mx-auto pb-8 mb-10" rounded="xl" width="100%" v-else>
                    <v-expand-transition>
                        <Alert @dismissed="onDismissed" :text="error" v-if="error"/>
                    </v-expand-transition>
                    <v-form @submit.prevent ref="form" class="px-4 pt-2 px-md-5 pt-md-3 pb-5">
                        <v-text-field validate-on-blur class="mx-2" @change="checkIfUpdated" style="maxWidth: 250px" v-model="name" label="Name" :rules="nameRules" clearable></v-text-field>
                        <v-row align="center" class="mx-2">
                            <v-btn color="primary" depressed @click="decrementBubbles(); checkIfUpdated();" fab small><v-icon small>remove</v-icon></v-btn>
                            <v-text-field class="px-2 text-center" @change="checkIfUpdated" style="maxWidth: 60px" label="Bubbles" type="number" min="0" v-model="bubbles" :rules="quantityRules"></v-text-field>
                            <v-btn color="primary" depressed @click="incrementBubbles(); checkIfUpdated();" fab small><v-icon small>add</v-icon></v-btn>
                        </v-row>
                    </v-form>
                    <v-row justify="end" no-gutters class="mx-6">
                        <v-btn @click="generateQrCodes" depressed color="primary">generate codes</v-btn>
                        <v-btn @click="dowloadAllQrCodes" text depressed color="primary" v-if="qrcodes.length > 0"><v-icon>get_app</v-icon> download all</v-btn>
                    </v-row>
                    <transition-group name="list">
                        <v-card v-for="code in qrcodes" :key="code" flat>
                            <v-card-title class="ma-2">
                                <img :src="code.toDataURL()" alt="QRCode" style="maxWidth: 60px" class="img-border" />
                                <span class="primary--text ml-2">Table {{i+1}}</span>
                                <v-spacer></v-spacer>
                                <v-btn :href="code.toDataURL()" text :download="`qrcode-${i+1}`" color="primary" fab><v-icon>get_app</v-icon></v-btn>
                            </v-card-title>
                            <v-divider></v-divider>
                        </v-card>
                    </transition-group>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import QRious from 'qrious';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { nameRules, quantityRules } from '../../helpers/validationRules';
import BackButton from '../../components/shared/BackButton';
import Alert from '../../components/shared/Alert';
export default {
    components: {
        BackButton,
        Alert,
    },
    props: {
        id: {
            required: false,
            type: String
        }
    },
    data() {
        return {
            save: false,
            name: '',
            bubbles: 0,
            nameRules,
            quantityRules,
            qrcodes: [],
        }
    },
    computed: {
        currentRoom() {
            return this.$store.getters['rooms/currentRoom'];
        },
        loadingRoom() {
            return this.$store.getters['rooms/LoadingRoom'];
        },
        loadingAddRoom() {
            return this.$store.getters['rooms/loadingAddRoom'];
        },
        error() {
            return this.$store.getters['rooms/error'];
        }
    },
    methods: {
        checkIfUpdated() {
            if (this.id && this.currentRoom && ( this.name !== this.currentRoom.name || this.bubbles !== this.currentRoom.bubbles )) {
                this.save = false;
            }
        },
        decrementBubbles() {
            if (this.bubbles <= 0) {
                this.bubbles = 0;
            } else {
                this.bubbles--;
            }
        },
        incrementBubbles() {
            this.bubbles++;
        },
        generateQrCodes() {
            if (this.bubbles > 0) {
                for (let i = 1; i <= this.bubbles; i++) {
                    const qrCode = new QRious({ size: 300, value: `http://localhost:8080/?roomId=${this.id}&bubble=${i}` });
                    this.qrcodes.push(qrCode);
                }
            }
        },
        dowloadAllQrCodes() {
            const zip = new JSZip();
            this.qrcodes.forEach((code, i) => {
                const img = code.toDataURL();
                zip.file(`qrcode-${i+1}.png`, img.split('base64,')[1], { base64: true });
            });
            zip.generateAsync({ type: 'blob' }).then((content) => {
                saveAs(content, 'Qrcodes.zip');
            });
        },
        onDismissed() {
            this.$store.dispatch('rooms/clearError');
        },
        handleAddRoom() {
            if (this.$refs.form.validate()) {
                const roomObj = {
                    name: this.name,
                    bubbles: this.bubbles
                };
                if (this.id) {
                    this.$store.dispatch('rooms/updateRoom', {
                        id: this.id,
                        ...roomObj
                    });
                } else {
                    this.$store.dispatch('rooms/addRoom', roomObj);
                }
            }
        },
    },
    async mounted() {
        this.$store.dispatch('setLoadingComponent', false);
        if (this.id) {
            this.save = true;
            await this.$store.dispatch('rooms/getRoomById', this.id);
            const currentRoom = this.$store.getters['rooms/currentRoom'];
            this.name = currentRoom.name;
            this.bubbles = currentRoom.bubbles;
        }
    }
}
</script>
<style scoped>
.img-border {
    border: 3px solid #6fcf97;
    border-radius: 5px;
}

.list-enter {
    opacity: 0;
    transform: translateY(-30px);
}

.list-enter-active {
    transition: all 500ms ease-out;
}

.list-enter-to {
    opacity: 1;
    transform: translateY(0);
}

.list-leave{
    opacity: 1;
    transform: translateY(0);
}

.list-leave-active {
    transition: all 500ms ease-in;
}

.list-leave-to {
    opacity: 0;
    transform: translateY(30px);
}
</style>
