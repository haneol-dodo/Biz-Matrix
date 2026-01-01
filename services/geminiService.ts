
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

const API_KEY = process.env.API_KEY || "";

const decodePrompt = (b64: string): string => {
  try {
    const binString = atob(b64);
    const bytes = Uint8Array.from(binString, (c) => c.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  } catch (e) {
    console.error("Prompt decoding failed:", e);
    return "";
  }
};

// 난독화된 시스템 인스트럭션: 비즈니스 모델 혁신 컨설턴트 역할 및 프레임워크 정의
const ENCODED_SYSTEM_INSTRUCTION = "64m57Iug7J2AICfruYTrp4TrioTsiqQg66qo6Z2YIO2Ygeq1rCDsuqjshKTrpY3tirUn7ZTrp4Trp4TshJzripTrp6Qg7IKs7JeF7J6Q6rCA6rCAIOyeheuugfztmZwg67aE7JW866W8IOu2hOyEneyVmOyXrCAzeDMg66un7Yq466as7IqkIO2YleqDneyXmCDqtazsspTsnIEg7IKs7JeFIOyVhOydtOuUkeyWtCA56rCA7KeA66W8IOygnOyViO2VmOyLnOyYpC4g66qo6Z2YIOycoO2YlTog7IKs7KCE7ZiVLCDssL3slpXqsIDtmU0sIOyghOunseqrA7ZalLiDtmgeq1rCDsoITrnanog7snrjssYDrkyTrp60sIOuUprime2NoOunpSwg7ISc67mE7YOA7J207KCc7J207IWYLiDrqqOuToCDri7Xrs4DripQg7ZWc6rWt7Ja066GcIOyekOyEse2VmOyEuOyalS4=";

export const generateBusinessIdeas = async (field: string): Promise<AnalysisResult> => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  const systemInstruction = decodePrompt(ENCODED_SYSTEM_INSTRUCTION);

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: `분석할 분야: "${field}"`,
    config: {
      systemInstruction: systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          matrix: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                strategy: { type: Type.STRING },
                survival: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    description: { type: Type.STRING }
                  },
                  required: ["name", "description"]
                },
                entrepreneur: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    description: { type: Type.STRING }
                  },
                  required: ["name", "description"]
                },
                expert: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    description: { type: Type.STRING }
                  },
                  required: ["name", "description"]
                }
              },
              required: ["strategy", "survival", "entrepreneur", "expert"]
            }
          },
          logicBreakdown: {
            type: Type.OBJECT,
            properties: {
              unbundling: {
                type: Type.OBJECT,
                properties: {
                  dimension: { type: Type.STRING },
                  steps: { type: Type.STRING },
                  discarded: { type: Type.STRING }
                },
                required: ["dimension", "steps", "discarded"]
              },
              decoupling: {
                type: Type.OBJECT,
                properties: {
                  cvc: { type: Type.STRING },
                  painPoint: { type: Type.STRING },
                  discarded: { type: Type.STRING }
                },
                required: ["cvc", "painPoint", "discarded"]
              },
              servitization: {
                type: Type.OBJECT,
                properties: {
                  product: { type: Type.STRING },
                  state: { type: Type.STRING },
                  transformation: { type: Type.STRING }
                },
                required: ["product", "state", "transformation"]
              }
            },
            required: ["unbundling", "decoupling", "servitization"]
          }
        },
        required: ["matrix", "logicBreakdown"]
      }
    }
  });

  if (!response.text) throw new Error("Gemini로부터 응답을 받지 못했습니다.");
  return JSON.parse(response.text.trim()) as AnalysisResult;
};
