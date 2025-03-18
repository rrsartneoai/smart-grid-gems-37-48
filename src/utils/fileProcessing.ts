
import * as pdfjs from 'pdfjs-dist';
import mammoth from 'mammoth';
import Tesseract from 'tesseract.js';
import { parse } from 'papaparse';

// Initialize PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.mjs';

export const processImageFile = async (file: File): Promise<string> => {
  try {
    console.log('Rozpoczynam przetwarzanie obrazu:', file.name);
    const result = await Tesseract.recognize(file, 'pol');
    console.log('Zakończono przetwarzanie obrazu, wyodrębniony tekst:', result.data.text.substring(0, 100) + '...');
    return result.data.text;
  } catch (error) {
    console.error('Błąd podczas przetwarzania obrazu:', error);
    throw error;
  }
};

export const processPdfFile = async (file: File): Promise<string> => {
  try {
    console.log('Rozpoczynam przetwarzanie PDF:', file.name);
    const arrayBuffer = await file.arrayBuffer();
    
    const loadingTask = pdfjs.getDocument({
      data: arrayBuffer,
      isEvalSupported: false,
      useSystemFonts: true,
      disableFontFace: true
    });
    
    const pdf = await loadingTask.promise;
    let fullText = '';
    
    console.log(`PDF ma ${pdf.numPages} stron`);
    
    for (let i = 1; i <= pdf.numPages; i++) {
      console.log(`Przetwarzam stronę ${i}/${pdf.numPages}`);
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      fullText += pageText + '\n';
    }
    
    console.log('Zakończono przetwarzanie PDF, wyodrębniony tekst:', fullText.substring(0, 100) + '...');
    return fullText;
  } catch (error) {
    console.error('Błąd podczas przetwarzania PDF:', error);
    throw error;
  }
};

export const processDocxFile = async (file: File): Promise<string> => {
  try {
    console.log('Rozpoczynam przetwarzanie DOCX:', file.name);
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    console.log('Zakończono przetwarzanie DOCX, wyodrębniony tekst:', result.value.substring(0, 100) + '...');
    return result.value;
  } catch (error) {
    console.error('Błąd podczas przetwarzania DOCX:', error);
    throw error;
  }
};

export const processCsvFile = async (file: File): Promise<string> => {
  try {
    console.log('Rozpoczynam przetwarzanie CSV:', file.name);
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        try {
          const csv = event.target?.result as string;
          
          if (!csv) {
            reject(new Error('Nie udało się odczytać pliku CSV'));
            return;
          }
          
          const results = parse(csv, {
            header: true,
            skipEmptyLines: true
          });
          
          // Convert to readable text format
          let resultText = '';
          
          // Add headers as a first line
          if (results.meta.fields && results.meta.fields.length > 0) {
            resultText += results.meta.fields.join(', ') + '\n';
          }
          
          // Add data rows
          results.data.forEach((row: any) => {
            const values = Object.values(row).map(val => String(val || ''));
            resultText += values.join(', ') + '\n';
          });
          
          console.log('Zakończono przetwarzanie CSV, wyodrębniony tekst:', resultText.substring(0, 100) + '...');
          resolve(resultText);
        } catch (error) {
          console.error('Błąd podczas parsowania CSV:', error);
          reject(error);
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Nie udało się odczytać pliku CSV'));
      };
      
      reader.readAsText(file);
    });
  } catch (error) {
    console.error('Błąd podczas przetwarzania CSV:', error);
    throw error;
  }
};

export const processTextFile = async (file: File): Promise<string> => {
  try {
    console.log('Rozpoczynam przetwarzanie pliku tekstowego:', file.name);
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        const text = event.target?.result as string;
        
        if (!text) {
          reject(new Error('Nie udało się odczytać pliku tekstowego'));
          return;
        }
        
        console.log('Zakończono przetwarzanie pliku tekstowego, wyodrębniony tekst:', text.substring(0, 100) + '...');
        resolve(text);
      };
      
      reader.onerror = () => {
        reject(new Error('Nie udało się odczytać pliku tekstowego'));
      };
      
      reader.readAsText(file);
    });
  } catch (error) {
    console.error('Błąd podczas przetwarzania pliku tekstowego:', error);
    throw error;
  }
};
