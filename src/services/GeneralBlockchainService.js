import NearService from "./NearService";
import EthereumService from "./EthereumService";
import AlgorandService from "./AlgorandService";
import CardanoService from "./CardanoService";

export default {
  async login(blockhain) {
    return await this.getService(blockhain.code).login()
  },

  async isSignedIn(blockhain) {
    return await this.getService(blockhain.code).isSignedIn()
  },

  async getAccount(blockchain) {
    return await this.getService(blockchain.code).getAccount()
  },

  async getAllAssets(blockchain, existingAssets) {
    return await this.getService(blockchain.code).getAllAssets({existingAssets})
  },

  logout() {},

  async sendAsset(blockchain, options) {
    return this.getService(blockchain.code).sendAsset(options)
  },

  async mintAsset(blockchain, options, badge) {
    return this.getService(blockchain.code).mintAsset(options, badge)
  },


  getService(blockhain) {
    switch (blockhain) {
        case 'ETHEREUM':
          return EthereumService
          break;
        case 'ALGORAND':
          return AlgorandService
          break
        case 'NEAR':
          return NearService
          break
        case 'CARDANO':
          return CardanoService
          break
        default:
            break;
    }
  }
};
