import { Alchemy, Network } from 'alchemy-sdk';
import { createAlchemyWeb3 } from '@alch/alchemy-web3';
import contract from "../../ritehBadge/artifacts/contracts/RitehBadge.sol/RitehBadge.json"

const contractAddress = import.meta.env.VITE_API_ETH_CONTRACT_ADDRESS;
const API_KEY = import.meta.env.VITE_API_ALCHEMY_APP_KEY;
const web3 = createAlchemyWeb3("https://eth-goerli.g.alchemy.com/v2/" + API_KEY);
const nftContract = new web3.eth.Contract(contract.abi, contractAddress);

export default {   
    async mintAsset(options, badge) {
        let account = await this.getAccount();     
        const nonce = await web3.eth.getTransactionCount(account, 'latest'); //get latest nonce
        let tokenURI = 'https://gateway.pinata.cloud/ipfs/' + options.responseJson['IpfsHash'];
        let strNonce = String(nonce);
        const params = [{
            'from': account,
            'to': contractAddress,
            'nonce': strNonce,
            'gas': '500000',
            'data': nftContract.methods.mintMultipleNFT(account, tokenURI, badge.created_amount).encodeABI()
        }];

        return await window['ethereum']
        .request({
            method: 'eth_sendTransaction',
            params,
        })
    },

    async getAllAssets(options) {
        let config = {
            apiKey: API_KEY,
            network: import.meta.env.VITE_API_ETH_NETWORK,
        };
        const alchemy = new Alchemy(config);

        const nfts = await alchemy.nft.getNftsForContract(contractAddress);
        let ownedNfts = nfts['nfts'];
        let assetList = [];
        for(let nft of ownedNfts) {
            if(options.existingAssets.includes(parseInt(nft['tokenId']))) continue
            console.log("NOVI DETEKTIRAN")
            let asset = 
            {
                'name': nft['title'],
                'description': nft['description'] ? nft['description'] : '',
                'current_amount': 1,
                'created_amount': 1,
                'image_url': nft['rawMetadata']['image'],
                'properties': JSON.stringify(nft['rawMetadata']['properties']),
                'tokenId': nft['tokenId'],
                'local_img_path': nft['rawMetadata']['local_image'] ? nft['rawMetadata']['local_image'] : null,
                'badge_created_at': nft['rawMetadata']['created_at'] ? nft['rawMetadata']['created_at'] : null 
            }
                
            assetList.push(asset);
        }
        
        return assetList;
    },

    async sendAsset(options) {
        process.env = {};
        let account = await this.getAccount();
        const nonce = await web3.eth.getTransactionCount(account, 'latest');
        let strNonce = String(nonce);
        let to = options.to;
        let tokenID = options.tokenID;
        
        const params = [{
            'from': account,
            'to': contractAddress,
            'nonce': strNonce,
            'data': nftContract.methods.safeTransferFrom(account, to, tokenID).encodeABI() //I could use also transferFrom
        },];

        return await window['ethereum']
        .request({
            method: 'eth_sendTransaction',
            params,
        })
    },
    
    async login() {
        if (typeof window['ethereum'] !== 'undefined') {
            console.log('MetaMask is installed!');
            const accounts = await window['ethereum'].request({method: 'eth_requestAccounts'});
            return accounts[0]
        } else {
            alert("Please install metamask!");
            return false
        }
    },
    
    async isSignedIn() {
        if (typeof window['ethereum'] !== 'undefined') {
            console.log('MetaMask is installed!');
            return (await window['ethereum'].request({method: 'eth_accounts'}))[0] || false;
        } else {
            alert("Please install metamask!");
            return false;
        }    
    },
    
    async getAccount() {
        if (typeof window['ethereum'] !== 'undefined') {
            console.log('MetaMask is installed!');
            return (await window['ethereum'].request({method: 'eth_accounts'}))[0];
        } else {
            alert("Please install metamask!");
            return false;
        }    
    },

    logout() {
    }
}