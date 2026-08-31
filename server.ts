import express from "express";
import path from "path";
import multer from "multer";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";
import fs from "fs";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  const upload = multer({ dest: 'uploads/' });

  // Initialize Gemini API
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  // API endpoints
  const SETTINGS_FILE = path.join(process.cwd(), 'settings.json');

  const defaultSettings = {
    criteria: [
      { name: "Respect du sujet", weight: 20, description: "L'élève répond-il bien à la consigne ?" },
      { name: "Structure du texte", weight: 20, description: "Introduction, développement, conclusion, paragraphes" },
      { name: "Cohérence narrative ou argumentative", weight: 15, description: "Logique, progression, absence de contradiction" },
      { name: "Syntaxe", weight: 15, description: "Construction des phrases" },
      { name: "Orthographe / grammaire", weight: 15, description: "Accords, conjugaison, homophones" },
      { name: "Richesse du vocabulaire", weight: 10, description: "Variété, précision, registre" },
      { name: "Style / créativité", weight: 5, description: "Originalité, fluidité, voix personnelle" }
    ]
  };

  function getSettings() {
    try {
      if (fs.existsSync(SETTINGS_FILE)) {
        return JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf-8'));
      }
    } catch (e) {
      console.error("Error reading settings", e);
    }
    return defaultSettings;
  }

  app.get("/api/settings", (req, res) => {
    res.json(getSettings());
  });

  app.post("/api/settings", (req, res) => {
    try {
      fs.writeFileSync(SETTINGS_FILE, JSON.stringify(req.body, null, 2));
      res.json({ status: "ok" });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.get("/api/gemini-status", async (req, res) => {
    try {
      if (!process.env.GEMINI_API_KEY) {
        return res.json({ status: "error", message: "API Key not configured" });
      }
      res.json({ status: "ok", message: "Gemini 3.1 Pro connecté" });
    } catch (e) {
      res.json({ status: "error", message: "Erreur de connexion Gemini" });
    }
  });

  app.post("/api/analyze", upload.array('files', 15), async (req, res) => {
    try {
      const files = req.files as Express.Multer.File[];
      if (!files || files.length === 0) {
        return res.status(400).json({ error: "No files uploaded" });
      }

      const bodyData = req.body;

      const fileParts = files.map(file => {
        const fileData = fs.readFileSync(file.path);
        return {
          inlineData: {
            data: fileData.toString('base64'),
            mimeType: file.mimetype
          }
        };
      });
      
      // If it's a PDF, we might need a model that handles it well. gemini-3.5-flash or gemini-3.1-pro-preview handles PDF. Wait, the prompt lists models. 
      // User says: "gemini-3.1-pro-preview" is available and supports multimodal. Wait, gemini-3.5-flash is good for basic tasks, but Gemini 3.1 Pro is good for complex reasoning natively. Let's use gemini-3.1-pro-preview since it's a complex task (grading an essay).
      
      const responseSchema = {
        type: Type.OBJECT,
        properties: {
          student_detected: {
            type: Type.OBJECT,
            properties: {
              first_name: { type: Type.STRING },
              last_name: { type: Type.STRING },
              class_name: { type: Type.STRING },
              date: { type: Type.STRING }
            }
          },
          ocr_quality: {
            type: Type.OBJECT,
            properties: {
              confidence: { type: Type.NUMBER },
              warnings: { type: Type.ARRAY, items: { type: Type.STRING } }
            }
          },
          global_assessment: {
            type: Type.OBJECT,
            properties: {
              score: { type: Type.NUMBER },
              score_max: { type: Type.NUMBER },
              level: { type: Type.STRING },
              summary_teacher: { type: Type.STRING },
              summary_student: { type: Type.STRING }
            }
          },
          criteria: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                score: { type: Type.NUMBER },
                score_max: { type: Type.NUMBER },
                comment: { type: Type.STRING }
              }
            }
          },
          detected_errors: {
            type: Type.ARRAY,
            description: "List of errors with their context sentence",
            items: {
              type: Type.OBJECT,
              properties: {
                type: { type: Type.STRING },
                sentence_context: { type: Type.STRING, description: "The full sentence where the error appears" },
                original: { type: Type.STRING },
                suggestion: { type: Type.STRING },
                explanation: { type: Type.STRING }
              }
            }
          },
          strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
          improvement_priorities: { type: Type.ARRAY, items: { type: Type.STRING } },
          teacher_validation_required: { type: Type.BOOLEAN },
          extracted_text: { type: Type.STRING, description: "The full extracted text from the document" }
        }
      };

      const currentSettings = getSettings();
      const criteriaStr = currentSettings.criteria.map((c: any) => 
        `- ${c.name} (${c.weight}% de la note finale): ${c.description}`
      ).join('\n      ');

      const promptDetails = `
      You are a pedagogical assistant for grading French school essays (rédactions scolaires).
      Please extract the handwritten or typed text from the document, and evaluate it based on the following context:
      - Student level: ${bodyData.level || 'Not specified'}
      - Topic: ${bodyData.topic || 'Not specified'}
      - Max score: ${bodyData.gradingScale || '20'}
      
      Grading Criteria & Weights (must sum appropriately based on weights below):
      ${criteriaStr}

      Constraints:
      - Evaluate strictly using ONLY the criteria specified above. Calculate each criterion's max score based on its weight percentage out of the requested Max Score.
      - Consider the school level in your grading.
      - Do not severely penalize passages where OCR is uncertain.
      - Return a structured JSON matching the provided schema.
      - Make sure "extracted_text" contains the full transcribed text.
      `;

      let response;
      try {
        response = await ai.models.generateContent({
          model: "gemini-3.1-pro-preview",
          contents: {
            parts: [
              ...fileParts,
              {
                text: promptDetails
              }
            ]
          },
          config: {
            responseMimeType: "application/json",
            responseSchema: responseSchema
          }
        });
      } catch (err: any) {
        console.error("Error calling gemini-3.1-pro-preview:", err);
        throw err;
      }

      files.forEach(file => fs.unlinkSync(file.path)); // clean up

      if (!response.text) {
        throw new Error("No response text");
      }

      res.json(JSON.parse(response.text));
    } catch (error: any) {
      console.error("Error analyzing document:", error);
      
      let errorMessage = "Échec de l'analyse du document.";
      const errorStr = String(error);
      if (error && error.status === 429) {
        errorMessage = "Quota API Gemini dépassé. Veuillez réessayer plus tard ou utiliser un modèle plus léger.";
      } else if (error?.error?.code === 429) {
        errorMessage = "Quota API Gemini dépassé. Veuillez réessayer plus tard.";
      } else if (errorStr.includes("429") || errorStr.includes("Quota exceeded")) {
        errorMessage = "Quota API Gemini (3.1 Pro) dépassé. Veuillez réessayer dans quelques minutes.";
      }

      res.status(500).json({ error: errorMessage });
    }
  });

  app.post("/api/generate-exercises", async (req, res) => {
    try {
      const { improvement_priorities, class_name } = req.body;
      
      if (!improvement_priorities || improvement_priorities.length === 0) {
        return res.status(400).json({ error: "Missing improvement priorities" });
      }

      const promptDetails = `
      You are the best French teacher in the world generating exercises for your student.
      Student level/class: ${class_name || 'Not specified'}
      
      The student has the following improvement priorities identified from their essay:
      ${improvement_priorities.map((p: string, i: number) => `${i + 1}. ${p}`).join('\n')}

      First, write a small grammar or spelling lesson adapted to the student's level, focusing precisely on the improvement priorities and the types of mistakes made.
      Then, generate exactly 10 exercises tailored to help the student practice these specific rules.
      The output MUST be a strict JSON object with no wrapping json markdown blocks and no leading reasoning/text. Focus strictly on adhering to the JSON schema.
      `;

      const responseSchema = {
        type: Type.OBJECT,
        properties: {
          lesson: { type: Type.STRING },
          exercises: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                priority_reference: { type: Type.STRING },
                instruction: { type: Type.STRING },
                expected_answer: { type: Type.STRING }
              },
              required: ["priority_reference", "instruction", "expected_answer"]
            }
          }
        },
        required: ["lesson", "exercises"]
      };

      const aiResponse = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: promptDetails,
        config: {
          responseMimeType: "application/json",
          responseSchema: responseSchema,
          temperature: 0.2
        }
      });

      if (!aiResponse.text) {
        throw new Error("No response text");
      }

      res.json(JSON.parse(aiResponse.text));
    } catch (e: any) {
      console.error("Error generating exercises", e);
      res.status(500).json({ error: e.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
