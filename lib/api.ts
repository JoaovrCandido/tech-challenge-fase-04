import { Transaction, TransactionInput } from "@/types";
import { db } from "@/lib/firebase";
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where 
} from "firebase/firestore";

// Referência para a coleção "transactions" no Firestore
const transactionsCollection = collection(db, "transactions");

export async function getTransactions(userId: string): Promise<Transaction[]> {
  if (!userId) throw new Error("Usuário não autenticado");

  // Busca APENAS as transações onde o campo userId seja igual ao usuário logado
  const q = query(transactionsCollection, where("userId", "==", userId));
  const querySnapshot = await getDocs(q);

  const transactions: Transaction[] = [];
  
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    transactions.push({
      id: doc.id, // O ID gerado pelo Firebase
      type: data.type,
      value: data.value,
      date: data.date,
      description: data.description || "",
      receipt: data.receipt || "",
    });
  });

  return transactions;
}

export async function createTransaction(
  newTransaction: TransactionInput,
  userId: string
): Promise<Transaction> {
  if (!userId) throw new Error("Usuário não autenticado");

  const txData = {
    userId, // <-- CRÍTICO: Atrelando o dado ao dono!
    type: newTransaction.type,
    value: newTransaction.amount,
    date: new Date().toISOString().split('T')[0],
    description: newTransaction.description || "",
    receipt: newTransaction.receipt || "",
  };

  // Salva no banco de dados e pega a referência do documento criado
  const docRef = await addDoc(transactionsCollection, txData);

  return {
    id: docRef.id,
    ...txData,
  };
}

export async function updateTransaction(
  id: string | number,
  updateData: Partial<TransactionInput>
): Promise<void> {
  // Encontra o documento exato pelo ID
  const docRef = doc(db, "transactions", id.toString());

  // Mapeia os dados do formato de Input para o formato do Banco
  const mappedData: any = {};
  if (updateData.type !== undefined) mappedData.type = updateData.type;
  if (updateData.amount !== undefined) mappedData.value = updateData.amount;
  if (updateData.description !== undefined) mappedData.description = updateData.description;
  if (updateData.receipt !== undefined) mappedData.receipt = updateData.receipt;

  await updateDoc(docRef, mappedData);
}

export async function deleteTransaction(id: string | number): Promise<void> {
  const docRef = doc(db, "transactions", id.toString());
  await deleteDoc(docRef);
}