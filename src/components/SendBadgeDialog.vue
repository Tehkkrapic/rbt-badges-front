<script setup>
import { defineProps } from 'vue';
import { defineEmits } from 'vue';
import { ref } from 'vue';
import axios from '../plugins/axios';
import GeneralBlockchainService from '../services/GeneralBlockchainService';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import { nextTick } from 'process';

const props = defineProps({
    isDialogVisible: {
        type: Boolean,
        required: true
    },
    badgeData: {
        type: Object, 
        required: true
    },
    blockchain: {
        type: Object,
        required: true
    }
})

const refForm = ref()
const loading = ref(false)
const address = ref()
const emit = defineEmits(['update:isDialogVisible', 'update:sentToAddress'])

const closeDialog = () => {
    emit('update:isDialogVisible', false)
    nextTick(() => {
        refForm.value.reset()
        refForm.value.resetValidation()
    })
}

const handleDialogModelValueUpdate = val => {
    emit('update:isDialogVisible', val)
    nextTick(() => {
        refForm.value.reset()
        refForm.value.resetValidation()
    })
}

const transferBadge = async () => {
    loading.value = true

    GeneralBlockchainService.sendAsset(props.blockchain, {to: address.value, tokenID: props.badgeData.token_id})
    .then(res => {
        axios.put('/api/badges/sentToAddress/' + props.badgeData.id, {sent_to_address: address.value})
        .then(res => {
            emit('update:sentToAddress', {sent_to_address: address.value, id: props.badgeData.id})
            loading.value = false
            toast("Badge sent successfully. It might take a while for it to be processed. Refresh after a while.", {autoClose: 2000, type: 'success'})
            closeDialog()
        })
        .catch(e => {
            console.log(e)
            toast("An error has occured while sending the asset", {autoClose: 2000, type: 'error'})
            loading.value = false
            closeDialog()
        })
    })
    .catch(e => {
        console.log(e)
        loading.value = false
        toast("An error has occured while sending the asset", {autoClose: 2000, type: 'error'})   
        closeDialog() 
    })
}

const addressRules = [
    v => !!v || 'Address is required',
]

const onSubmit = () => {
    refForm.value
    .validate()
    .then(r => {
        if(r.valid) {
            transferBadge()
        }           
    })
}

</script>

<template>
    <v-dialog :model-value="props.isDialogVisible"
                width="800"
                @update:model-value="handleDialogModelValueUpdate"
    >
        <v-card :title="props.badgeData.name">
        <VCardText>
            <v-form ref="refForm"  @submit.prevent="onSubmit">
                <span class="text-subtitle-2">
                    Please enter a wallet address
                </span>
                <v-text-field variant="underlined" label="Address" v-model="address" :disabled="loading" :rules="addressRules">
                </v-text-field>
                <v-progress-linear
                    v-if="loading"
                    color="blue-lighten-3"
                    indeterminate
                    :size="128"
                    :width="12"
                ></v-progress-linear>
                    
                <v-col align="end">
                    <v-btn variant="elevated" @click="closeDialog" :disabled="loading">
                        Close
                    </v-btn>
                    <v-btn color="blue" class="ml-4" variant="elevated" type="submit" :disabled="loading">
                        Send
                    </v-btn>
                </v-col>   
            </v-form>
        </VCardText>
           
        </v-card>
    </v-dialog>
</template>