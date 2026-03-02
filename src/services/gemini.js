import { GoogleGenerativeAI } from "@google/generative-ai";

const PROMPT = `
Przeanalizuj to zdjęcie karty drogowej kierowcy. Wyodrębnij dane do JSON.
Zwróć TYLKO czysty obiekt JSON bez znaczników markdown.

Dla nagłówka:
- driverName
- registrationNumber (np. P2 4K36S)
- trailerNumber

Dla tabeli (rows - tablica obiektów):
- date (Dzień.Miesiąc)
- arrivalTime (Godzina przyjazdu)
- departureTime (Godzina odjazdu)
- postcode
- city (Miejscowość)
- company (Firma)
- loading (boolean - czy zaznaczone w rubryce 'zał')
- unloading (boolean - czy zaznaczone w rubryce 'roz')
- exchange (boolean - czy zaznaczone w rubryce 'wym')
- border (boolean - czy zaznaczone w rubryce 'gra')
- stoppage (boolean - czy zaznaczone w rubryce 'pos')
- notes (Uwagi)
- tons (Tony)
- fuelDkv, fuelIds, fuelLotos, fuelAdBlue (Tankowanie w litrach)
- odometer (stan licznika)

Ważne: Wartości liczbowe odczytaj uważnie. Jeśli brakuje danych, wpisz pusty ciąg.
`;

export async function analyzeKarta(file, apiKey) {
    if (!apiKey) throw new Error("Brak klucza API Gemini");

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

    const reader = new FileReader();
    const fileData = await new Promise((resolve) => {
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.readAsDataURL(file);
    });

    const result = await model.generateContent([
        PROMPT,
        {
            inlineData: {
                data: fileData,
                mimeType: file.type
            }
        }
    ]);

    const response = await result.response;
    const text = response.text();

    try {
        // Clean potential markdown artifacts
        const cleanedJson = text.replace(/```json|```/g, "").trim();
        return JSON.parse(cleanedJson);
    } catch (e) {
        console.error("Błąd parsowania AI:", text);
        throw new Error("Nie udało się sparsować wyników z AI. Spróbuj wyraźniejszego zdjęcia.");
    }
}
