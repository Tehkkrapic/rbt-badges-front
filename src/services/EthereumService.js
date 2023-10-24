import { Alchemy, Network } from 'alchemy-sdk';
import { createAlchemyWeb3 } from '@alch/alchemy-web3';
const web3 = createAlchemyWeb3("https://eth-goerli.g.alchemy.com/v2/QfTJHbWrYBzHy6WdP206xLvC7ESk5V3K");

//import contract from "../../public/artifacts/contracts/RitehBadge.sol/RitehBadge.json"
import contract from "../../ritehBadge/artifacts/contracts/RitehBadge.sol/RitehBadge.json"

//const contractAddress = "0x10372B2Bf41C7d3C1C424416F9fd4052Da3f4E0B";

const contractAddress = "0xF68F92713B2ac1Cac2D08FfB8921944032e5778D";

const nftContract = new web3.eth.Contract(contract.abi, contractAddress);
const API_KEY = "QfTJHbWrYBzHy6WdP206xLvC7ESk5V3K"//environment.API_KEY;
const API_URL = "QfTJHbWrYBzHy6WdP206xLvC7ESk5V3K";
const PUBLIC_KEY = 1//environment.PUBLIC_KEY;
const PRIVATE_KEY = 1//environment.PRIVATE_KEY;

export default {

    
    async mintAsset(options, badge) {
        let account = await this.getAccount();     
        const nonce = await web3.eth.getTransactionCount(account, 'latest'); //get latest nonce
        console.log(options)
        console.log(badge)
        let tokenURI = 'https://gateway.pinata.cloud/ipfs/' + options.metaDataResult['IpfsHash'];
        let strNonce = String(nonce);
        console.log(badge.created_amount)
        const params = [{
            'from': account,
            'to': contractAddress,
            'nonce': strNonce,
            'gas': '500000',
            'data': nftContract.methods.mintMultipleNFT(account, tokenURI, badge.created_amount).encodeABI()
        }];

        
        return window['ethereum']
        .request({
            method: 'eth_sendTransaction',
            params,
        })
        .then((result) => {
            console.log(result);
            return true
            // The result varies by RPC method.
            // For example, this method will return a transaction hash hexadecimal string on success.
        })
        .catch((error) => {
            console.log(error)
            return false
            // If the request fails, the Promise will reject with an error.
        });    
  //      }    
    },


    async getAllAssets(options) {
        window['ethereum']
        .request({
            method: 'eth_getBalance'
        })
        .then(res => console.log(res))
        .catch(e => console.log(e))

        process.env = {};
        let config = {
            apiKey: API_KEY,
            network: Network.ETH_GOERLI,
        };
        const alchemy = new Alchemy(config);

        const nfts = await alchemy.nft.getNftsForContract(contractAddress);
        // Print NFTs
        console.log(nfts);

        const t = await alchemy.nft.getOwnersForNft(contractAddress, 1);
        console.log(t)
        let account = await this.getAccount()
        let ownedNfts = nfts['nfts'];
        let assetList = [];
        let usedAssets = []
        for(let nft of ownedNfts) {
            let badge = 
            {
                'name': nft['title'],
                'description': nft['description'] ? nft['description'] : '',
                'current_amount': 1,
                'created_amount': 1,
                'image_url': nft['rawMetadata']['image'],
                'properties': JSON.stringify(nft['rawMetadata']['properties']),
                'tokenId': nft['tokenId']
            }
                
            assetList.push(badge);
        }
        console.log(assetList)
        return assetList;
    },

    async sendAsset(options) {
        process.env = {};
        let config = {
            apiKey: API_KEY,
            network: Network.ETH_GOERLI,
        };
        const alchemy = new Alchemy(config);

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

        return window['ethereum']
        .request({
            method: 'eth_sendTransaction',
            params,
        })
        .then((result) => {
            console.log(result)
            return true
            // return alchemy.transact.waitForTransaction(result)
            // .then(res => {
            //     return true
            // })
            // .catch(e => {
            //     return false
            // })
            // The result varies by RPC method.
            // For example, this method will return a transaction hash hexadecimal string on success.
        })
        .catch((error) => {
            console.log(error)
            return false
            // If the request fails, the Promise will reject with an error.
        });
    },
    
    async login() {
        if (typeof window['ethereum'] !== 'undefined') {
            console.log('MetaMask is installed!');
            const accounts = await window['ethereum'].request({method: 'eth_requestAccounts'});
            // this.account = accounts[0];
            // window['ethereum'].on('accountsChanged', function (accounts) {
            // this.account = accounts[0];
            // });
            // console.log(this.account);
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
        }    
    },

    logout() {
    }
}