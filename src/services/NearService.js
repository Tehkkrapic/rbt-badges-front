import * as nearAPI from 'near-api-js';
import { utils } from 'near-api-js';
const { connect } = nearAPI;
const { keyStores } = nearAPI;
const { Contract } = nearAPI;
import BN from 'bn.js';
import axios from 'axios';

export default {
    async mintAsset(options, badge) {
      const contractId = 'karloriteh.testnet';    
      const { keyStores } = nearAPI;
      const myKeyStore = new keyStores.BrowserLocalStorageKeyStore();
      const networkId = 'karloriteh.testnet';
  
      const connectionConfig = {
        networkId: networkId,
        keyStore: myKeyStore, // first create a key store 
        nodeUrl: "https://rpc.testnet.near.org",
        walletUrl: "https://wallet.testnet.near.org",
        helperUrl: "https://helper.testnet.near.org",
        explorerUrl: "https://explorer.testnet.near.org",
      };
      
      let nearConnection = await connect(connectionConfig);
      const walletConnection = new nearAPI.WalletConnection(nearConnection, 'riteh-badge-app');
      let account = walletConnection.account();
        
        console.log(options);
        
        const contract = new Contract(
            account, // the account object that is connecting
            "karloriteh.testnet",
            {
                viewMethods: ["getMessages"], // view methods do not change state but usually return a value
                changeMethods: ["addMessage"], // change methods modify state
            }
        );
    
        let assetList = await this.getAllAssets();
        let maxAssetId = Math.max(...assetList.map(o => parseInt(o['tokenId'])));
        console.log(options);
        
        console.log(badge.created_amount)
        let metadata = {
            account_id:account.accountId,
            token_id: (maxAssetId + 1).toString(),
            receiver_id: account.accountId,
            token_metadata: {
                title: badge.name,
                description: badge.description,
                media: options['metaDataResult']['IpfsHas'],
                copies: 1
            }
        }
      
        let promises = []
        for (let index = 0; index < badge.created_amount; index++) {
          let metadata = {
            account_id:account.accountId,
            token_id: (maxAssetId + index + 1).toString(),
            receiver_id: account.accountId,
            token_metadata: {
                title: badge.name,
                description: badge.description,
                media: "https://gateway.pinata.cloud/ipfs/" + options['responseFile']['IpfsHash'],
                copies: 1,
                reference: "https://gateway.pinata.cloud/ipfs/" + options['metaDataResult']['IpfsHash']
            }
        }
      
          promises.push(account.functionCall({contractId: contract.contractId, methodName: "nft_mint", args: metadata, attachedDeposit: new BN("6000000000000000000000")}))
        }
        return Promise.allSettled(promises)
        .then(() => {
          return true
        })
        .catch(() => {
          return false
        })
      },
    
      async getAllAssets() {
        const contractId = 'karloriteh.testnet';    
        const { keyStores } = nearAPI;
        const myKeyStore = new keyStores.BrowserLocalStorageKeyStore();
        const networkId = 'karloriteh.testnet';
    
        const connectionConfig = {
          networkId: networkId,
          keyStore: myKeyStore, // first create a key store 
          nodeUrl: "https://rpc.testnet.near.org",
          walletUrl: "https://wallet.testnet.near.org",
          helperUrl: "https://helper.testnet.near.org",
          explorerUrl: "https://explorer.testnet.near.org",
        };
        
        let nearConnection = await connect(connectionConfig);
        const walletConnection = new nearAPI.WalletConnection(nearConnection, 'riteh-badge-app');
        let account = walletConnection.account();
 
        console.log(account)
        const messages = await account.viewFunction({contractId: contractId, methodName: "nft_tokens_for_owner", args: {account_id: account.accountId}});
        console.log(messages);
        let assetList = [];
        for(let asset of messages) {
          let metadata = asset['metadata']['reference'] ? await axios.get(asset['metadata']['reference']) : null
          console.log(metadata)
          let badge = 
          {
              'name': asset['metadata']['title'],
              'description': asset['metadata']['description'] ? asset['metadata']['description'] : '',
              'current_amount': 1,
              'created_amount': 1,
              'image_url': asset['metadata']['media'],
              'properties': metadata ? JSON.stringify(metadata.data.properties) : null,
              'tokenId': asset['tokenId'],
          }       
          badge['tokenId'] = asset['token_id']
          assetList.push(badge);

        }
        console.log(assetList);
       
    
        return assetList;
      },
    
      async sendAsset(options) {
        const contractId = 'karloriteh.testnet';    
        const { keyStores } = nearAPI;
        const myKeyStore = new keyStores.BrowserLocalStorageKeyStore();
        const networkId = 'karloriteh.testnet';
    
        const connectionConfig = {
          networkId: networkId,
          keyStore: myKeyStore, // first create a key store 
          nodeUrl: "https://rpc.testnet.near.org",
          walletUrl: "https://wallet.testnet.near.org",
          helperUrl: "https://helper.testnet.near.org",
          explorerUrl: "https://explorer.testnet.near.org",
        };
        
        let nearConnection = await connect(connectionConfig);
        const walletConnection = new nearAPI.WalletConnection(nearConnection, 'riteh-badge-app');
        let account = walletConnection.account();
          
        let to = options.to;
        let tokenID = options.tokenID;
    
        const contract = new Contract(
            account, // the account object that is connecting
            account.accountId,
            {
                viewMethods: ["getMessages"], // view methods do not change state but usually return a value
                changeMethods: ["addMessage"], // change methods modify state
            }
        );
        let metadata = {
            account_id: account.accountId,
            token_id: tokenID,
            receiver_id: to,
            amount: 1,
        }
        return account.functionCall({contractId: contract.contractId, methodName: "nft_transfer", args: metadata, attachedDeposit: new BN("1")})
        .then(response => {
          return true
        })
        .catch(e => {
          return false
        })
      },
      
      async login() {
        const { keyStores } = nearAPI;
        const myKeyStore = new keyStores.BrowserLocalStorageKeyStore();
        const networkId = 'karloriteh.testnet';
        const contractId = 'karloriteh.testnet';    
    
        const connectionConfig = {
          networkId: networkId,
          keyStore: myKeyStore, // first create a key store 
          nodeUrl: "https://rpc.testnet.near.org",
          walletUrl: "https://wallet.testnet.near.org",
          helperUrl: "https://helper.testnet.near.org",
          explorerUrl: "https://explorer.testnet.near.org",
        };
        
        let nearConnection = await connect(connectionConfig);
        const walletConnection = new nearAPI.WalletConnection(nearConnection, 'riteh-badge-app');
        console.log(walletConnection);
        this.wallet = walletConnection;
    
        let res = await this.wallet.requestSignIn({contractId: contractId});
        console.log(res)
      },
    
      async isSignedIn() {
        const { keyStores } = nearAPI;
        const myKeyStore = new keyStores.BrowserLocalStorageKeyStore();
        const networkId = 'karloriteh.testnet';
        const contractId = 'karloriteh.testnet';    
    
        const connectionConfig = {
          networkId: networkId,
          keyStore: myKeyStore, // first create a key store 
          nodeUrl: "https://rpc.testnet.near.org",
          walletUrl: "https://wallet.testnet.near.org",
          helperUrl: "https://helper.testnet.near.org",
          explorerUrl: "https://explorer.testnet.near.org",
        };
        
        let nearConnection = await connect(connectionConfig);
        const walletConnection = new nearAPI.WalletConnection(nearConnection, 'riteh-badge-app');
        return await walletConnection.isSignedInAsync();
      },
    
      async getAccount() {
        const { keyStores } = nearAPI;
        const myKeyStore = new keyStores.BrowserLocalStorageKeyStore();
        const networkId = 'karloriteh.testnet';
    
        const connectionConfig = {
          networkId: networkId,
          keyStore: myKeyStore, // first create a key store 
          nodeUrl: "https://rpc.testnet.near.org",
          walletUrl: "https://wallet.testnet.near.org",
          helperUrl: "https://helper.testnet.near.org",
          explorerUrl: "https://explorer.testnet.near.org",
        };
        
        let nearConnection = await connect(connectionConfig);
        const walletConnection = new nearAPI.WalletConnection(nearConnection, 'riteh-badge-app');
        return walletConnection._authData.accountId;
      },
    
      async logout() {
        const { keyStores } = nearAPI;
        const myKeyStore = new keyStores.BrowserLocalStorageKeyStore();
        const networkId = 'karloriteh.testnet';
    
        const connectionConfig = {
          networkId: networkId,
          keyStore: myKeyStore, // first create a key store 
          nodeUrl: "https://rpc.testnet.near.org",
          walletUrl: "https://wallet.testnet.near.org",
          helperUrl: "https://helper.testnet.near.org",
          explorerUrl: "https://explorer.testnet.near.org",
        };
        
        let nearConnection = await connect(connectionConfig);
        const walletConnection = new nearAPI.WalletConnection(nearConnection, 'riteh-badge-app');
        walletConnection.signOut();
      }
}