import CryptoJS from "crypto-js";

const SECRET_PHRASE = process.env.REACT_APP_SESSION_TOKEN;

const encrypt = (text) => {
    return CryptoJS.AES.encrypt(JSON.stringify(text), SECRET_PHRASE).toString();
}

const decrypt = (text) => {
    const bytes = CryptoJS.AES.decrypt(text, SECRET_PHRASE)
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
}

const DataFile = {
    encrypt,
    decrypt,
}

export default DataFile