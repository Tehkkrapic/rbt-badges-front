<script setup>
import NearService from '../services/NearService'
import AlgorandService from '../services/AlgorandService'
import EthereumService from '../services/EthereumService'
import GeneralBlockchainService from '../services/GeneralBlockchainService'
import { ref } from 'vue'
import axios from '../plugins/axios'
import { onMounted } from 'vue'

const blockchains = ref([
  {
    title: 'Ethereum',
    value: 'ETHEREUM'
  }
])

const selectedBlockchain = ref(blockchains.value[0])

onMounted(() => {
  axios.get('blockchains')
  .then(response => {
    blockchains.value = response.data.blockchains
    selectedBlockchain.value = response.data.blockchains[0]
  })
  .catch(e => {
    console.log(e)
  })
})

const formDummy = ref({
  name: 'TestName',
  description: 'Desc',
  created_amount: 1,
  image: null,
  blockchain_id: null
})

/*
const isLoggedIn = async () => {
  console.log(await NearService.isSignedIn())
}

const getAccount = async () => {
  console.log(await NearService.getAccount())
}

const login = async () => {
  await NearService.login()
}

const logout = async () => {
  await NearService.logout()
}

const getAssets = async () => {
  console.log(await NearService.getAllAssets())
}
*/

/*
const isLoggedIn = async () => {
  console.log(await AlgorandService.isSignedIn())
}

const getAccount = async () => {
  console.log(await AlgorandService.getAccount())
}

const login = async () => {
  await AlgorandService.login()
}

const logout = async () => {
  await AlgorandService.logout()
}

const getAssets = async () => {
  console.log(await AlgorandService.getAllAssets())
}
*/

const isLoggedIn = async () => {
  console.log(await EthereumService.isSignedIn())
}

const getAccount = async () => {
  console.log(await EthereumService.getAccount())
}

const login = () => {
  GeneralBlockchainService.login('ETHEREUM') 
}

const logout = async () => {
  await EthereumService.logout()
}

const getAssets = async () => {
  console.log(await EthereumService.getAllAssets())
}



const mint = () => {
  uploadFile()
}

const uploadFile = () => {
  formDummy.value.image = formDummy.value.image ? formDummy.value.image[0] : null;
  console.log(selectedBlockchain.value)
  formDummy.value.blockchain_id = selectedBlockchain.value.id

  axios.post('/badge', formDummy.value, {headers: {'Content-Type': 'multipart/form-data'}})
  .then(response => {
    console.log(response)
  })
  .catch(e => {
    console.log(e)
  })
}

</script>

<template>
  <main class="mt-8">
    <v-btn @click="isLoggedIn" color="primary" class="ma-4">
      Is logged in
    </v-btn>
    <v-btn @click="getAccount" color="primary" class="ma-4">
      Get Account
    </v-btn>
    <v-btn @click="login" color="primary" class="ma-4">
      Login
    </v-btn>
    <v-btn @click="logout" color="primary" class="ma-4">
      Logout
    </v-btn>
    <v-btn @click="getAssets" color="primary" class="ma-4">
      getAssets
    </v-btn>   
    <v-btn @click="mint" color="primary" class="ma-4">
      mint
    </v-btn>
    
    <v-file-input v-model="formDummy.image" label="File input"></v-file-input>
  </main>
</template>
