const pinataSDK = require('@pinata/sdk');
const fs = require('fs');
const {FileUtils} = require('./file-utils');

class PinataUtils {

    static async pinFile(fileName) {
        let client = new pinataSDK(this.apiKey, this.secretApiKey);
        let fileNameWithoutExt = FileUtils.getFileNameWithoutExtension(fileName);
        const options = {
            pinataMetadata: {
                name: fileNameWithoutExt + '_riteh_badge',
            },
            pinataOptions: {
                cidVersion: 0
            }
        };
        
        const readFS = fs.createReadStream('./images/' + fileName);
        return (await client.pinFileToIPFS(readFS, options));
        
        /*.then((result) => {
            console.log("R");
            console.log(result);
            return result;
        }).catch((err) => {
            //handle error here
            console.log(err);
        });
        */
    }

    static async getPinList() {
        let client = new pinataSDK(this.apiKey, this.secretApiKey);
        let tu = client.pinList();
        console.log(tu);
        return tu;
    }

    static async pinMetadata(fileName, metadata) {
        let client = new pinataSDK(this.apiKey, this.secretApiKey);
               
        const options = {
            pinataMetadata: {
                name: fileName + '_riteh_badge_metadata',
            },
            pinataOptions: {
                cidVersion: 0
            }
        };
        
        return (await client.pinJSONToIPFS(metadata, options));
    }    
}

PinataUtils.apiKey = 'bf008a6d1a959b987bdf';
PinataUtils.secretApiKey = 'b8d1a361f6accea77e1a711cecbff69abe8cd65868e237aaae6a909f5c03e0a3';
module.exports = { PinataUtils };