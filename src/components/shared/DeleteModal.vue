<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="350">
      <v-card class="pb-2">
        <v-card-title class="headline">
          Are you sure you want to delete this?
        </v-card-title>
        <v-card-text>This action will remove this permanently!</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn aria-label="cancel" color="primary" depressed @click="cancel">Cancel</v-btn>
          <v-btn aria-label="continue" color="primary" text @click="agree">Continue</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
export default {
    props: {
        dialog: {
            required: true,
            type: Boolean
        }
    },
    methods: {
        cancel() {
            this.$emit('cancel');
        },
        agree() {
            this.$emit('continue');
        }
    }
}
</script>