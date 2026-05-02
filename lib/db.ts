import fs from 'fs';
import path from 'path';

import { Database, TransactionType } from '@/types'; 

const dbPath = path.join(process.cwd(), 'db.json');

export const isValidInputType = (type: TransactionType): boolean => {
  return type === "deposito" || type === "transferencia";
};

export const readDB = (): Database => {
  const dbFile = fs.readFileSync(dbPath, 'utf-8');
  return JSON.parse(dbFile);
};

export const writeDB = (data: Database) => {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
};