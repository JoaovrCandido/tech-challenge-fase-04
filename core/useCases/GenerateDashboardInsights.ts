import { Transaction } from "../domain/entities/Transaction";

const COLORS = {
  income: "#22c55e",
  outcome: "#ef4444",
};

export interface DashboardInsights {
  pieData: { name: string; value: number; fill: string }[];
  barData: { name: string; Entradas: number; Saídas: number }[];
  summary: { income: number; outcome: number };
  suggestions: string[];
}

export function generateDashboardInsights(transactions: Transaction[] | undefined): DashboardInsights {
  if (!transactions || transactions.length === 0) {
    return { pieData: [], barData: [], summary: { income: 0, outcome: 0 }, suggestions: [] };
  }

  let totalIncome = 0;
  let totalOutcome = 0;
  const monthlyGroups: Record<string, { name: string; Entradas: number; Saídas: number }> = {};

  transactions.forEach((t) => {
    if (t.type === "deposito") totalIncome += t.value;
    else if (t.type === "transferencia") totalOutcome += t.value;

    const [year, month] = t.date.split("-");
    const monthKey = `${year}-${month}`;
    const displayMonth = `${month}/${year}`;

    if (!monthlyGroups[monthKey]) {
      monthlyGroups[monthKey] = { name: displayMonth, Entradas: 0, Saídas: 0 };
    }

    if (t.type === "deposito") monthlyGroups[monthKey].Entradas += t.value;
    else if (t.type === "transferencia") monthlyGroups[monthKey].Saídas += t.value;
  });

  const pieData = [
    { name: "Entradas", value: totalIncome, fill: COLORS.income },
    { name: "Saídas", value: totalOutcome, fill: COLORS.outcome },
  ];

  const barData = Object.keys(monthlyGroups)
    .sort()
    .map((key) => monthlyGroups[key]);

  const suggestions: string[] = [];
  if (totalOutcome > totalIncome) {
    suggestions.push("⚠️ Atenção: Suas despesas ultrapassaram suas receitas.");
  } else if (totalOutcome > totalIncome * 0.8) {
    suggestions.push("💡 Alerta: Você gastou mais de 80% do que ganhou.");
  } else if (totalIncome > 0 && totalOutcome < totalIncome * 0.5) {
    suggestions.push("🚀 Excelente! Você está economizando mais da metade do que ganha.");
  }

  return {
    pieData,
    barData,
    summary: { income: totalIncome, outcome: totalOutcome },
    suggestions,
  };
}