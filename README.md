# Karta Drogowa AI - PWA

Inteligentny asystent kierowcy zawodowego. Aplikacja PWA wykorzystująca model **Gemini 2.5 Flash Lite** do analizy odręcznie wypisanych kart drogowych.

## Główni Funkcjonalności:
- **Analiza AI**: Rozpoznawanie pisma ręcznego ze zdjęć kart drogowych.
- **Automatyczne Obliczenia**: Wyliczanie przejechanych kilometrów, sumy paliwa oraz średniego spalania (L/100km).
- **Generator PDF Premium**: Tworzenie profesjonalnych raportów PDF z polskimi znakami, kolorowym nagłówkiem i podsumowaniem.
- **Historia**: Zapisywanie i edycja poprzednich kart drogowych w pamięci lokalnej.
- **Responsywność**: Wygodny układ kartowy (Card View) na urządzeniach mobilnych.

## Technologie:
- React + Vite
- Gemini AI (Google Generative AI SDK)
- jsPDF + jspdf-autotable
- Lucide React (Ikony)
- PWA (Vite Plugin PWA)

## Konfiguracja:
1. Sklonuj repozytorium.
2. Uruchom `npm install`.
3. Dodaj swój klucz API Gemini w ustawieniach aplikacji.
4. Uruchom projekt: `npm run dev`.

---
*Projekt stworzony z myślą o ułatwieniu pracy kierowcom zawodowym.*
