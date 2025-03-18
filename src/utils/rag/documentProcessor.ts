
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { extractMainTopics } from './topicExtractor';
import { extractKeyMetrics } from './metricsExtractor';

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

    const mainTopics = await extractMainTopics(text);
    console.log('Wyodrębnione główne tematy:', mainTopics);
    
    // Extract key metrics if available
    const metrics = await extractKeyMetrics(text);

    return {
      message: `Dokument został przetworzony na ${documentChunks.length} fragmentów`,
      chunks: documentChunks,
      topics: mainTopics,
      metrics
    };
  } catch (error) {
    console.error("Błąd podczas przetwarzania dokumentu:", error);
    throw error;
  }
};
