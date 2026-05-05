"use client";

import { useState, useEffect, useMemo } from "react";
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
import { doc, getDoc, setDoc } from "firebase/firestore";

import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { useGetTransactions } from "@/hooks/useTransactions";
import { formatCurrency } from "@/utils/formatters";
import Loading from "../Loading/Loading";

import style from "./DashboardContainer.module.css";

const COLORS = {
  income: "#22c55e",
  outcome: "#ef4444",
};

// 1. Tipagem restrita para as preferências (Sem usar 'any')
interface UserPreferences {
  showPieChart: boolean;
  showBarChart: boolean;
  showSuggestions: boolean;
  savingsGoal: number;
  spendingAlert: number;
}

const defaultPreferences: UserPreferences = {
  showPieChart: true,
  showBarChart: true,
  showSuggestions: true,
  savingsGoal: 0,
  spendingAlert: 0,
};

export default function DashboardContainer() {
  const { user } = useAuth();
  const { data: transactions, isLoading, error } = useGetTransactions();

  // Estados de Configuração
  const [prefs, setPrefs] = useState<UserPreferences>(defaultPreferences);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempPrefs, setTempPrefs] = useState<UserPreferences>(defaultPreferences);
  const [isLoadingPrefs, setIsLoadingPrefs] = useState(true);

  // 2. Busca as preferências do usuário no Firestore
  useEffect(() => {
    async function fetchPreferences() {
      if (!user?.uid) return;
      try {
        const docRef = doc(db, "user_preferences", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data() as UserPreferences;
          setPrefs(data);
          setTempPrefs(data);
        }
      } catch (err) {
        console.error("Erro ao buscar preferências:", err);
      } finally {
        setIsLoadingPrefs(false);
      }
    }
    fetchPreferences();
  }, [user]);

  // 3. Salva as novas preferências no Firestore
  const handleSavePreferences = async () => {
    if (!user?.uid) return;
    try {
      const docRef = doc(db, "user_preferences", user.uid);
      await setDoc(docRef, tempPrefs);
      setPrefs(tempPrefs);
      setIsModalOpen(false);
    } catch (err) {
      console.error("Erro ao salvar preferências:", err);
    }
  };

  // 4. Processamento dos dados (Memoizado)
  const { pieData, barData, summary, suggestions } = useMemo(() => {
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

    const processedPieData = [
      { name: "Entradas", value: totalIncome, fill: COLORS.income },
      { name: "Saídas", value: totalOutcome, fill: COLORS.outcome },
    ];

    const processedBarData = Object.keys(monthlyGroups)
      .sort()
      .map((key) => monthlyGroups[key]);

    const generatedSuggestions: string[] = [];
    if (totalOutcome > totalIncome) {
      generatedSuggestions.push("⚠️ Atenção: Suas despesas ultrapassaram suas receitas.");
    } else if (totalOutcome > totalIncome * 0.8) {
      generatedSuggestions.push("💡 Alerta: Você gastou mais de 80% do que ganhou.");
    } else if (totalIncome > 0 && totalOutcome < totalIncome * 0.5) {
      generatedSuggestions.push("🚀 Excelente! Você está economizando mais da metade do que ganha.");
    }

    return {
      pieData: processedPieData,
      barData: processedBarData,
      summary: { income: totalIncome, outcome: totalOutcome },
      suggestions: generatedSuggestions,
    };
  }, [transactions]);

  if (isLoading || isLoadingPrefs) return <Loading />;
  if (error) return <p>Erro ao carregar os dados do dashboard.</p>;
  if (!transactions || transactions.length === 0) return <p>Nenhuma transação para analisar.</p>;

  // Cálculos para os Widgets Especiais
  const currentSavings = summary.income - summary.outcome;
  const isAlertTriggered = prefs.spendingAlert > 0 && summary.outcome >= prefs.spendingAlert;
  const savingsProgress = prefs.savingsGoal > 0 ? (currentSavings / prefs.savingsGoal) * 100 : 0;

  return (
    <div className={style.dashboardWrapper}>
      <div className={style.headerArea}>
        <h2 className={style.title}>Meu Painel</h2>
        <button className={style.btnCustomize} onClick={() => setIsModalOpen(true)}>
          ⚙️ Personalizar
        </button>
      </div>

      <div className={style.chartsGrid}>
        
        {/* WIDGET: Alerta de Gastos */}
        {prefs.spendingAlert > 0 && (
          <div className={`${style.chartBox} ${isAlertTriggered ? style.alertDanger : style.alertSafe}`}>
            <h3>🚨 Alerta de Gastos</h3>
            <p>Teto definido: <strong>{formatCurrency(prefs.spendingAlert)}</strong></p>
            <p>Gasto atual: <strong>{formatCurrency(summary.outcome)}</strong></p>
            {isAlertTriggered && <span className={style.alertMessage}>Você atingiu/ultrapassou seu limite!</span>}
          </div>
        )}

        {/* WIDGET: Meta de Economia */}
        {prefs.savingsGoal > 0 && (
          <div className={style.chartBox}>
            <h3>🎯 Meta de Economia</h3>
            <p>Objetivo: <strong>{formatCurrency(prefs.savingsGoal)}</strong></p>
            <p>Economizado: <strong>{formatCurrency(currentSavings > 0 ? currentSavings : 0)}</strong></p>
            <div className={style.progressBarBg}>
              <div 
                className={style.progressBarFill} 
                style={{ width: `${Math.min(Math.max(savingsProgress, 0), 100)}%` }}
              ></div>
            </div>
            <span style={{ fontSize: '12px', marginTop: '8px' }}>
              {Math.min(Math.max(savingsProgress, 0), 100).toFixed(1)}% concluído
            </span>
          </div>
        )}

        {/* WIDGET: Sugestões */}
        {prefs.showSuggestions && suggestions.length > 0 && (
          <div className={style.suggestionsCard}>
            <h3>💡 Insights</h3>
            <ul>
              {suggestions.map((sug, index) => (
                <li key={index}>{sug}</li>
              ))}
            </ul>
          </div>
        )}

        {/* WIDGET: Gráfico de Pizza */}
        {prefs.showPieChart && (
          <div className={style.chartBox}>
            <h3>Resumo Geral</h3>
            <div style={{ width: "100%", height: 250 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={5} dataKey="value">
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
        )}

        {/* WIDGET: Gráfico de Barras */}
        {prefs.showBarChart && (
          <div className={style.chartBox}>
            <h3>Evolução Mensal</h3>
            <div style={{ width: "100%", height: 250 }}>
              <ResponsiveContainer>
                <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="name" fontSize={12} />
                  <YAxis tickFormatter={(value) => `R$${value}`} fontSize={12} width={60} />
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  <Legend />
                  <Bar dataKey="Entradas" fill={COLORS.income} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Saídas" fill={COLORS.outcome} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>

      {/* MODAL DE PERSONALIZAÇÃO */}
      {isModalOpen && (
        <div className={style.modalOverlay}>
          <div className={style.modalContent}>
            <h3>Personalizar Widgets</h3>
            
            <div className={style.formGroup}>
              <label>
                <input 
                  type="checkbox" 
                  checked={tempPrefs.showPieChart} 
                  onChange={(e) => setTempPrefs({...tempPrefs, showPieChart: e.target.checked})}
                /> Mostrar Resumo Geral (Pizza)
              </label>
            </div>

            <div className={style.formGroup}>
              <label>
                <input 
                  type="checkbox" 
                  checked={tempPrefs.showBarChart} 
                  onChange={(e) => setTempPrefs({...tempPrefs, showBarChart: e.target.checked})}
                /> Mostrar Evolução Mensal (Barras)
              </label>
            </div>

            <div className={style.formGroup}>
              <label>
                <input 
                  type="checkbox" 
                  checked={tempPrefs.showSuggestions} 
                  onChange={(e) => setTempPrefs({...tempPrefs, showSuggestions: e.target.checked})}
                /> Mostrar Insights
              </label>
            </div>

            <div className={style.formGroupInputs}>
              <label>🎯 Meta de Economia (R$):</label>
              <input 
                type="number" 
                min="0"
                value={tempPrefs.savingsGoal || ""} 
                onChange={(e) => setTempPrefs({...tempPrefs, savingsGoal: Number(e.target.value)})}
                placeholder="Ex: 5000"
              />
            </div>

            <div className={style.formGroupInputs}>
              <label>🚨 Alerta de Gastos (Teto R$):</label>
              <input 
                type="number" 
                min="0"
                value={tempPrefs.spendingAlert || ""} 
                onChange={(e) => setTempPrefs({...tempPrefs, spendingAlert: Number(e.target.value)})}
                placeholder="Ex: 2000"
              />
            </div>

            <div className={style.modalActions}>
              <button className={style.btnCancel} onClick={() => setIsModalOpen(false)}>Cancelar</button>
              <button className={style.btnSave} onClick={handleSavePreferences}>Salvar Painel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}