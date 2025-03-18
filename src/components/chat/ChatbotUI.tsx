
import { useState, useEffect } from "react";
import { ChatContainer } from "./ChatContainer";
import { MessageList } from "./MessageList";
import { InsightsPanel } from "./insights/InsightsPanel";
import { useToast } from "@/hooks/use-toast";
import { useChat } from "@/contexts/ChatContext";

export function ChatbotUI() {
  const { toast } = useToast();
  const [elevenlabsKey, setElevenlabsKey] = useState(() => localStorage.getItem('ELEVENLABS_API_KEY') || '');

  // Check if user has set ElevenLabs API key
  useEffect(() => {
    const hasElevenlabsKey = !!elevenlabsKey;
    if (!hasElevenlabsKey) {
      console.log('Brak klucza API ElevenLabs - funkcja odtwarzania głosowego nie będzie działać bez klucza');
    }
  }, [elevenlabsKey]);

  const {
    messages,
    input,
    setInput,
    handleSubmit,
    isPending,
    isRecording,
    handleVoiceInput,
    clearConversation,
    isSpeaking,
    handleStopSpeaking,
    handleSaveHistory,
    isTyping,
    handleSuggestionClick
  } = useChat();

  return (
    <div className="space-y-4">
      <InsightsPanel />

      <ChatContainer
        isSpeaking={isSpeaking}
        isTyping={isTyping}
        onStopSpeaking={handleStopSpeaking}
        onSaveHistory={handleSaveHistory}
        input={input}
        setInput={setInput}
        handleSubmit={handleSubmit}
        handleVoiceInput={handleVoiceInput}
        handleClearConversation={clearConversation}
        isRecording={isRecording}
        isPending={isPending}
      >
        <MessageList 
          messages={messages}
          isTyping={isTyping}
          onSuggestionClick={handleSuggestionClick}
        />
      </ChatContainer>
      
      {!localStorage.getItem('ELEVENLABS_API_KEY') && (
        <div className="text-yellow-500 text-sm">
          Funkcja odtwarzania głosowego jest niedostępna
        </div>
      )}
    </div>
  );
}
