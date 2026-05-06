"use client";

import { useState, useEffect, useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";

import { useAuth } from "@/contexts/AuthContext";
import { useGetTransactions } from "@/hooks/useTransactions";
import { formatCurrency } from "@/utils/formatters";
import Loading from "../Loading/Loading";

// ---> IMPORTANDO NOSSOS CASOS DE USO E REPOSITÓRIOS (Clean Architecture) <---
import { generateDashboardInsights } from "@/core/useCases/GenerateDashboardInsights";
import { preferencesRepository } from "@/infrastructure/database/FirebasePreferencesRepository";
import { UserPreferences } from "@/core/domain/repositories/IPreferencesRepository";

import style from "./DashboardContainer.module.css";

const defaultPreferences: UserPreferences = {
  showPieChart: true, showBarChart: true, showSuggestions: true, savingsGoal: 0, spendingAlert: 0,
};

export default function DashboardContainer() {
  const { user } = useAuth();
  const { data: transactions, isLoading, error } = useGetTransactions();

  const [prefs, setPrefs] = useState<UserPreferences>(defaultPreferences);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempPrefs, setTempPrefs] = useState<UserPreferences>(defaultPreferences);
  const [isLoadingPrefs, setIsLoadingPrefs] = useState(true);

  // Busca Preferências via Repositório (Sem Firebase exposto)
  useEffect(() => {
    async function fetchPreferences() {
      if (!user?.uid) return;
      try {
        const data = await preferencesRepository.getPreferences(user.uid);
        if (data) {
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

  // Salva Preferências via Repositório
  const handleSavePreferences = async () => {
    if (!user?.uid) return;
    try {
      await preferencesRepository.savePreferences(user.uid, tempPrefs);
      setPrefs(tempPrefs);
      setIsModalOpen(false);
    } catch (err) {
      console.error("Erro ao salvar preferências:", err);
    }
  };

  // Cálculo de Regras de Negócio (Isolado no Caso de Uso)
  const insights = useMemo(() => {
    return generateDashboardInsights(transactions);
  }, [transactions]);

  if (isLoading || isLoadingPrefs) return <Loading />;
  if (error) return <p>Erro ao carregar os dados do dashboard.</p>;
  if (!transactions || transactions.length === 0) return <p>Nenhuma transação para analisar.</p>;

  const currentSavings = insights.summary.income - insights.summary.outcome;
  const isAlertTriggered = prefs.spendingAlert > 0 && insights.summary.outcome >= prefs.spendingAlert;
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
            <p>Gasto atual: <strong>{formatCurrency(insights.summary.outcome)}</strong></p>
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
            <span style={{ fontSize: '12px', marginTop: '8px', color: 'var(--color-muted)' }}>
              {Math.min(Math.max(savingsProgress, 0), 100).toFixed(1)}% concluído
            </span>
          </div>
        )}

        {/* WIDGET: Sugestões */}
        {prefs.showSuggestions && insights.suggestions.length > 0 && (
          <div className={style.suggestionsCard}>
            <h3>💡 Insights</h3>
            <ul>
              {insights.suggestions.map((sug, index) => (
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
                  <Pie data={insights.pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={5} dataKey="value">
                    {insights.pieData.map((entry, index) => (
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
                <BarChart data={insights.barData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="name" fontSize={12} />
                  <YAxis tickFormatter={(value) => `R$${value}`} fontSize={12} width={60} />
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  <Legend />
                  <Bar dataKey="Entradas" fill="#22c55e" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Saídas" fill="#ef4444" radius={[4, 4, 0, 0]} />
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