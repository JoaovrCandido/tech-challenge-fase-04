import { db } from "@/lib/firebase";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where } from "firebase/firestore";
import { ITransactionsRepository, TransactionInput } from "@/core/domain/repositories/ITransactionsRepository";
import { Transaction } from "@/core/domain/entities/Transaction";

export class FirebaseTransactionsRepository implements ITransactionsRepository {
  private collectionRef = collection(db, "transactions");

  async getTransactions(userId: string): Promise<Transaction[]> {
    if (!userId) throw new Error("Usuário não autenticado");
    const q = query(this.collectionRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Transaction[];
  }

  async createTransaction(data: TransactionInput, userId: string): Promise<Transaction> {
    if (!userId) throw new Error("Usuário não autenticado");
    const txData = {
      userId,
      type: data.type,
      value: data.amount,
      date: new Date().toISOString().split('T')[0],
      description: data.description || "",
      receipt: data.receipt || "",
    };
    const docRef = await addDoc(this.collectionRef, txData);
    return { id: docRef.id, ...txData } as Transaction;
  }

  async updateTransaction(id: string | number, data: Partial<TransactionInput>): Promise<void> {
    const docRef = doc(db, "transactions", id.toString());
    const mappedData: any = {};
    if (data.type !== undefined) mappedData.type = data.type;
    if (data.amount !== undefined) mappedData.value = data.amount;
    if (data.description !== undefined) mappedData.description = data.description;
    if (data.receipt !== undefined) mappedData.receipt = data.receipt;
    
    await updateDoc(docRef, mappedData);
  }

  async deleteTransaction(id: string | number): Promise<void> {
    const docRef = doc(db, "transactions", id.toString());
    await deleteDoc(docRef);
  }
}

// Exportamos uma instância única (Singleton) para ser usada no app
export const transactionsRepository = new FirebaseTransactionsRepository();