# Smart Grid & Air Quality Dashboard - Instrukcja obsługi

Cel repozytorium

Repozytorium Smart Grid & Air Quality Dashboard zostało zaprojektowane w celu monitorowania jakości powietrza i zużycia energii. Wykorzystując zaawansowane algorytmy AI, system analizuje dane, aby zapewnić inteligentne wsparcie w podejmowaniu decyzji. Repozytorium zawiera kompleksowy plik README, który szczegółowo opisuje konfigurację, funkcjonalności i użytkowanie pulpitu. Obejmuje on sekcje dotyczące inicjowania projektu, kluczowych funkcjonalności, panelu monitorowania jakości powietrza, asystenta AI i przetwarzania dokumentów, map jakości powietrza, rozwiązywania problemów oraz dodatkowych informacji o konfiguracji i licencjonowaniu.

Funkcje i technologie

To repozytorium implementuje zaawansowany system oprogramowania, który integruje kilka kluczowych technologii i funkcji. Wykorzystuje głównie JavaScript i TypeScript, ze szczególnym uwzględnieniem analizy danych opartej na sztucznej inteligencji. Funkcje obejmują główny pulpit nawigacyjny dla wskaźników energii i jakości powietrza, interaktywne mapy, szczegółową analizę danych i monitorowanie stanu urządzeń IoT. Asystent AI jest w stanie wykrywać anomalie, prognozować i generować zalecenia na podstawie analizy danych. System obsługuje również przetwarzanie dokumentów i generowanie raportów, wykorzystując przetwarzanie języka naturalnego (NLP) do analizy tekstu. Ponadto oferuje opcje dostosowywania, takie jak tryb ciemny/jasny, wybór języka i dostęp do samouczka, wraz z możliwościami eksportu danych i spersonalizowanych alertów.

W skrócie:

System Smart Grid & Air Quality Dashboard został opracowany jako narzędzie do monitorowania jakości powietrza i zużycia energii. Wykorzystuje zaawansowane algorytmy AI do analizy danych i zapewnienia użytkownikom inteligentnego wsparcia w podejmowaniu decyzji.

