const COLLECTION_ID = '01gyqcqn4t4pqjn7jwd9z44qa1'
const APP_ID = 'fbc8dfbe8d14435bba35c906ab9d793b'
import axios from "../plugins/axios";


export default {
    async mintAsset(options) {
        var data = JSON.stringify({
            "tokens": [{
                "name": "Tango 02",
                "asset_name": "Tango01",
                "description": "If you get all tangled up, just tango on.",
                "media_type": "image/png",
                "image": "",
                "metadata_attributes": [{            
                }],
            }]
        });
        
        /*
        var config = {
            method: 'post',
            url: 'https://cardano-testnet.tangocrypto.com/' + APP_ID + '/v1/nft/collections/' + COLLECTION_ID + '/tokens',
            headers: { 
              'x-api-key': '5886e6a5ca624441b8f2f5289f753116', 
              'Content-Type': 'application/json',
            },
            withCredentials: true,
            data : data
          };
          */
         
          
        /*
        axios.get('http://cardano-testnet.tangocrypto.com/fbc8dfbe8d14435bba35c906ab9d793b/v1/blocks/latest', {headers: {'x-api-key': '5886e6a5ca624441b8f2f5289f753116'}})
        .then(response => {
            console.log(response)
            console.log(JSON.stringify(response.data))
        })
        .catch(e => {
            console.log(e)
        })
        */
        axios.post('/badges/mint', {})
        .then(response => {
            console.log(response)
        })
        .catch(e => {
            console.log(e)
        })
    },


    async getAllAssets(options) {
    },

    async sendAsset(options) {
    },
    
    async login() {
    },
    
    async isSignedIn() {

    },
    
    async getAccount() {
        
    },

    logout() {
    }
}
