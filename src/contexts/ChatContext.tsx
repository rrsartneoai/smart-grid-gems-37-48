
import React, { createContext, useContext, ReactNode } from 'react';
import { useMessageState } from "@/hooks/chat/useMessageState";
import { useChat as useChatHook } from "@/hooks/useChat";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { Message } from "@/types/chat";
import { useConversation } from "@11labs/react";

interface ChatContextType {
  messages: Message[];
  input: string;
  setInput: (value: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  isPending: boolean;
  isRecording: boolean;
  handleVoiceInput: () => void;
  clearConversation: () => void;
  isSpeaking: boolean;
  handleStopSpeaking: () => void;
  handleSaveHistory: () => void;
  isTyping: boolean;
  handleSuggestionClick: (suggestion: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isTyping, setIsTyping] = React.useState(false);
  const [elevenlabsKey, setElevenlabsKey] = React.useState(() => localStorage.getItem('ELEVENLABS_API_KEY') || '');

  const {
    messages,
    input,
    setInput,
    handleSubmit: chatHandleSubmit,
    isPending,
    clearConversation
  } = useChatHook();

  React.useEffect(() => {
    setIsTyping(isPending);
  }, [isPending]);

  // Handle speech recognition
  const { isRecording, handleVoiceInput } = useSpeechRecognition((transcript) => {
    setInput(transcript);
    handleSubmit({ preventDefault: () => {} } as React.FormEvent);
  });

  // Handle text-to-speech with ElevenLabs
  const conversation = useConversation({
    apiKey: elevenlabsKey,
    overrides: {
      tts: {
        voiceId: "XB0fDUnXU5powFXDhCwa", // Charlotte - polska wymowa
      },
    },
    onError: (error) => {
      console.error('ElevenLabs error:', error);
    },
  });

  const handleStopSpeaking = () => {
    conversation.endSession();
  };

  // Handle suggestion clicks
  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
    handleSubmit({ preventDefault: () => {} } as React.FormEvent);
  };

  // Save chat history to a text file
  const handleSaveHistory = () => {
    const historyText = messages
      .map((msg) => {
        const time = new Date(msg.timestamp).toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit" });
        return `[${time}] ${msg.role === "user" ? "Użytkownik" : "Asystent"}: ${msg.content}`;
      })
      .join("\n\n");

    const blob = new Blob([historyText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `chat-history-${new Date().toISOString().slice(0, 19).replace(/:/g, "-")}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Wrapper for handleSubmit that ensures e.preventDefault() is called
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    chatHandleSubmit(e);
  };

  // Handle initial query from URL params
  React.useEffect(() => {
    const handleInitialQuery = (event: CustomEvent<string>) => {
      setInput(event.detail);
      handleSubmit({ preventDefault: () => {} } as React.FormEvent);
    };

    window.addEventListener('setInitialQuery', handleInitialQuery as EventListener);
    return () => {
      window.removeEventListener('setInitialQuery', handleInitialQuery as EventListener);
    };
  }, [setInput]);

  const value = {
    messages,
    input,
    setInput,
    handleSubmit,
    isPending,
    isRecording,
    handleVoiceInput,
    clearConversation,
    isSpeaking: conversation.isSpeaking,
    handleStopSpeaking,
    handleSaveHistory,
    isTyping,
    handleSuggestionClick
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
