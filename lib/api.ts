import { Transaction, TransactionInput } from "@/types";

const API_URL = "http://localhost:3000";

async function handleApiResponse(response: Response) {
  if (response.ok) {
    if (response.status === 204) {
      return;
    }
    return response.json();
  }

  try {
    const errorData = await response.json();
    throw new Error(errorData.message || "Ocorreu um erro na API");
  } catch (e: unknown) {
    let errorMessage = `Erro ${response.status}: ${response.statusText}`;

    if (e instanceof Error) {
      errorMessage = e.message;
    }

    throw new Error(errorMessage);
  }
}

export async function getTransactions(): Promise<Transaction[]> {
  const response = await fetch(`${API_URL}/api/transactions`, {
    cache: "no-store",
  });
  return handleApiResponse(response);
}

export async function createTransaction(
  newTransaction: TransactionInput
): Promise<Transaction> {
  const response = await fetch(`${API_URL}/api/transactions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newTransaction),
  });

  return handleApiResponse(response);
}

export async function updateTransaction(
  id: number,
  updateData: Partial<TransactionInput>
): Promise<Transaction> {
  const response = await fetch(`${API_URL}/api/transactions/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updateData),
  });

  return handleApiResponse(response);
}

export async function deleteTransaction(
  id: number
): Promise<{ message: string }> {
  const response = await fetch(`${API_URL}/api/transactions/${id}`, {
    method: "DELETE",
  });

  return handleApiResponse(response);
}
