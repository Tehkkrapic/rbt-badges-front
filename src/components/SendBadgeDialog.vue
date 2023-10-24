<script setup>
import { defineProps } from 'vue';
import { defineEmits } from 'vue';
import { ref } from 'vue';
import axios from '../plugins/axios';
import GeneralBlockchainService from '../services/GeneralBlockchainService';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

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
    address.value = null
    loading.value = false
    emit('update:isDialogVisible', false)
}

const handleDialogModelValueUpdate = val => {
    address.value = null
    loading.value = false

    emit('update:isDialogVisible', val)
}

const transferBadge = async () => {
    if(!address.value) return
    loading.value = true
    let value = await GeneralBlockchainService.sendAsset(props.blockchain, {to: address.value, tokenID: props.badgeData.token_id})
    if(value) {
        axios.put('/api/badges/sentToAddress/' + props.badgeData.id, {sent_to_address: address.value})
        .then(res => {
            emit('update:sentToAddress', {sent_to_address: address.value, id: props.badgeData.id})
            loading.value = false
            toast("Badge sent successfully. It might take a while for it to be processed. Refresh after a while.", {autoClose: 2000, type: 'success'})
            closeDialog()
        })
        .catch(e => {
            loading.value = false
            closeDialog()
        })
    } else {
        loading.value = false
        closeDialog()
    }
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