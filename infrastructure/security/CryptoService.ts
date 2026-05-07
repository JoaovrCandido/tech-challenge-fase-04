// infrastructure/security/CryptoService.ts

import CryptoJS from "crypto-js";

// Lê a chave do arquivo .env.local. 
// O "fallback" (||) garante que o código não quebre se a variável sumir acidentalmente.
const SECRET_KEY = process.env.NEXT_PUBLIC_CRYPTO_SECRET || "chave_reserva_de_emergencia";

export class CryptoService {
  /**
   * Criptografa um texto normal para um texto embaralhado (AES)
   */
  encrypt(text: string): string {
    if (!text) return text;
    return CryptoJS.AES.encrypt(text, SECRET_KEY).toString();
  }

  /**
   * Descriptografa o texto embaralhado de volta para o texto normal
   */
  decrypt(cipherText: string): string {
    if (!cipherText) return cipherText;
    
    try {
      const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY);
      const originalText = bytes.toString(CryptoJS.enc.Utf8);
      
      // Se a descriptografia falhar (ex: dado antigo não criptografado), retorna o texto original
      return originalText || cipherText; 
    } catch (error) {
      console.warn("Aviso: Falha ao descriptografar o dado. Retornando valor bruto.");
      return cipherText;
    }
  }
}

export const cryptoService = new CryptoService();