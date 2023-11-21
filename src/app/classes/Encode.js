import CryptoJS from "crypto-js";

export default class Encode {
    constructor () {
        // this.text = text
        this.secret = process.env.REACT_APP_SESSION_TOKEN
    }

    static encrypt = (text) => {
        return CryptoJS.AES.encrypt(JSON.stringify(text), this.secret)
    }

    static decrypt = (text) => {
        const bytes = CryptoJS.AES.decrypt(text, this.secret)
        return JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
    }
}