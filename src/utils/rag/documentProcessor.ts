
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { extractMainTopics } from './topicExtractor';
import { extractKeyMetrics } from './metricsExtractor';
import { toast } from "@/hooks/use-toast";

export interface DocumentChunk {
  text: string;
  metadata?: Record<string, any>;
}

let documentChunks: DocumentChunk[] = [];

export const getDocumentChunks = (): DocumentChunk[] => {
  return documentChunks;
};

export const processDocumentForRAG = async (text: string) => {
  try {
    console.log('Rozpoczynam przetwarzanie dokumentu dla RAG, długość tekstu:', text.length);

    if (!text || text.length < 10) {
      console.warn('Tekst jest zbyt krótki do przetworzenia:', text);
      toast({
        title: "Uwaga",
        description: "Dokument zawiera zbyt mało tekstu do analizy.",
        duration: 3000,
      });
      return {
        message: "Dokument zawiera zbyt mało tekstu do analizy",
        chunks: [],
        topics: ["Brak wystarczających danych", "Dokument zbyt krótki", "Spróbuj wgrać pełny dokument", 
                "Analiza niemożliwa", "Brak treści", "Za mało tekstu", "Potrzebne więcej danych", "Dokument niekompletny"],
        metrics: { error: "Brak wystarczających danych do analizy" }
      };
    }

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    const chunks = await splitter.createDocuments([text]);
    documentChunks = chunks.map(chunk => ({
      text: chunk.pageContent,
      metadata: chunk.metadata,
    }));

    console.log(`Dokument przetworzony na ${documentChunks.length} fragmentów`);

    let mainTopics;
    let metrics;
    
    try {
      // Extract topics
      mainTopics = await extractMainTopics(text);
      console.log('Wyodrębnione główne tematy:', mainTopics);
    } catch (topicError) {
      console.error('Błąd podczas ekstrakcji tematów:', topicError);
      mainTopics = ["Analiza dokumentu", "Przetwarzanie treści", "Wyodrębnianie informacji", 
                    "Dane tekstowe", "Dokumentacja", "Przegląd zawartości", "Klasyfikacja treści", "Dokument źródłowy"];
      
      toast({
        title: "Informacja",
        description: "Nie udało się wyodrębnić tematów. Używam domyślnych.",
        duration: 3000,
      });
    }
    
    try {
      // Extract metrics
      metrics = await extractKeyMetrics(text);
    } catch (metricsError) {
      console.error('Błąd podczas ekstrakcji metryk:', metricsError);
      metrics = { error: "Wystąpił błąd podczas analizy metryk" };
    }

    return {
      message: `Dokument został przetworzony na ${documentChunks.length} fragmentów`,
      chunks: documentChunks,
      topics: mainTopics,
      metrics
    };
  } catch (error) {
    console.error("Błąd podczas przetwarzania dokumentu:", error);
    toast({
      variant: "destructive",
      title: "Błąd przetwarzania",
      description: "Wystąpił problem z przetwarzaniem dokumentu. Spróbuj ponownie.",
      duration: 5000,
    });
    
    return {
      message: "Wystąpił błąd podczas przetwarzania dokumentu",
      chunks: [],
      topics: ["Błąd przetwarzania", "Problem analizy", "Dokument nieobsługiwany", 
               "Spróbuj ponownie", "Inny format", "Niepowodzenie", "Sprawdź dokument", "Potrzebna pomoc"],
      metrics: { error: "Wystąpił błąd podczas analizy dokumentu" }
    };
  }
};
