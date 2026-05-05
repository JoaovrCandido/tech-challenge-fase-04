"use function"; // Corrigindo para "use client"
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { TransactionType } from "@/types";
import dynamic from "next/dynamic";

import { calculateBalance } from "@/utils/calculateBalance";
import { formatCurrency, formatDate } from "@/utils/formatters";
import { getWeekday } from "@/utils/getWeekday";

import { useIsMobile } from "@/hooks/useIsMobile";
import { useGetTransactions, useCreateTransaction } from "@/hooks/useTransactions";
import { useFeedback } from "@/contexts/FeedbackContext";
import { useAuth } from "@/contexts/AuthContext"; // <-- Importando o AuthContext

import BoxBalance from "@/components/BoxBalance/BoxBalance";
import Loading from "@/components/Loading/Loading";
import Menu from "@/components/Menu/Menu";
import TransactionsContainer from "@/components/TransactionsContainer/TransactionsContainer";

import style from "./home.module.css";

const NewTransaction = dynamic(() => import("../components/NewTransaction/NewTransaction"), {
  ssr: false,
});

const DashboardContainer = dynamic(
  () => import("@/components/DashboardContainer/DashboardContainer"),
  { ssr: false }
);

export default function Home() {
  const [type, setType] = useState<TransactionType>("");
  const [value, setValue] = useState("");
  const [description, setDescription] = useState("");
  const [receipt, setReceipt] = useState("");
  
  const isMobile = useIsMobile();
  const { showFeedback } = useFeedback();
  
  // <-- Invocando a Autenticação e Roteamento
  const { user, loading: authLoading } = useAuth(); 
  const router = useRouter();

  const { data: transactions, error, isLoading } = useGetTransactions();
  const { mutateAsync: createTx, isPending: isCreating } = useCreateTransaction();

  // <-- Lógica de redirecionamento para quem não tem login
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  // <-- Telas de carregamento e bloqueio (Importante respeitar a ordem!)
  if (authLoading) return <Loading />;
  if (!user) return null; // Evita piscar a tela da Home antes do redirecionamento

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
        amount: numericAmount,
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
          receipt={receipt}
          onTypeChange={setType}
          onValueChange={setValue}
          onDescriptionChange={setDescription}
          onReceiptChange={setReceipt}
          onSubmit={handleSubmit}
          disabled={isCreating}
        />

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