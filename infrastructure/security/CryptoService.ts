import CryptoJS from "crypto-js";

const SECRET_KEY = process.env.NEXT_PUBLIC_CRYPTO_SECRET || "chave_reserva_de_emergencia";

export class CryptoService {
  encrypt(text: string): string {
    if (!text) return text;
    return CryptoJS.AES.encrypt(text, SECRET_KEY).toString();
  }

  decrypt(cipherText: string): string {
    if (!cipherText) return cipherText;
    
    try {
      const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY);
      const originalText = bytes.toString(CryptoJS.enc.Utf8);
      
      return originalText || cipherText; 
    } catch (error) {
      console.warn("Aviso: Falha ao descriptografar o dado. Retornando valor bruto.");
      return cipherText;
    }
  }
}

export const cryptoService = new CryptoService();