## Spis treści
1. [Uruchomienie projektu](#uruchomienie-projektu)
2. [Główne funkcjonalności](#główne-funkcjonalności)
3. [Panel monitorowania jakości powietrza](#panel-monitorowania-jakości-powietrza)
4. [Asystent AI i przetwarzanie dokumentów](#asystent-ai-i-przetwarzanie-dokumentów)
5. [Mapy jakości powietrza w województwie pomorskim](#mapy-jakości-powietrza-w-województwie-pomorskim)
6. [Rozwiązywanie problemów](#rozwiązywanie-problemów)

## Uruchomienie projektu

online web preview : [https://smart-grid-gems-37-29.lovable.app/](https://smart-grid-gems-37-48.lovable.app/)

### Wymagania wstępne
- Node.js (zalecana wersja 16 lub nowsza)
- npm (menedżer pakietów Node.js)
- Klucz API Google Gemini (dla funkcji asystenta AI)

### Instalacja
1. Sklonuj repozytorium:
   ```bash
   git clone <URL_REPOZYTORIUM>
   cd smart-grid-gems
   ```

2. Zainstaluj zależności:
   ```bash
   npm install
   ```

3. Skonfiguruj klucz API Gemini:
   Możesz to zrobić na dwa sposoby:
   - Kliknij ikonę kluczy w lewym górnym rogu interfejsu i wprowadź swój klucz API
   - Utwórz plik `.env` w głównym katalogu projektu i dodaj linię:
     ```
     VITE_GOOGLE_API_KEY=TWÓJ_KLUCZ_API
     ```

4. Uruchom projekt w trybie deweloperskim:
   ```bash
   npm run dev
   ```

5. Otwórz przeglądarkę i przejdź do adresu: `http://localhost:5173/`

## Główne funkcjonalności

### Nawigacja po systemie
- **Strona główna** - zawiera dashboard ze wskaźnikami zużycia energii i jakości powietrza
- **Zakładki nawigacyjne** - używaj zakładek na górze ekranu do przełączania między różnymi widokami:
  - **Przestrzenie** - główny dashboard z danymi
  - **Mapy jakości powietrza** - interaktywne mapy z danymi Airly
  - **Analiza** - szczegółowa analiza danych
  - **Status** - status urządzeń IoT
  - **Czujniki** - informacje z czujników
  - **Integracje** - opcje integracji z innymi systemami

### Personalizacja interfejsu
- **Tryb ciemny/jasny** - przełącznik w prawym górnym rogu
- **Zmiana języka** - wybór języka w prawym górnym rogu (polski, angielski, niemiecki, ukraiński, rosyjski)
- **Samouczek** - kliknij przycisk "Pokaż samouczek" w prawym dolnym rogu

### Eksport danych
- W zakładce "Przestrzenie" możesz eksportować widok do plików JPG lub PDF za pomocą przycisków na górze sekcji

## Panel monitorowania jakości powietrza

Panel główny zawiera:
- **Statystyki mocy** - wykresy i dane dotyczące zużycia energii
- **Wykres jakości powietrza** - historyczne i bieżące dane o jakości powietrza
- **Status urządzeń** - informacje o stanie urządzeń w sieci
- **Mapa sieci** - wizualizacja sieci energetycznej
- **Analiza awarii** - dane dotyczące awarii i problemów

Możesz wchodzić w interakcję z kafelkami, aby zobaczyć szczegółowe informacje, a także przeciągać je, aby dostosować układ do swoich potrzeb.

## Asystent AI i przetwarzanie dokumentów

Smart Grid & Air Quality Dashboard to nie tylko narzędzie do wizualizacji danych dotyczących jakości powietrza i zużycia energii. Kluczowym elementem systemu jest wbudowany asystent AI, który aktywnie wspiera użytkowników w analizie danych, generowaniu raportów i podejmowaniu świadomych decyzji.  Asystent AI wykorzystuje zaawansowane algorytmy uczenia maszynowego i przetwarzania języka naturalnego (NLP) do:

**1. Inteligentna Analiza Danych:**

*   **Wykrywanie Anomalii:** Asystent AI monitoruje na bieżąco dane dotyczące jakości powietrza i zużycia energii, identyfikując nietypowe wzorce i potencjalne zagrożenia (np. nagły wzrost zanieczyszczeń, nieoczekiwane skoki zużycia energii). Powiadamia użytkowników o wykrytych anomaliach, przyspieszając czas reakcji.
*   **Prognozowanie:** Używając modeli predykcyjnych, asystent AI prognozuje przyszłe wartości wskaźników jakości powietrza i zużycia energii. Umożliwia to proaktywne planowanie i optymalizację zużycia zasobów.
*   **Segmentacja i Grupowanie:** Asystent AI może segmentować dane na podstawie różnych kryteriów (np. lokalizacja, czas, typ odbiorcy) i grupować podobne wzorce zużycia energii lub zanieczyszczeń. Ułatwia to identyfikację obszarów wymagających szczególnej uwagi.
*   **Wskazywanie Korelacji:** Asystent automatycznie identyfikuje korelacje między różnymi danymi, np. wpływ warunków pogodowych na jakość powietrza, czy zależności między zużyciem energii a aktywnością przemysłową.

**2. Przetwarzanie Dokumentów i Generowanie Raportów:**

*   **Automatyczne Generowanie Raportów:** Asystent AI potrafi automatycznie generować raporty na podstawie zgromadzonych danych. Użytkownik może zdefiniować parametry raportu (np. zakres dat, wybrane wskaźniki, format) i wygenerować go jednym kliknięciem.
*   **Ekstrakcja Informacji z Dokumentów:** System może być zintegrowany z modułem przetwarzania dokumentów (np. PDF, DOCX) pozwalającym na automatyczną ekstrakcję kluczowych informacji dotyczących norm prawnych, raportów środowiskowych, czy dokumentacji technicznej.
*   **Analiza Tekstu (NLP):** Dzięki zastosowaniu NLP, asystent AI potrafi analizować treści artykułów naukowych, wiadomości i innych źródeł tekstowych, aby dostarczyć użytkownikom kontekstową wiedzę na temat problemów związanych z jakością powietrza i zużyciem energii.
*   **Summarization:** System może generować krótkie streszczenia długich dokumentów, aby ułatwić użytkownikom szybkie zapoznanie się z kluczowymi informacjami.

**3. Inteligentne Wsparcie Decyzyjne:**

*   **Rekomendacje:** Na podstawie analizy danych i dostępnej wiedzy, asystent AI generuje rekomendacje dotyczące optymalizacji zużycia energii, redukcji emisji zanieczyszczeń i innych działań.
*   **Symulacje:** Asystent AI pozwala na przeprowadzanie symulacji różnych scenariuszy (np. wpływ wprowadzenia nowych technologii, zmiana warunków pogodowych) na jakość powietrza i zużycie energii.
*   **Personalizacja:** Asystent AI uczy się preferencji użytkownika i dostosowuje swoje rekomendacje i interfejs do jego indywidualnych potrzeb.

**Przykłady użycia Asystenta AI:**

*   **Menadżer jakości:** "Pokaż mi raport dotyczący działania czujników w ostatnim kwartale, z uwzględnieniem lokalizacji i typu odbiorcy."
*   **Specjalista ds. Jakości Powietrza:** "Jakie są główne przyczyny wzrostu poziomu ozonu w centrum miasta w ostatnich dniach?"
*   **Użytkownik Domowy / Przemysłowy:** "Poleć mi sposoby na zmniejszenie zużycia energii w moim domu/ w mojej firmie."

Asystent AI jest stale rozwijany i udoskonalany, aby zapewnić użytkownikom coraz bardziej inteligentne i efektywne wsparcie w monitorowaniu i zarządzaniu jakością powietrza oraz zużyciem energii. W przyszłych wersjach planujemy dodać funkcje takie jak:

*   **Integracja z zewnętrznymi bazami danych.**
*   **Rozszerzenie możliwości NLP na inne języki.**
*   **Personalizowane alerty push.**

### Wgrywanie i analiza dokumentów
1. Przewiń na dół strony głównej do sekcji "Wgraj pliki"
2. Przeciągnij i upuść pliki lub kliknij obszar, aby wybrać dokumenty
3. Obsługiwane formaty: PDF, DOCX, TXT, PNG, JPG

### Korzystanie z asystenta AI
1. Po wgraniu dokumentu przejdź do sekcji "Asystent AI"
2. Wpisz pytanie dotyczące zawartości dokumentu lub zagadnień związanych z energią/jakością powietrza
3. Asystent wykorzysta zaawansowaną technologię RAG (Retrieval-Augmented Generation), aby udzielić odpowiedzi bazując na:
   - Wgranych dokumentach
   - Swojej wiedzy ogólnej
   - Danych kontekstowych systemu

Przykładowe pytania:
- "Podsumuj najważniejsze punkty z wgranego dokumentu"
- "Jakie są główne zanieczyszczenia powietrza i ich wpływ na zdrowie?"
- "Jak mogę zoptymalizować zużycie energii w moim domu?"

## Mapy jakości powietrza w województwie pomorskim

Zakładka "Mapy jakości powietrza" zawiera:
- Interaktywną mapę z danymi ze stacji pomiarowych Airly
- Legendę tłumaczącą kolorystykę oznaczeń
- Informacje o aktualnym stanie powietrza w wybranych lokalizacjach

Funkcje mapy:
1. **Przybliżanie i oddalanie** - użyj przycisków + i - lub kółka myszy
2. **Wybór stacji** - kliknij marker, aby zobaczyć szczegółowe dane
3. **Zmiana widoku mapy** - użyj kontrolek w prawym górnym rogu mapy

## Rozwiązywanie problemów

### Problemy z wczytywaniem mapy
Jeśli mapa nie wyświetla się poprawnie:
- Upewnij się, że masz stabilne połączenie z internetem
- Spróbuj odświeżyć stronę
- Wyczyść pamięć podręczną przeglądarki

### Problemy z asystentem AI
Jeśli asystent AI nie działa poprawnie:
- Sprawdź, czy wprowadziłeś poprawny klucz API Gemini
- Upewnij się, że masz połączenie z internetem
- Sprawdź wielkość wgranego dokumentu (maksymalny rozmiar to 10MB)
- Sprawdź w konsoli przeglądarki (F12) czy nie ma błędów

### Kontakt i wsparcie
Jeśli napotkasz problemy techniczne lub masz pytania dotyczące systemu:
- Sprawdź dokumentację techniczną
- Skontaktuj się z administratorem systemu

## Licencja i informacje dodatkowe

System Smart Grid & Air Quality Dashboard został opracowany jako narzędzie do monitorowania jakości powietrza i zużycia energii. Wykorzystuje zaawansowane algorytmy AI do analizy danych i zapewnienia użytkownikom inteligentnego wsparcia w podejmowaniu decyzji.

---

© 2024 Smart Grid & Air Quality Dashboard

## Konfiguracja

1. Skopiuj plik `.env.example` do `.env`:
```bash
cp .env.example .env
```

2. Uzupełnij zmienne środowiskowe w pliku `.env`:
- `VITE_ELEVENLABS_API_KEY` - klucz API do ElevenLabs (wymagany dla funkcji odtwarzania głosowego)

## Funkcje opcjonalne

### Odtwarzanie głosowe
Funkcja odtwarzania głosowego wymaga klucza API ElevenLabs. Możesz go uzyskać na stronie [ElevenLabs](https://elevenlabs.io/).

Działą!
