// FIX: Corrected the import path for the Google Gemini API SDK.
import { GoogleGenAI, Type } from "@google/genai";
import { ReliefEntry } from "../types";
import { Language } from '../contexts/LanguageContext';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const getLanguageInstructions = (language: Language) => {
  switch (language) {
    case 'zhCN':
      return {
        outputLanguage: "Simplified Chinese (简体中文)",
        categoryExamples: "食品, 饮用水, 医疗, 交通, 衣物, 住宿",
        itemExamples: "睡袋, 对乙酰氨基酚, 便当",
        quantityExamples: "50 盒, 2 人",
        unknown: "不明",
        none: "无",
        cantoneseNorm: "Convert colloquial Cantonese terms to standard written Simplified Chinese where appropriate for clarity (e.g., 'Van仔' -> '客货车', '饭盒' -> '便当', '尿片' -> '纸尿片')."
      };
    case 'en':
      return {
        outputLanguage: "English",
        categoryExamples: "Food, Drinking Water, Medical, Transport, Clothing, Shelter",
        itemExamples: "Sleeping Bag, Paracetamol, Lunch Box",
        quantityExamples: "50 boxes, 2 people",
        unknown: "Unknown",
        none: "None",
        cantoneseNorm: "Translate Cantonese terms to English (e.g., 'Van仔' -> 'Van', '飯盒' -> 'Lunch Box')."
      };
    case 'zhHK':
    default:
      return {
        outputLanguage: "Traditional Chinese (繁體中文)",
        categoryExamples: "食品, 飲用水, 醫療, 交通, 衣物, 住宿",
        itemExamples: "睡袋, 必理痛, 便當",
        quantityExamples: "50 盒, 2 人",
        unknown: "不明",
        none: "無",
        cantoneseNorm: "Convert colloquial Cantonese terms to standard written Chinese where appropriate for clarity (e.g., 'Van仔' -> '客貨車', '飯盒' -> '便當', '尿片' -> '紙尿片')."
      };
  }
};

export const parseMessageToEntries = async (message: string, language: Language): Promise<ReliefEntry[]> => {
  const langInstructions = getLanguageInstructions(language);

  const responseSchema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        type: {
          type: Type.STRING,
          enum: ["NEED", "OFFER"],
        },
        category: {
          type: Type.STRING,
          description: `Category of the item in ${langInstructions.outputLanguage} (e.g., ${langInstructions.categoryExamples}).`,
        },
        item: {
          type: Type.STRING,
          description: `Specific item name in ${langInstructions.outputLanguage} (e.g., ${langInstructions.itemExamples}).`,
        },
        quantity: {
          type: Type.STRING,
          description: `Amount or quantity in ${langInstructions.outputLanguage} (e.g., ${langInstructions.quantityExamples}). Use '${langInstructions.unknown}' if not specified.`,
        },
        location: {
          type: Type.STRING,
          description: `Specific location in ${langInstructions.outputLanguage}.`,
        },
        contactInfo: {
          type: Type.STRING,
          description: `Phone number, name, or social handle. Use '${langInstructions.none}' if not present.`,
        },
        urgency: {
          type: Type.STRING,
          enum: ["HIGH", "MEDIUM", "LOW"],
        },
      },
      required: ["type", "category", "item", "quantity", "location", "contactInfo", "urgency"],
    },
  };

  try {
    const prompt = `
      You are an emergency coordination AI for the Tai Po fire incident in Hong Kong.
      Analyze the following unstructured text, which may be in Cantonese, Traditional Chinese, or English.
      Extract specific needs or offers. A single message might contain multiple items.
      Return a JSON array of objects.

      IMPORTANT GUIDELINES:
      1. **Language**: All extracted text fields MUST be in ${langInstructions.outputLanguage}.
      2. **Locations**: 
         - Pay close attention to Tai Po specific landmarks and abbreviations.
         - Examples: "廣福" -> "廣福邨", "運頭塘" -> "運頭塘社區中心", "大中" -> "大埔中心", "火車站" -> "大埔墟站", "那打素" -> "那打素醫院".
         - Translate these locations to the target language if necessary.
      3. **Contacts**: 
         - Aggressively look for phone numbers.
         - Capture names associated with numbers.
      4. **Normalization**: ${langInstructions.cantoneseNorm}

      Input Text:
      "${message}"
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: { parts: [{ text: prompt }] },
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.1,
      },
    });

    const rawData = JSON.parse(response.text || "[]");
    
    return rawData.map((item: any) => ({
      ...item,
      id: crypto.randomUUID(),
      status: 'PENDING',
      timestamp: Date.now(),
      originalMessage: message,
    }));

  } catch (error) {
    console.error("Gemini parsing error:", error);
    return [];
  }
};