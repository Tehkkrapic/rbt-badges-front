import algosdk from 'algosdk'; 
import { PeraWalletConnect } from '@perawallet/connect';
import axios from 'axios';

const ALGORAND_KEY = "ALGORAND_ACCOUNT";
const apiKey = import.meta.env.VITE_API_ALG_API_KEY;
const chainId = import.meta.env.VITE_API_CHAIN_ID;

export default {
    async login() {
      const peraWallet = new PeraWalletConnect({chainId: chainId});
      return peraWallet.connect()
      .then((accounts) => {
        if(accounts.length > 0) {
          let accountString = JSON.stringify(accounts[0]);
          window.sessionStorage.removeItem(ALGORAND_KEY);
          window.sessionStorage.setItem(ALGORAND_KEY, accountString);
        }
      })
    },
        
    async isSignedIn() {
        let accountString = window.sessionStorage.getItem(ALGORAND_KEY);
        return accountString ? true : false;
    },
    
    async getAccount() {
        let accountString = window.sessionStorage.getItem(ALGORAND_KEY);
        return JSON.parse(accountString);
    },

    async getAllAssets(options) {
      let client = new algosdk.Algodv2({ 'X-API-Key' : apiKey}, 'https://testnet-algorand.api.purestake.io/ps2', '');
        
      let accountString = window.sessionStorage.getItem(ALGORAND_KEY);
      let account = JSON.parse(accountString);
        
      let assets = await client.accountInformation(account).do();
        
      let createdAssets = assets['created-assets'];
      let assetList = [];
    
      for(let asset of createdAssets) {
          if(options.existingAssets.includes(asset.index)) continue
          console.log("NOVI DETEKTIRAN")

          let params = asset['params'];
          let url = params['url'];
          let metadata = await axios.get(url)
          let badge = 
          {
              'name': metadata.data.name,
              'description': metadata.data.name ? metadata.data.name : '',
              'current_amount': 1,
              'created_amount': 1,
              'image_url': metadata.data.image,
              'properties': JSON.stringify(metadata.data.properties),
              'tokenId': asset.index,
              'local_img_path': metadata.data.local_image ? metadata.data.local_image : null,
              'badge_created_at': metadata.data.created_at ? metadata.data.created_at : null 
          }       
          assetList.push(badge);  
      }
      return assetList;    
    },
      
    logout() {
      return;
    },
    
    async sendAsset(options) {
      const peraWallet = new PeraWalletConnect({chainId: chainId});

      let client = new algosdk.Algodv2({ 'X-API-Key' : apiKey}, 'https://testnet-algorand.api.purestake.io/ps2', '');
      let params = await client.getTransactionParams().do();
  
      let account = await this.getAccount();
      let toAddress = options.to;
      let tokenID = parseInt(options.tokenID);
      
      let sendTxn = algosdk.makeAssetTransferTxnWithSuggestedParams(account, toAddress, undefined, undefined, 1, undefined, tokenID, params, undefined);
      
      const singleTxnGroups = [{txn: sendTxn, signers: [account]}];
      const signedTxn = await peraWallet.signTransaction([singleTxnGroups]);
      const {txId} = await client.sendRawTransaction(signedTxn).do();
    },
    
    async mintAsset(options, badge) {       
      const peraWallet = new PeraWalletConnect({chainId: chainId});

      let client = new algosdk.Algodv2({ 'X-API-Key' : apiKey}, 'https://testnet-algorand.api.purestake.io/ps2', '');
      let account = await this.getAccount();
      const multipleTxnGroups = []
      const txns = []

      for (let index = 0; index < parseInt(badge.created_amount); index++) {
        let params = await client.getTransactionParams().do();
        let unitName = "NFT";
        let assetName = badge.name;
        let assetURL = 'https://gateway.pinata.cloud/ipfs/' + options.responseJson['IpfsHash'];
        let assetMetadataHash = options.assetMetadataHash;
    
        let note = undefined;
        let defaultFrozen = false;
        let decimals = 0;
        let total = 1;

        let mintTxn = algosdk.makeAssetCreateTxnWithSuggestedParams(
          account, 
          note, 
          total, 
          decimals, 
          defaultFrozen, 
          account, 
          account, 
          account, 
          account, 
          unitName, 
          assetName + index, 
          assetURL, 
          assetMetadataHash, 
          params,
        );    
        multipleTxnGroups.push({txn: mintTxn, signers: [account]});
      }
        
      const signedTxn = await peraWallet.signTransaction([multipleTxnGroups]);

      for (const signedTxnGroup of signedTxn) {
        const {txId} = await client.sendRawTransaction(signedTxnGroup).do();
        console.log(txId)
      }
    }
}