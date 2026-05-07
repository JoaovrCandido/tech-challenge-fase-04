import { db } from "@/lib/firebase";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where } from "firebase/firestore";
import { ITransactionsRepository, TransactionInput } from "@/core/domain/repositories/ITransactionsRepository";
import { Transaction } from "@/core/domain/entities/Transaction";
import { cryptoService } from "../security/CryptoService";

export class FirebaseTransactionsRepository implements ITransactionsRepository {
  private collectionRef = collection(db, "transactions");

  async getTransactions(userId: string): Promise<Transaction[]> {
    if (!userId) throw new Error("Usuário não autenticado");
    const q = query(this.collectionRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        userId: data.userId,
        type: data.type,
        value: data.value,
        date: data.date,
        description: cryptoService.decrypt(data.description),
        receipt: cryptoService.decrypt(data.receipt),
      };
    }) as Transaction[];
  }

  async createTransaction(data: TransactionInput, userId: string): Promise<Transaction> {
    if (!userId) throw new Error("Usuário não autenticado");
    
    const today = new Date();
    const localDateString = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
      .toISOString()
      .split('T')[0];
    
    const txData = {
      userId,
      type: data.type,
      value: data.amount,
      date: localDateString, 
      description: cryptoService.encrypt(data.description || ""),
      receipt: cryptoService.encrypt(data.receipt || ""),
    };
    
    const docRef = await addDoc(this.collectionRef, txData);
    
    return { 
      id: docRef.id, 
      ...txData, 
      description: data.description || "", 
      receipt: data.receipt || "" 
    } as Transaction;
  }

  async updateTransaction(id: string | number, data: Partial<TransactionInput>): Promise<void> {
    const docRef = doc(db, "transactions", id.toString());
    const mappedData: any = {};
    
    if (data.type !== undefined) mappedData.type = data.type;
    if (data.amount !== undefined) mappedData.value = data.amount;
    
    if (data.description !== undefined) {
      mappedData.description = cryptoService.encrypt(data.description);
    }
    if (data.receipt !== undefined) {
      mappedData.receipt = cryptoService.encrypt(data.receipt);
    }
    
    await updateDoc(docRef, mappedData);
  }

  async deleteTransaction(id: string | number): Promise<void> {
    const docRef = doc(db, "transactions", id.toString());
    await deleteDoc(docRef);
  }
}

export const transactionsRepository = new FirebaseTransactionsRepository();