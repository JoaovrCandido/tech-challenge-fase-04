import { NextResponse } from 'next/server';
import { Transaction, TransactionInput } from '@/types';
import { isValidInputType, readDB, writeDB } from '@/lib/db';

export async function GET() {
  try {
    const db = readDB();
    
    return NextResponse.json(db.transaction, { status: 200 });
  } catch (error) {
    console.error('Erro ao ler transações:', error);
    return NextResponse.json({ message: 'Erro interno do servidor ao buscar dados' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const newTransactionData = (await request.json()) as TransactionInput;

    if (!newTransactionData.type || !newTransactionData.amount || newTransactionData.amount <= 0) {
      return NextResponse.json({ message: 'Dados inválidos' }, { status: 400 });
    }

    if (!isValidInputType(newTransactionData.type)) {
      return NextResponse.json(
        { message: 'Tipo (type) inválido. Use "deposito" ou "transferencia"' }, 
        { status: 400 }
      );
    }

    const db = readDB();

    const newTransaction: Transaction = {
      id: db.transaction.length > 0 ? Math.max(...db.transaction.map((t) => t.id)) + 1 : 1,
      type: newTransactionData.type,
      value: newTransactionData.amount,
      date: new Date().toISOString().split('T')[0], // Formato AAAA-MM-DD
      description: newTransactionData.description || '',
    };

    db.transaction.push(newTransaction);
    writeDB(db);

    return NextResponse.json(newTransaction, { status: 201 });

  } catch (error) {
    console.error('Erro ao salvar transação:', error);
    return NextResponse.json({ message: 'Erro interno do servidor' }, { status: 500 });
  }
}