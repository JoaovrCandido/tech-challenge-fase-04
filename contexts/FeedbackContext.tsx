"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import SuccessModal from "@/components/SuccessModal/SuccessModal";

interface FeedbackContextData {
  showFeedback: (title: string, message: string) => void;
  hideFeedback: () => void;
}

const FeedbackContext = createContext<FeedbackContextData>({} as FeedbackContextData);

export function FeedbackProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  const showFeedback = (newTitle: string, newMessage: string) => {
    setTitle(newTitle);
    setMessage(newMessage);
    setIsOpen(true);
  };

  const hideFeedback = () => {
    setIsOpen(false);
  };

  return (
    <FeedbackContext.Provider value={{ showFeedback, hideFeedback }}>
      {children}
      <SuccessModal
        isOpen={isOpen}
        title={title}
        message={message}
        onClose={hideFeedback}
      />
    </FeedbackContext.Provider>
  );
}

export const useFeedback = () => useContext(FeedbackContext);