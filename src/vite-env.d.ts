
/// <reference types="vite/client" />

interface Window {
  SpeechRecognition: any;
  webkitSpeechRecognition: any;
  lovable?: {
    select: (element: HTMLElement) => void;
  };
}
