"use client";

import { useState } from "react";
import { TransactionType } from "@/types";
import dynamic from "next/dynamic";

import { calculateBalance } from "@/utils/calculateBalance";
import { formatCurrency, formatDate } from "@/utils/formatters";
import { getWeekday } from "@/utils/getWeekday";

import { useIsMobile } from "@/hooks/useIsMobile";
import { useGetTransactions, useCreateTransaction } from "@/hooks/useTransactions";
import { useFeedback } from "@/contexts/FeedbackContext"; // <-- Importando nosso novo hook

import BoxBalance from "@/components/BoxBalance/BoxBalance";
import Loading from "@/components/Loading/Loading";
// import NewTransaction from "@/components/NewTransaction/NewTransaction";
import Menu from "@/components/Menu/Menu";
import TransactionsContainer from "@/components/TransactionsContainer/TransactionsContainer";

import style from "./home.module.css";

const NewTransaction = dynamic(() => import("../components/NewTransaction/NewTransaction"), {
  ssr: false, // Modais não precisam ser renderizados no servidor, economiza processamento!
});

// Importando o Dashboard de forma "preguiçosa" para não pesar o carregamento da Home
const DashboardContainer = dynamic(
  () => import("@/components/DashboardContainer/DashboardContainer"),
  { ssr: false }
);

export default function Home() {
  const [type, setType] = useState<TransactionType>("");
  const [value, setValue] = useState("");
  const [description, setDescription] = useState("");
  const [receipt, setReceipt] = useState(""); // <-- NOVO ESTADO AQUI
  
  const isMobile = useIsMobile();
  const { showFeedback } = useFeedback(); // <-- Chamando o hook global

  const { data: transactions, error, isLoading } = useGetTransactions();
  const { mutateAsync: createTx, isPending: isCreating } = useCreateTransaction();

  if (error) return <div>Falha ao carregar...</div>;
  if (isLoading || !transactions) return <Loading />;

  const balance = calculateBalance(transactions);
  const formatedBalance = formatCurrency(balance);

  const today = new Date();
  const localISO = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, -1);

  const weekday = getWeekday(localISO);
  const formatted = formatDate(localISO);
  const displayDate =
    weekday.charAt(0).toLowerCase() + weekday.slice(1) + ", " + formatted;

  const handleSubmit = async () => {
    // DESFAZ A MÁSCARA: Remove R$, espaços e pontos. Troca a vírgula por ponto.
    const cleanString = value.replace(/[^\d,-]/g, "").replace(",", ".");
    const numericAmount = Number(cleanString);

    if (!type || numericAmount <= 0) {
      showFeedback("Erro!!!", "Por favor, preencha o valor da transação!");
      return;
    }

    if (type == "transferencia" && numericAmount > balance) {
      showFeedback("Erro!!!", "Saldo insuficiente para realizar a transferência!");
      return;
    }

    try {
      await createTx({
        type,
        amount: numericAmount, // Mandamos o número real e seguro para a API
        description,
        receipt, 
      });

      setType("");
      setValue("");
      setDescription("");
      setReceipt(""); 
      
      showFeedback("Sucesso!!!", "Transação realizada com sucesso!");
    } catch (error) {
      console.error("Erro ao enviar a transação:", error);
      showFeedback("Erro!!!", "Erro ao enviar a transação!");
    }
  };

  return (
    <div className={style.layout}>
      {!isMobile && <Menu />}

      <div className={style.mainContent}>
        <BoxBalance balance={formatedBalance} dateString={displayDate} />

        <NewTransaction
          title="Nova transação"
          type={type}
          value={value}
          description={description}
          onTypeChange={setType}
          onValueChange={setValue}
          onDescriptionChange={setDescription}
          onReceiptChange={setReceipt}
          onSubmit={handleSubmit}
          disabled={isCreating}
        />

        {/* O Dashboard de análise financeira sendo renderizado aqui com Lazy Loading! */}
        <div style={{ marginTop: "32px", width: "100%" }}>
          <DashboardContainer />
        </div>
      </div>

      <aside className={style.transactionsPanel}>
        <TransactionsContainer />
      </aside>
    </div>
  );
}