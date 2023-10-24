<script setup>
import { defineProps } from 'vue';
import { defineEmits } from 'vue';
const props = defineProps({
    isDialogVisible: {
        type: Boolean,
        required: true
    },
    badgeData: {
        type: Object, 
        required: true
    }
})

const emit = defineEmits(['update:isDialogVisible'])

const closeDialog = () => {
    emit('update:isDialogVisible', false)
}

const handleDialogModelValueUpdate = val => {
  emit('update:isDialogVisible', val)
}

</script>

<template>
    <v-dialog :model-value="props.isDialogVisible"
                width="800"
                @update:model-value="handleDialogModelValueUpdate"
    >
        <v-card :title="props.badgeData.name">
                <v-img
                    class="mt-3"
                    height="400"
                    :src="props.badgeData.img_path"
                    cover
                />
            <VDivider></VDivider>
            <VCardText>
                <VRow>                    
                    <VCol cols="12">
                        <p class="text-h6 text-medium-emphasis">Id </p>
                        {{ props.badgeData.token_id }}
                    </VCol>       
                    <VCol cols="12">
                        <p class="text-h6 text-medium-emphasis">Description </p>
                        {{ props.badgeData.description }}
                    </VCol>       
                    <VCol cols="12">
                        <p class="text-h6 text-medium-emphasis">Original address </p>
                        {{ props.badgeData.original_address }}
                    </VCol>
                    <VCol cols="12">
                        <p class="text-h6 text-medium-emphasis">Sent to address </p>
                        {{ props.badgeData.sent_to_address ? props.badgeData.sent_to_address : "None" }}
                    </VCol>
                    <VCol cols="12">
                        <p class="text-h6 text-medium-emphasis">Properties</p>
                        <div class="d-flex flex-column" v-for="property in props.badgeData.properties">
                            <div><b>{{ property.key }}</b></div>
                            <div>{{ property.value }}</div>
                        </div>
                    </VCol>
                </VRow>
            </VCardText>
            <v-btn class="ma-4" variant="elevated" @click="closeDialog">
                Close
            </v-btn>
        </v-card>
    </v-dialog>
</template>