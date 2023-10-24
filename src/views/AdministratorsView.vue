<script setup>
import { onMounted } from 'vue';
import axios from '../plugins/axios';
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

const authStore = useAuthStore()
const users = ref([])
const isVerifyDialogOpen = ref(false)
const idForVerify = ref()
const savingVerify = ref(false)

const isDeleteDialogOpen = ref(false)
const idForDelete = ref()
const savingDelete = ref(false)

const isCurrentUser = (user) => {
    return authStore.currentUser && user.id === authStore.getCurrentUser.id
}

const isDeleteAllowed = (user) => {
    return isCurrentUser(user) || !user.email_verified_at
}

const verifyUser = () => {
    savingVerify.value = true
    axios.post('/api/verify/' + idForVerify.value, {})
        .then(res => {
            console.log(res)
            toast.success(res.data.message)
            isVerifyDialogOpen.value = false
            savingVerify.value = false
            getUsers()
        })
        .catch(e => {
            console.log(e)
            toast.error(e.response.data.message)
            isVerifyDialogOpen.value = false
            savingVerify.value = false
        })
}

const deleteUser = () => {
    savingDelete.value = true
    axios.delete('/api/users/' + idForDelete.value)
        .then(res => {
            toast.success(res.data.message)
            isDeleteDialogOpen.value = false
            savingDelete.value = false
            getUsers()
        })
        .catch(e => {
            toast.error(e.response.data.message)
            isDeleteDialogOpen.value = false
            savingDelete.value = false
        })
}

const getUsers = () => {
    axios.get('/api/users')
    .then(response => {
        users.value = response.data.users
    })
    .catch(e => {
        console.log(e)
    })
}

onMounted(() => {
    getUsers()
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
                                <th class="text-left font-weight-bold">
                                    Email
                                </th>
                                <th class="text-right font-weight-bold pr-10">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="admin in users" :key="admin.name">
                                <td>{{ admin.email }} 
                                    <v-chip class="my-2 ml-4" :color="admin.email_verified_at ? 'blue' : 'error'">
                                        {{ admin.email_verified_at ? 'Verified' : 'Unverified' }}
                                    </v-chip>
                                </td>
                                <td class="text-right">
                                    <v-btn v-if="!admin.email_verified_at" :disabled="savingVerify" variant="plain" icon="mdi-check" @click="isVerifyDialogOpen=true; idForVerify=admin.id">
                                    </v-btn>
                                    <v-btn v-if="isDeleteAllowed(admin)" :disabled="savingDelete" variant="plain" icon="mdi-trash-can" @click="isDeleteDialogOpen=true; idForDelete=admin.id">
                                    </v-btn>                                    
                                </td>
                            </tr>
                        </tbody>
                    </v-table>
                </v-card>

            </v-col>
        </v-row>
    </v-container>

    <v-dialog
        v-model="isVerifyDialogOpen"
        width="auto"
      >
        <v-card>
            <v-card-text>
                <h3>Are you sure you want to verify this user?</h3>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn variant="tonal" color="gray" @click="isVerifyDialogOpen = false">Cancel</v-btn>
                <v-btn variant="tonal" color="blue" @click="verifyUser()">Save</v-btn>
            </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog
        v-model="isDeleteDialogOpen"
        width="auto"
      >
        <v-card>
            <v-card-text>
                <h3>Are you sure you want to delete this user?</h3>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn variant="tonal" color="gray" @click="isDeleteDialogOpen = false">Cancel</v-btn>
                <v-btn variant="tonal" color="blue" @click="deleteUser()">Save</v-btn>
            </v-card-actions>
        </v-card>
      </v-dialog>
</template>