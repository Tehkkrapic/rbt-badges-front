<script setup>
import { onMounted } from 'vue';
import axios from '../plugins/axios';
import { ref } from 'vue';
import { useDisplay } from 'vuetify'
import BadgeDetailsDialog from '../components/BadgeDetailsDialog.vue';
import SendBadgeDialog from '../components/SendBadgeDialog.vue';
import CreateBadgeDialog from '../components/CreateBadgeDialog.vue';
import { watch } from 'vue';
import GeneralBlockchainService from '../services/GeneralBlockchainService'
import { useRoute } from 'vue-router';
import router from '../router';
const route = useRoute()

const display = useDisplay()
const badges = ref([])
const blockchains = ref([])

const selectedBlockchain = ref(null)
const loading = ref(false)

const isDetailsDialogVisible = ref(false)
const detailsData = ref(null) 
const isSendDialogVisible = ref(false)
const dataForSend = ref(null)
const isCreateDialogVisible = ref(false)    
const isWalletConnected = ref(false)

const currentPage = ref()
const totalPages = ref()

onMounted(() => {
    loading.value=true
    axios.get('/api/blockchains')
    .then(async response => {
        blockchains.value = response.data.blockchains
        selectedBlockchain.value = route.query.blockchain ?  blockchains.value.filter((el) => {return el.code === route.query.blockchain})[0] : blockchains.value[0]
        getBadges(selectedBlockchain.value) 
    })
    .catch(e => {
        loading.value=false
    })
})

const refreshBadges = async () => {
    loading.value = true;
    let account = await GeneralBlockchainService.getAccount(selectedBlockchain.value)
    let assets = await GeneralBlockchainService.getAllAssets(selectedBlockchain.value)
    console.log(assets)
    axios.post('/api/badges/refresh?page=' + currentPage.value, {'blockchain_id': selectedBlockchain.value.id, 'assets': assets, 'original_address': account})
    .then(response => {
        console.log(response)
        console.log(badges.value)
        badges.value = response.data.badges.data
        badges.value.forEach((element) => element.properties = JSON.parse(element.properties))
        totalPages.value = response.data.badges.last_page
        loading.value = false
    })    
    .catch(e => {
        console.log(e)
        loading.value = false
    })
}

const connect = async () => {
    await GeneralBlockchainService.login(selectedBlockchain.value)
    let isSignedIn = await GeneralBlockchainService.isSignedIn(selectedBlockchain.value)
    console.log(isSignedIn)
    isWalletConnected.value = isSignedIn
    getBadges()
}

const getBadges = async () => {
    let isSignedIn = await GeneralBlockchainService.isSignedIn(selectedBlockchain.value)
    isWalletConnected.value = isSignedIn
    loading.value=true
    axios.get('/api/badges/' + selectedBlockchain.value.id + '?page=' + currentPage.value) 
    .then(response => {
        console.log(response)
        badges.value = response.data.badges.data
        badges.value.forEach((element) => element.properties = JSON.parse(element.properties))
        totalPages.value = response.data.badges.last_page
        loading.value=false
    })
    .catch(e => {
        console.log(e)    
        loading.value=false
    })
}

const updateSentToAddress = (val) => {
    badges.value.forEach(element => {
        if(element.id === val.id) {
            element.sent_to_address = val.sent_to_address
        }
    });
}
//let api = await window.cardano.nami.enable()
//console.log(api)
//console.log(await api.getUsedAddresses())
watch(selectedBlockchain, async (newVal, oldVal) => {
    console.log(selectedBlockchain.value)
    if(!oldVal) return
    console.log(newVal)
    router.push({name: 'badgeGrid', query: {blockchain: newVal.code}})
})


watch(currentPage, (newVal, oldVal) => {
    getBadges()
})


watch(route, async (newVal, oldVal) => {
    if(!newVal.query.blockchain) return 
    currentPage.value = 1
    getBadges({code: newVal.query.blockchain})

// // //    if(newVal.code === 'CARDANO') GeneralBlockchainService.mintAsset(newVal, {})
})

</script>

