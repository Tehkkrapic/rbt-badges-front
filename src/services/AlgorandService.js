import MyAlgoConnect from '@randlabs/myalgo-connect';
import algosdk from 'algosdk'; 
import { PeraWalletConnect } from '@perawallet/connect';
import axios from 'axios';

const myAlgoWallet = new MyAlgoConnect()

const ALGORAND_KEY = "ALGORAND_ACCOUNT";
const token = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
const port = 4001;
const server = "http://localhost";
const apiKey = "Pa10MHJyTj21Wf269Cssk3Gesc9kaOAq8yZpEYhZ";

export default {
    async login() {
      const peraWallet = new PeraWalletConnect({chainId: 416002});
      return peraWallet.connect()
      .then((accounts) => {
        if(accounts.length > 0) {
          let accountString = JSON.stringify(accounts[0]);
          window.sessionStorage.removeItem(ALGORAND_KEY);
          window.sessionStorage.setItem(ALGORAND_KEY, accountString);
        }
      })
        // const accounts = await myAlgoWallet.connect({shouldSelectOneAccount: true, openManager: true});
        // console.log(accounts)
        // if(accounts.length > 0) {
        //     let accountString = JSON.stringify(accounts[0]);
        //     window.sessionStorage.removeItem(this.ALGORAND_KEY);
        //     window.sessionStorage.setItem(this.ALGORAND_KEY, accountString);    
        // }
    },
        
    async isSignedIn() {
        let accountString = window.sessionStorage.getItem(ALGORAND_KEY);
        console.log(accountString)
        return accountString ? true : false;
    },
    
    async getAccount() {
        let accountString = window.sessionStorage.getItem(ALGORAND_KEY);
        return JSON.parse(accountString);
    },

      async getAllAssets() {
        let client = new algosdk.Algodv2({ 'X-API-Key' : apiKey}, 'https://testnet-algorand.api.purestake.io/ps2', '');
        let accountMnemonic = 'soft awful snack vicious town adjust goose thought fuel wish crumble slam alone border width flat able tuition night bright dish carbon destroy about name';        
      
        // if(window['AlgoSigner'] !== 'undefined') {
        //   let AlgoSigner = window['AlgoSigner'];
        //   AlgoSigner.connect()
        //   // finds the TestNet accounts currently in AlgoSigner
        //   .then(() => AlgoSigner.accounts({
        //       ledger: 'TestNet'
        //   }))
        //   .then((accountData) => {
        //       // the accountData object should contain the Algorand addresses from TestNet that AlgoSigner currently knows about
        //       console.log(accountData);
        //   })
        //   .catch((e) => {
        //       // handle errors and perform error cleanup here
        //       console.error(e);
        //   });    
        // } 
    
        let accountString = window.sessionStorage.getItem(ALGORAND_KEY);
        let account = JSON.parse(accountString);
        var recoveredAccount = algosdk.mnemonicToSecretKey(accountMnemonic);
    
        let assets = await client.accountInformation(account).do();
        
        console.log(assets)
        let createdAssets = assets['created-assets'];
        let assetList = [];
    
        for(let asset of createdAssets) {
            let params = asset['params'];
            console.log(params);
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
            }       
            assetList.push(badge);  
        }
  
  
        console.log(assetList)
        return assetList;    
      },
      

      getCurrentAmount(assetId, currentAssets) {
        console.log(currentAssets);
        for(let asset of currentAssets) {
            console.log(asset);
            if(asset['asset-id'] == assetId) {
                return asset['amount'];
            }
        }
      },
    
      logout() {
    
        return;
      },
    
      async sendAsset(options) {
        const peraWallet = new PeraWalletConnect({chainId: 416002});

        let client = new algosdk.Algodv2({ 'X-API-Key' : apiKey}, 'https://testnet-algorand.api.purestake.io/ps2', '');
        let params = await client.getTransactionParams().do();
    
        console.log(options)
        let account = await this.getAccount();
        let toAddress = options.to;
        let tokenID = parseInt(options.tokenID);
        
        let sendTxn = algosdk.makeAssetTransferTxnWithSuggestedParams(account, toAddress, undefined, undefined, 1, undefined, tokenID, params, undefined);
        
        const singleTxnGroups = [{txn: sendTxn, signers: [account]}];
        try {
          const signedTxn = await peraWallet.signTransaction([singleTxnGroups]);
          console.log(signedTxn)
          const {txId} = await client.sendRawTransaction(signedTxn).do();
          return true
          console.log(txId)
        } catch (error) {
          console.log("Couldn't sign Opt-in txns", error);
          return false
        }
        // let toAddress = options.toAddress;
        // let assetId = options.assetId;
        // let account = await this.getAccount();
        // let address = account['address'];
    
        // let params = await client.getTransactionParams().do();
    
        // if(window['AlgoSigner'] !== 'undefined') {
        //   let AlgoSigner = window['AlgoSigner'];
        //   console.log(AlgoSigner);
        //   AlgoSigner.connect()
        //   .then(
        //     AlgoSigner.accounts({ ledger: 'TestNet' })
        //     .then(d => account = d[0].address)
        //     .then(d => {
        //       let txn = algosdk.makeAssetTransferTxnWithSuggestedParams(
        //         account, 
        //         toAddress, 
        //         undefined, 
        //         undefined, 
        //         1, 
        //         undefined, 
        //         assetId, 
        //         params, 
        //         undefined
        //       );
        
        //       let txn_b64 = AlgoSigner.encoding.msgpackToBase64(txn.toByte());
        //       AlgoSigner.signTxn([{txn: txn_b64}])
        //       .then(signedTxs => 
        //         AlgoSigner.send({
        //           ledger: 'TestNet',
        //           tx: signedTxs[0].blob
        //         })
        //       )
        //     })
        //     .catch(e => console.error(e))
        //   )    
        // }
    
        /*
        let toAddress = options.toAddress;
        let assetId = options.assetId;
        let address = account['address'];
    
        let params = await client.getTransactionParams().do();
    
        let txn = algosdk.makeAssetTransferTxnWithSuggestedParams(address, toAddress, undefined, undefined, 1, undefined, assetId, params, undefined);
        let rawSignedTxn = txn.signTxn(recoveredAccount.sk);
        let tx = (await client.sendRawTransaction(rawSignedTxn).do());
    
        let assetID = null;
        console.log("Wait for c");
        const conf = await algosdk.waitForConfirmation(client, tx.txId, 4);
        var end = new Date()
        console.log("Vrijeme završetka " + end)
      */
      },
    
      async mintAsset(options, badge) {       
        const peraWallet = new PeraWalletConnect({chainId: 416002});

        let client = new algosdk.Algodv2({ 'X-API-Key' : apiKey}, 'https://testnet-algorand.api.purestake.io/ps2', '');
        let account = await this.getAccount();
        const multipleTxnGroups = []
        const txns = []

        for (let index = 0; index < parseInt(badge.created_amount); index++) {
          let params = await client.getTransactionParams().do();
          let unitName = "NFT";
          let assetName = badge.name;
          let assetURL = 'https://gateway.pinata.cloud/ipfs/' + options.metaDataResult['IpfsHash'];
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
         
          
       
        try {
          const signedTxn = await peraWallet.signTransaction([multipleTxnGroups]);
 
          for (const signedTxnGroup of signedTxn) {
            const {txId} = await client.sendRawTransaction(signedTxnGroup).do();
            console.log(txId)
          }
        } catch (error) {
          console.log("Couldn't sign Opt-in txns", error);
        }
      }
        /*
        let client = new algosdk.Algodv2(this.token, this.server, this.port);
        let accountMnemonic = 'seminar consider usage crack alley antenna spread city intact milk oxygen lonely deputy company remove celery kiwi salon buddy table hole hollow spider absorb same';        
        var recoveredAccount = algosdk.mnemonicToSecretKey(accountMnemonic);
        console.log(recoveredAccount);
    
        let account = await this.getAccount();
        let toAddress = options.toAddress;
        let assetId = options.assetId;
        let address = account['address'];
        let badge = options.badge;
    
        let params = await client.getTransactionParams().do();
        let note = undefined;
        let defaultFrozen = false;
        let decimals = 0;
        let total = 1;
    
        let unitName = "NFT";
        let assetName = badge.name;
        let assetURL = 'https://gateway.pinata.cloud/ipfs/' + options.metaDataResult['IpfsHash'];
        
        const pathToMetadata = __dirname + '\\metadata.json';
        console.log(pathToMetadata);
            let metadata;
            await fs.readFile(pathToMetadata, (err, data) => {
                if (err) {
                    console.log("EROOR JEBENIII")
                    throw err;
                }
                console.log(data);
                metadata = data;
            });
        */
        
      // let metadata = {
      //     "name": badge.name,
      //     "description": badge.description,
      //     "image": assetURL
      // }
      // let accountMnemonic = 'soft awful snack vicious town adjust goose thought fuel wish crumble slam alone border width flat able tuition night bright dish carbon destroy about name';        
      // var recoveredAccount = algosdk.mnemonicToSecretKey(accountMnemonic);
      // console.log(recoveredAccount)
      
      // let txn = algosdk.makeAssetCreateTxnWithSuggestedParams(
      //   account.address, 
      //   note, 
      //   total, 
      //   decimals, 
      //   defaultFrozen, 
      //   account.address, 
      //   account.address, 
      //   account.address, 
      //   account.address, 
      //   unitName, 
      //   assetName, 
      //   assetURL, 
      //   assetMetadataHash, 
      //   params,
      // );    

      // console.log(txn)
        // let manager = address;
        // let reserve = address;
        // let freeze = address;
        // let clawback = address;
    
        // let txn = algosdk.makeAssetCreateTxnWithSuggestedParams(
        //     address, 
        //     note, 
        //     total, 
        //     decimals, 
        //     defaultFrozen, 
        //     manager, 
        //     reserve, 
        //     freeze, 
        //     clawback, 
        //     unitName, 
        //     assetName, 
        //     assetURL, 
        //     assetMetadataHash, 
        //     params
        // );
        
      
      // try {
      //   console.log(myAlgoWallet)
        
      //   const signedTxn = await myAlgoWallet.signTransaction(txn.toByte());  
      //   const response = await algodClient.sendRawTransaction(signedTxn.blob).do();
      //   console.log(response)
      // } catch(err) {
      //   console.error(err); 
      // }

      
      // await window['algorand'].signTxns([txn])
      // return 
      // let rawSignedTxn = txn.signTxn(recoveredAccount.sk);
      // let tx = (await client.sendRawTransaction(rawSignedTxn).do());
      //       let assetID = null;
      //       console.log("Wait for c");
      //       const conf = await algosdk.waitForConfirmation(client, tx.txId, 4);
      //       var end = new Date()
      //       console.log("Vrijeme završetka " + end)
      //       // Get the new asset's information from the creator account
      //       let info = await client.pendingTransactionInformation(tx.txId).do();
      //       assetID = info["asset-index"];
      //       //Get the completed Transaction
      //       console.log("Transaction " + tx.txId + " confirmed in round " + conf["confirmed-round"]);
            
      //       console.log("AssetID = " + assetID);  
      // }
}