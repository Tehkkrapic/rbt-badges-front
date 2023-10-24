import { defineStore } from 'pinia'

export const useBlockchainStore = defineStore('blockchain', {
    state: () => ({ selectedBlockchain: 'ETHEREUM'}),
    getters: {
        getSelectedBlockchain() {
            return this.selectedBlockchain;
        }
    },
    actions: {
        setSelectedBlockchain(val) {
            this.selectedBlockchain = val
        },
    },
    persist: true
})
