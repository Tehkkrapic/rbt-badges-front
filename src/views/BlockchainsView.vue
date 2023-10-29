<script setup>
import { onMounted } from 'vue';
import axios from '../plugins/axios';
import { ref } from 'vue';

const blockchains = ref([])

onMounted(() => {
    axios.get('/api/blockchains')
    .then(response => {
        blockchains.value = response.data.blockchains
    })
    .catch(e => {
        console.log(e)
    })
})
</script>

<template>
    <v-container style="margin-top: 80px;">
        <v-row>
            <v-col>
                <v-card>
                <v-table>
                    <thead>
                    <tr>
                        <th class="text-left">
                        Name
                        </th>
                        <th class="text-right">
                        Actions
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr
                        v-for="blockchain in blockchains"
                        :key="blockchain.name"
                    >
                        <td>{{ blockchain.name }}</td>
                        <td class="text-right">a</td>
                    </tr>                
                    </tbody>
                </v-table>
            </v-card>

            </v-col>
        </v-row>
    </v-container>
</template>