<template>
    <v-container fluid class="fill-height" v-if="loading">
        <v-row class="justify-center align-center">

        <v-progress-circular
            color="blue-lighten-3"
            indeterminate
            :size="128"
            :width="12"
        ></v-progress-circular>
        </v-row>
    </v-container>

    <v-container style="margin-top: 80px;" v-else-if="selectedBlockchain && !isWalletConnected">
        <v-row class="justify-center align-center" style="width: 100%;">
            <v-col cols="12" md="6" lg="6" xs="12" sm="6">
                <v-btn v-if="isWalletConnected" prepend-icon="mdi-plus" color="blue" :block="display.xs.value" @click="isCreateDialogVisible=true">Create new badge</v-btn>
            </v-col>
            <v-col cols="12" lg="6" md="6" xs="12" sm="6" align="right">
                <v-select :style="{width: display.xs.value ? '100%' : '300px'}" :class="{'mt-6': display.smAndUp.value}" variant="solo" 
                :items="blockchains" item-title="name" item-value="id" v-model="selectedBlockchain" return-object></v-select>
            </v-col>
        </v-row>
        <v-row style="margin-top: 15%;">
            <v-col cols="12" class="text-center">
                <p>Please connect to your {{ selectedBlockchain.name }} wallet!</p><br>
                <v-btn color="blue" @click="connect">Connect</v-btn>
            </v-col>
        </v-row>
    </v-container>

    <v-container style="margin-top: 80px;" v-else>
        <v-row class="justify-center align-center">
            <v-col cols="12" md="6" lg="6" xs="12" sm="12">
                <v-btn prepend-icon="mdi-plus" color="blue" :block="display.smAndDown.value" @click="isCreateDialogVisible=true">Create new badge</v-btn>
            </v-col>
            <v-col cols="12" lg="5" md="5" xs="11" sm="12" align="right">
                <v-select :style="{width: display.smAndDown.value ? '100%' : '300px'}" :class="{'mt-6': display.smAndUp.value}" variant="solo" 
                :items="blockchains" item-title="name" item-value="id" v-model="selectedBlockchain" return-object></v-select>                
            </v-col>
            <v-col cols="12" lg="1" md="1" sm="12" xs="12">
                <V-btn icon="mdi-refresh" @click="refreshBadges"></V-btn>
            </v-col>
        </v-row>
        <v-row>
            <v-col v-for="badge in badges" :key="badge" class="d-flex child-flex" cols="12" xs="12" sm="12" md="6" lg="3">
                <div class="container"> 
                    <v-img :src="badge.img_path" aspect-ratio="1" cover
                        class="bg-grey-lighten-2 image" @click="isDetailsDialogVisible=true; detailsData=badge">
                        <template v-slot:placeholder>
                            <v-row class="fill-height ma-0" align="center" justify="center">
                                <v-progress-circular indeterminate color="grey-lighten-5"></v-progress-circular>
                            </v-row>
                        </template>
                    </v-img>
                    <v-btn v-if="!badge.sent_to_address" class="btn" color="blue" icon="mdi-send" @click="isSendDialogVisible=true; dataForSend=badge">
                    </v-btn>
                    <div class="overlay" @click="isDetailsDialogVisible=true; detailsData=badge">
                        <div class="text">{{ badge.name }}</div>
                    </div>           
                </div>
            </v-col>
        </v-row>
        <v-pagination
            v-model="currentPage"
            class="my-4"
            :length="totalPages"
        ></v-pagination>
    </v-container>

    <CreateBadgeDialog v-model:is-dialog-visible="isCreateDialogVisible" :current-blockchain="selectedBlockchain"></CreateBadgeDialog>
    <SendBadgeDialog v-if="dataForSend" v-model:is-dialog-visible="isSendDialogVisible" :badge-data="dataForSend" :blockchain="selectedBlockchain" @update:sentToAddress="updateSentToAddress"></SendBadgeDialog>
    <BadgeDetailsDialog v-if="detailsData" v-model:is-dialog-visible="isDetailsDialogVisible" :badge-data="detailsData"></BadgeDetailsDialog>
</template>

<style>
.container {
  position: relative;
  width: 100%;
}

.image {
  display: block;
  width: 100%;
  height: auto;
}

.container .btn {
    position: absolute;
    top: 5px;
    right: 5px;
    color: white;
    font-size: 16px;
    padding: 12px 24px;
    text-align: center;
    opacity: 0;
}

.overlay {
  position: absolute;
  top: 340;
  bottom: 0;
  left: 0;
  right: 0;
  height: 15%;
  width: 100%;
  opacity: 0;
  transition: .5s ease;
  background-color: lightgray;
}

.container:hover .overlay {
  opacity: 0.8;
}

.container:hover .btn {
  opacity: 1;
}

.text {
  color: black;
  font-size: 20px;
  position: absolute;
  top: 50%;
  left: 50%;
  -webkit-transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  text-align: center;
}
</style>