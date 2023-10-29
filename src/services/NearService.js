import * as nearAPI from 'near-api-js';
import { utils } from 'near-api-js';
const { connect } = nearAPI;
const { Contract } = nearAPI;
import BN from 'bn.js';
import axios from 'axios';

const appKeyPrefix = import.meta.env.VITE_API_APP_KEY_PREFIX
const networkId = import.meta.env.VITE_API_NETWORK_ID
const contractId = import.meta.env.VITE_API_CONTRACT_ID

export default {
  async mintAsset(options, badge) {
    const { keyStores } = nearAPI;
    const myKeyStore = new keyStores.BrowserLocalStorageKeyStore();
    
    const connectionConfig = {
      networkId: networkId,
      keyStore: myKeyStore, // first create a key store 
      nodeUrl: "https://rpc.testnet.near.org",
      walletUrl: "https://wallet.testnet.near.org",
      helperUrl: "https://helper.testnet.near.org",
      explorerUrl: "https://explorer.testnet.near.org",
    };
    let nearConnection = await connect(connectionConfig);
    const walletConnection = new nearAPI.WalletConnection(nearConnection, appKeyPrefix);
    let account = walletConnection.account();
      
    const contract = new Contract(
      account, // the account object that is connecting
      contractId,
      {
          viewMethods: ["getMessages"], // view methods do not change state but usually return a value
          changeMethods: ["addMessage"], // change methods modify state
      }
    );
  
    let assetIdList = await this.getAllAssetIds();
    let maxAssetId = Math.max(...assetIdList.map(o => parseInt(o)));
    
          
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
            reference: "https://gateway.pinata.cloud/ipfs/" + options['responseJson']['IpfsHash']
        }
      }
    
      promises.push(account.functionCall({contractId: contract.contractId, methodName: "nft_mint", args: metadata, attachedDeposit: new BN(import.meta.env.VITE_API_MINT_DEPOSIT)}))
    }
    return Promise.allSettled(promises)
  },
    
  async getAllAssets(options) {
    const { keyStores } = nearAPI;
    const myKeyStore = new keyStores.BrowserLocalStorageKeyStore();
  
    const connectionConfig = {
      networkId: networkId,
      keyStore: myKeyStore, // first create a key store 
      nodeUrl: "https://rpc.testnet.near.org",
      walletUrl: "https://wallet.testnet.near.org",
      helperUrl: "https://helper.testnet.near.org",
      explorerUrl: "https://explorer.testnet.near.org",
    };
    
    let nearConnection = await connect(connectionConfig);
    const walletConnection = new nearAPI.WalletConnection(nearConnection, appKeyPrefix);
    let account = walletConnection.account();

    const messages = await account.viewFunction({contractId: contractId, methodName: "nft_tokens_for_owner", args: {account_id: account.accountId}});
    let assetList = [];
    for(let asset of messages) { 
      if(options.existingAssets.includes(parseInt(asset['token_id']))) continue
      console.log("NOVI DETEKTIRAN")
      
      let metadata = asset['metadata']['reference'] ? await axios.get(asset['metadata']['reference']) : null
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
    
    return assetList;
  },

  async getAllAssetIds() {
    const { keyStores } = nearAPI;
    const myKeyStore = new keyStores.BrowserLocalStorageKeyStore();
  
    const connectionConfig = {
      networkId: networkId,
      keyStore: myKeyStore, // first create a key store 
      nodeUrl: "https://rpc.testnet.near.org",
      walletUrl: "https://wallet.testnet.near.org",
      helperUrl: "https://helper.testnet.near.org",
      explorerUrl: "https://explorer.testnet.near.org",
    };
    
    let nearConnection = await connect(connectionConfig);
    const walletConnection = new nearAPI.WalletConnection(nearConnection, appKeyPrefix);
    let account = walletConnection.account();

    const messages = await account.viewFunction({contractId: contractId, methodName: "nft_tokens_for_owner", args: {account_id: account.accountId}});
    let assetList = [];
    for(let asset of messages) {
      if(asset['token_id'] !== 'NaN') assetList.push(asset['token_id']);
    }
    
    return assetList;
  },

  async sendAsset(options) {
    const { keyStores } = nearAPI;
    const myKeyStore = new keyStores.BrowserLocalStorageKeyStore();

    const connectionConfig = {
      networkId: networkId,
      keyStore: myKeyStore, // first create a key store 
      nodeUrl: "https://rpc.testnet.near.org",
      walletUrl: "https://wallet.testnet.near.org",
      helperUrl: "https://helper.testnet.near.org",
      explorerUrl: "https://explorer.testnet.near.org",
    };
    
    let nearConnection = await connect(connectionConfig);
    const walletConnection = new nearAPI.WalletConnection(nearConnection, appKeyPrefix);
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
    return await account.functionCall({contractId: contract.contractId, methodName: "nft_transfer", args: metadata, attachedDeposit: new BN(import.meta.env.VITE_API_SEND_DEPOSIT)})
  },
  
  async login() {
    const { keyStores } = nearAPI;
    const myKeyStore = new keyStores.BrowserLocalStorageKeyStore();

    const connectionConfig = {
      networkId: networkId,
      keyStore: myKeyStore, // first create a key store 
      nodeUrl: "https://rpc.testnet.near.org",
      walletUrl: "https://wallet.testnet.near.org",
      helperUrl: "https://helper.testnet.near.org",
      explorerUrl: "https://explorer.testnet.near.org",
    };
    
    let nearConnection = await connect(connectionConfig);
    const walletConnection = new nearAPI.WalletConnection(nearConnection, appKeyPrefix);
    console.log(walletConnection);
    this.wallet = walletConnection;

    let res = await this.wallet.requestSignIn({contractId: contractId});
  },
    
  async isSignedIn() {
    const { keyStores } = nearAPI;
    const myKeyStore = new keyStores.BrowserLocalStorageKeyStore();

    const connectionConfig = {
      networkId: networkId,
      keyStore: myKeyStore, // first create a key store 
      nodeUrl: "https://rpc.testnet.near.org",
      walletUrl: "https://wallet.testnet.near.org",
      helperUrl: "https://helper.testnet.near.org",
      explorerUrl: "https://explorer.testnet.near.org",
    };
    
    let nearConnection = await connect(connectionConfig);
    const walletConnection = new nearAPI.WalletConnection(nearConnection, appKeyPrefix);
    return await walletConnection.isSignedInAsync();
  },

  async getAccount() {
    const { keyStores } = nearAPI;
    const myKeyStore = new keyStores.BrowserLocalStorageKeyStore();
  
    const connectionConfig = {
      networkId: networkId,
      keyStore: myKeyStore, // first create a key store 
      nodeUrl: "https://rpc.testnet.near.org",
      walletUrl: "https://wallet.testnet.near.org",
      helperUrl: "https://helper.testnet.near.org",
      explorerUrl: "https://explorer.testnet.near.org",
    };
    
    let nearConnection = await connect(connectionConfig);
    const walletConnection = new nearAPI.WalletConnection(nearConnection, appKeyPrefix);
    return walletConnection._authData.accountId;
  },

  async logout() {
    const { keyStores } = nearAPI;
    const myKeyStore = new keyStores.BrowserLocalStorageKeyStore();

    const connectionConfig = {
      networkId: networkId,
      keyStore: myKeyStore, // first create a key store 
      nodeUrl: "https://rpc.testnet.near.org",
      walletUrl: "https://wallet.testnet.near.org",
      helperUrl: "https://helper.testnet.near.org",
      explorerUrl: "https://explorer.testnet.near.org",
    };
    
    let nearConnection = await connect(connectionConfig);
    const walletConnection = new nearAPI.WalletConnection(nearConnection, appKeyPrefix);
    walletConnection.signOut();
  }
}