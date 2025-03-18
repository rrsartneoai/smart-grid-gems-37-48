
import { useRef } from 'react';
import { useToast } from "@/hooks/use-toast";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export function useSpacesExport() {
  const { toast } = useToast();
  const spacesRef = useRef<HTMLDivElement>(null);

  const handleExport = async (format: 'pdf' | 'jpg') => {
    if (!spacesRef.current) return;

    try {
      const canvas = await html2canvas(spacesRef.current);
      
      if (format === 'pdf') {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('przestrzenie-export.pdf');
        
        toast({
          title: "Eksport zakończony",
          description: "Plik PDF został pobrany",
        });
      } else {
        const link = document.createElement('a');
        link.download = 'przestrzenie-export.jpg';
        link.href = canvas.toDataURL('image/jpeg');
        link.click();
        
        toast({
          title: "Eksport zakończony",
          description: "Plik JPG został pobrany",
        });
      }
    } catch (error) {
      console.error('Export failed:', error);
      toast({
        title: "Błąd eksportu",
        description: "Nie udało się wyeksportować sekcji",
        variant: "destructive",
      });
    }
  };

  return { spacesRef, handleExport };
}
