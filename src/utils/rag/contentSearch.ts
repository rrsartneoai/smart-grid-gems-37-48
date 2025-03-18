
import { getDocumentChunks } from './documentProcessor';
import { calculateTFIDF } from '../searchUtils';

export const searchRelevantChunks = (query: string): string[] => {
  console.log('Szukam fragmentów dla zapytania:', query);
  
  const documentChunks = getDocumentChunks();
  if (documentChunks.length === 0) {
    console.log("Brak przetworzonych dokumentów w pamięci");
    return [];
  }

  if (query.toLowerCase() === 'podsumuj') {
    console.log('Zapytanie o podsumowanie - zwracam wszystkie fragmenty');
    return documentChunks.map(chunk => chunk.text);
  }

  const results = calculateTFIDF(
    query,
    documentChunks.map(chunk => chunk.text)
  );

  return results.slice(0, 3).map(result => result.text);
};
