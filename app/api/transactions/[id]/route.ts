import { NextResponse } from 'next/server';
import { Transaction, TransactionInput } from '@/types';
import { isValidInputType, readDB, writeDB } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ message: 'ID inválido' }, { status: 400 });
    }

    const db = readDB();
    const transaction = db.transaction.find((t) => t.id === id);

    if (!transaction) {
      return NextResponse.json({ message: 'Transação não encontrada' }, { status: 404 });
    }

    return NextResponse.json(transaction, { status: 200 });

  } catch (error) {
    console.error('Erro ao buscar transação:', error);
    return NextResponse.json({ message: 'Erro interno do servidor' }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id, 10);

    if (isNaN(id)) {
      return NextResponse.json({ message: 'ID inválido' }, { status: 400 });
    }

    const updateData = (await request.json()) as Partial<TransactionInput>;

    if (updateData.amount !== undefined && updateData.amount <= 0) {
      return NextResponse.json({ message: 'O valor (amount) deve ser positivo' }, { status: 400 });
    }
    
    if (updateData.type !== undefined) {
      if (!isValidInputType(updateData.type)) {
         return NextResponse.json(
           { message: 'Tipo (type) inválido. Use "deposito" ou "transferencia"' }, 
           { status: 400 }
         );
      }
    }

    const db = readDB();
    const transactionIndex = db.transaction.findIndex((t) => t.id === id);

    if (transactionIndex === -1) {
      return NextResponse.json({ message: 'Transação não encontrada' }, { status: 404 });
    }

    const originalTransaction = db.transaction[transactionIndex];

    const updatedTransaction: Transaction = {
      ...originalTransaction,
      
      type: updateData.type !== undefined ? updateData.type : originalTransaction.type,
      
      value: updateData.amount !== undefined ? updateData.amount : originalTransaction.value,
      description: updateData.description !== undefined ? updateData.description : originalTransaction.description,
      
      date: new Date().toISOString().split('T')[0],
    };

    db.transaction[transactionIndex] = updatedTransaction;
    writeDB(db);

    return NextResponse.json(updatedTransaction, { status: 200 });

  } catch (error) {
    console.error('Erro ao atualizar transação:', error);
    return NextResponse.json({ message: 'Erro interno do servidor' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id, 10);

    if (isNaN(id)) {
      return NextResponse.json({ message: 'ID inválido' }, { status: 400 });
    }

    const db = readDB();

    const initialLength = db.transaction.length;
    db.transaction = db.transaction.filter((t) => t.id !== id);

    if (db.transaction.length === initialLength) {
      return NextResponse.json({ message: 'Transação não encontrada' }, { status: 404 });
    }

    writeDB(db);

    return NextResponse.json({ message: 'Transação deletada com sucesso' }, { status: 200 });

  } catch (error) {
    console.error('Erro ao deletar transação:', error);
    return NextResponse.json({ message: 'Erro interno do servidor' }, { status: 500 });
  }
}