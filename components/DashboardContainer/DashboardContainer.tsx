"use client";

import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import { useGetTransactions } from "@/hooks/useTransactions";
import { formatCurrency } from "@/utils/formatters";
import Loading from "../Loading/Loading";

import style from "./DashboardContainer.module.css";

// Cores para os gráficos
const COLORS = {
  income: "#22c55e", // Verde para depósitos
  outcome: "#ef4444", // Vermelho para transferências/saídas
};

export default function DashboardContainer() {
  const { data: transactions, isLoading, error } = useGetTransactions();

  // 1. Lógica Derivada: Processamento dos dados para os Gráficos
  const { pieData, barData, summary, suggestions } = useMemo(() => {
    if (!transactions || transactions.length === 0) {
      return { pieData: [], barData: [], summary: { income: 0, outcome: 0 }, suggestions: [] };
    }

    let totalIncome = 0;
    let totalOutcome = 0;
    const monthlyGroups: Record<string, { name: string; Entradas: number; Saídas: number }> = {};

    transactions.forEach((t) => {
      // Cálculo do Total
      if (t.type === "deposito") {
        totalIncome += t.value;
      } else if (t.type === "transferencia") {
        totalOutcome += t.value;
      }

      // Agrupamento por Mês/Ano (ex: "2026-05")
      const [year, month] = t.date.split("-");
      const monthKey = `${year}-${month}`;
      const displayMonth = `${month}/${year}`;

      if (!monthlyGroups[monthKey]) {
        monthlyGroups[monthKey] = { name: displayMonth, Entradas: 0, Saídas: 0 };
      }

      if (t.type === "deposito") {
        monthlyGroups[monthKey].Entradas += t.value;
      } else if (t.type === "transferencia") {
        monthlyGroups[monthKey].Saídas += t.value;
      }
    });

    // Dados para o Gráfico de Pizza (Total consolidado)
    const processedPieData = [
      { name: "Entradas", value: totalIncome, fill: COLORS.income },
      { name: "Saídas", value: totalOutcome, fill: COLORS.outcome },
    ];

    // Dados para o Gráfico de Barras (Ordenado cronologicamente)
    const processedBarData = Object.keys(monthlyGroups)
      .sort() // Ordena as chaves AAAA-MM
      .map((key) => monthlyGroups[key]);

    // 2. Motor de Sugestões Inteligentes
    const generatedSuggestions = [];
    
    if (totalOutcome > totalIncome) {
      generatedSuggestions.push("⚠️ Atenção: Suas despesas ultrapassaram suas receitas. Revise seus gastos deste período.");
    } else if (totalOutcome > totalIncome * 0.8) {
      generatedSuggestions.push("💡 Alerta: Você gastou mais de 80% do que ganhou. Tente reduzir gastos não essenciais para aumentar sua reserva.");
    } else if (totalIncome > 0 && totalOutcome < totalIncome * 0.5) {
      generatedSuggestions.push("🚀 Excelente! Você está economizando mais da metade do que ganha. Considere investir esse excedente!");
    } else if (totalIncome > 0) {
      generatedSuggestions.push("✅ Suas finanças estão equilibradas. Continue acompanhando seus gastos.");
    }

    return {
      pieData: processedPieData,
      barData: processedBarData,
      summary: { income: totalIncome, outcome: totalOutcome },
      suggestions: generatedSuggestions,
    };
  }, [transactions]);

  if (isLoading) return <Loading />;
  if (error) return <p>Erro ao carregar os dados do dashboard.</p>;
  if (!transactions || transactions.length === 0) return <p>Nenhuma transação para analisar.</p>;

  return (
    <div className={style.dashboardWrapper}>
      <h2 className={style.title}>Análise Financeira</h2>

      {/* Seção de Sugestões Inteligentes */}
      <div className={style.suggestionsCard}>
        <h3>Sugestões para você</h3>
        <ul>
          {suggestions.map((sug, index) => (
            <li key={index}>{sug}</li>
          ))}
        </ul>
      </div>

      <div className={style.chartsGrid}>
        {/* Gráfico 1: Entradas vs Saídas */}
        <div className={style.chartBox}>
          <h3>Resumo de Entradas vs. Saídas</h3>
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico 2: Evolução Mensal */}
        <div className={style.chartBox}>
          <h3>Evolução Mensal</h3>
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => `R$ ${value}`} />
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Legend />
                <Bar dataKey="Entradas" fill={COLORS.income} radius={[4, 4, 0, 0]} />
                <Bar dataKey="Saídas" fill={COLORS.outcome} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}