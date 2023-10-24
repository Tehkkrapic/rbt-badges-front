<script setup>
import { defineProps } from 'vue';
import { defineEmits } from 'vue';
import { ref } from 'vue';
import axios from '../plugins/axios';
import { nextTick } from 'process';
import GeneralBlockchainService from '../services/GeneralBlockchainService';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

const props = defineProps({
    isDialogVisible: {
        type: Boolean,
        required: true
    },
    currentBlockchain: {
        type: Object,
        required: true
    }
})

const emit = defineEmits(['update:isDialogVisible'])

const addProprerty = () => {
    properties.value.push({key: '', value: ''})
}

const removeProprerty = (index) => {
    properties.value.splice(index, 1)
}
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

const nameRules = [
    v => !!v || 'Name is required',
    v => (v && v.length <= 20) || 'Name must be less than 20 characters',
]

const descRules = [
    v => !!v || 'Description is required',
    v => (v && v.length <= 256) || 'Description must be less than 256 characters',
]

const amountRules = [
    v => !!v || 'Amount is required',
    v => (v && v < 20) || 'Amount must be less than 20',
]


const imageRules = [
    v => !!v || 'Image is required',
]

const properties = ref([])
const refForm = ref(null)
const name = ref('')
const description = ref('')
const created_amount = ref(1)
const image = ref(null)
const loading = ref(false)

const createBadge = () => {
    loading.value = true
    let badge = {
        'name': name.value,
        'description': description.value,
        'created_amount': created_amount.value,
        'image': image.value[0],
        'blockchain_id': props.currentBlockchain.id,
        'properties': JSON.stringify(properties.value)
    }
    axios.post('/api/badges', badge, {headers: {'Content-Type': 'multipart/form-data'}})
    .then(async response => {
        console.log(response)
        GeneralBlockchainService.mintAsset(props.currentBlockchain, response.data, badge)
    .then(res => {
        toast("Badge created successfully. It might take a while for it to be processed. Refresh after a while.", {autoClose: 2000, type: 'success'})
        loading.value = false
        closeDialog();
    });
    })
    .catch(e => {
        console.log(e)
        loading.value = false
    })
}

/*
const t = () => {
    FileUtils.writeFile('./images/', file.name, file.data).then(() => {
        PinataUtils.pinFile(file.name).then(result => {
                console.log(result);
                var metaData = {
                    "name": body['name'],
                    "description": body['description'],
                    "image": "https://gateway.pinata.cloud/ipfs/" + result['IpfsHash'],
                    "properties": properties
                }
                console.log(metaData);
                FileUtils.writeFile('./metadata/', FileUtils.getFileNameWithoutExtension(file.name) + '_metadata.json', JSON.stringify(metaData)).then(() => {
                    let metadata = undefined;
                    PinataUtils.pinMetadata(file.name, metaData).then(metaDataResult => {
                        console.log(metaDataResult);
                        fs.readFile('./metadata/' + FileUtils.getFileNameWithoutExtension(file.name) + '_metadata.json', (err, data) => {
                            if (err) {
                                throw err;
                            }
                            console.log(data);
                            metadata = data;
                            const hash = crypto.createHash('sha256');
                            hash.update(metadata);
                            let assetMetadataHash = new Uint8Array(hash.digest());
                            res.send({
                                metaData: metaData,
                                metaDataResult: metaDataResult,
                                assetMetadataHash: assetMetadataHash
                            });
                        });
                    });            
                });                
            });
}

*/
const isValid = ref(false)
const onSubmit = () => {
    refForm.value
    .validate()
    .then(r => {
        if(r.valid) {
            createBadge()
        }           
    })
}
</script>

<template>
    <v-dialog :model-value="props.isDialogVisible"
                max-width="800"
                @update:model-value="handleDialogModelValueUpdate"
    >
        <v-card :title="'Create new badge for ' + currentBlockchain.name">
            <VCardText class="mt-2">
                <v-form v-model="isValid" ref="refForm"  @submit.prevent="onSubmit">
                    <v-row>
                        <v-card-subtitle>Basic Information</v-card-subtitle>
                        <v-col cols="12" class="pb-0">
                            <v-text-field v-model="name" variant="underlined" label="Name" :rules="nameRules" class="mb-2" :disabled="loading"></v-text-field>
                            <v-textarea v-model="description" no-resize variant="underlined" label="Description" :rules="descRules" class="mb-2" :disabled="loading"></v-textarea>
                            <v-text-field v-model="created_amount" variant="underlined" type="number" label="Amount" :rules="amountRules" :disabled="loading"></v-text-field>
                            <v-file-input prepend-icon="" v-model="image" append-icon="mdi-image" :rules="imageRules" label="Media" variant="underlined" :disabled="loading"></v-file-input>
                        </v-col>

                        <v-col cols="12" class="ms-0">
                            <v-btn color="grey" block prepend-icon="mdi-plus" @click="addProprerty()" :disabled="loading">
                                Add property
                            </v-btn>
                        </v-col>
                    
                        <template v-for="(property, index) in properties">
                            <v-col cols="5" class="mb-0 pb-0">
                                <v-text-field density="compact" label="Key" v-model="property.key" variant="underlined" :disabled="loading"></v-text-field>
                            </v-col>                   
                            <v-col cols="5" class="mb-0 pb-0">      
                                <v-text-field density="compact" label="Value" v-model="property.value" variant="underlined" :disabled="loading"></v-text-field>
                            </v-col>      
                            <v-col cols="2" class="mb-0" align="center">  
                                <v-btn size="x-small" color="red" icon="mdi-delete"  @click="removeProprerty(index)" :disabled="loading"></v-btn>   
                            </v-col>
                        </template>
                    </v-row>
                    
            <VRow align="center" justify="center" class="mt-4 mb-4 gap-4">
                <v-progress-linear v-if="loading" indeterminate="" color="blue-lighten-3"></v-progress-linear>
                <v-btn type="submit" class="mr-3" color="blue" variant="elevated" :disabled="loading">
                   Create
                </v-btn>
                <v-btn class="ma-2" variant="elevated" @click="closeDialog" :disabled="loading">
                   Close
                </v-btn>
            </VRow>
                </v-form>
            </VCardText>

        </v-card>
    </v-dialog>
</template>

<style>
</style>