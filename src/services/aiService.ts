import type { ChatbotKnowledge } from '../context/DbContext';
import { supabase } from './supabase';

export interface ChatResponse {
  message: string;
  suggestedAction?: {
    type: 'link' | 'prompt';
    label: string;
    value: string;
  };
}

// =====================================================================
// MEDICAL-ONLY SYSTEM PROMPT FOR GPT
// Strictly restricts the AI to medical/health topics only
// =====================================================================

const MEDICAL_SYSTEM_PROMPT = `You are Medora AI, an advanced clinical health intelligence assistant integrated into the Medora AI healthcare platform.

STRICT RULES — FOLLOW EXACTLY:
1. MEDICAL TOPICS ONLY: You ONLY discuss health, medicine, wellness, symptoms, anatomy, pharmacology, nutrition, mental health, clinical procedures, medical terminology, and healthcare-related subjects.
2. OFF-TOPIC REFUSAL: If the user asks about anything unrelated to health or medicine (e.g., coding, politics, entertainment, finance, sports, general knowledge), respond ONLY with: "I'm your dedicated medical AI assistant. I can only help with health and medical questions. Is there anything about your health I can assist with?"
3. NO DIAGNOSIS: You provide general health education only. Never diagnose specific conditions or prescribe medications. Always recommend consulting a licensed physician for diagnosis and treatment.
4. EMERGENCY PROTOCOL: For any life-threatening symptoms (chest pain, difficulty breathing, stroke signs, severe bleeding, unconsciousness), immediately direct the user to call emergency services (911 / 112).
5. DISCLAIMER: Always clarify you are an AI assistant, not a licensed physician, when giving health guidance.
6. EVIDENCE-BASED: Base all information on established medical literature and clinical guidelines.
7. COMPASSIONATE TONE: Be warm, professional, and empathetic like a knowledgeable healthcare companion.

Platform Context: You are integrated into Medora AI — a healthcare platform with 500+ board-certified doctors, AI diagnostics, and telemedicine consultations. You can guide users to book appointments, find doctors, or use the dashboard.`;

// Topics that indicate non-medical queries (for fast local check)
const NON_MEDICAL_KEYWORDS = [
  'javascript', 'python', 'code', 'programming', 'software', 'game', 'movie', 'music',
  'recipe', 'cook', 'finance', 'stock', 'crypto', 'bitcoin', 'invest', 'politics',
  'election', 'sport', 'football', 'cricket', 'weather', 'news', 'joke', 'poem',
  'write essay', 'translate', 'math problem', 'solve equation'
];

const isLikelyNonMedical = (text: string): boolean => {
  const lower = text.toLowerCase();
  return NON_MEDICAL_KEYWORDS.some(kw => lower.includes(kw));
};

// =====================================================================
// OPENAI API CALL (with medical-only system prompt)
// =====================================================================

const callOpenAI = async (
  userMessage: string,
  history: { sender: 'user' | 'ai'; message: string }[]
): Promise<string | null> => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  if (!apiKey) return null;

  // Build message array for OpenAI
  const messages: { role: 'system' | 'user' | 'assistant'; content: string }[] = [
    { role: 'system', content: MEDICAL_SYSTEM_PROMPT }
  ];

  // Add conversation history (last 8 exchanges for context)
  const recentHistory = history.slice(-16);
  for (const h of recentHistory) {
    messages.push({
      role: h.sender === 'user' ? 'user' : 'assistant',
      content: h.message
    });
  }

  // Add current user message
  messages.push({ role: 'user', content: userMessage });

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      signal: controller.signal,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages,
        max_tokens: 600,
        temperature: 0.4,
        presence_penalty: 0.1,
        frequency_penalty: 0.1
      })
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      console.error('OpenAI API error:', response.status, await response.text());
      return null;
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content ?? null;
  } catch (err) {
    console.error('OpenAI fetch error:', err);
    return null;
  }
};

// =====================================================================
// EMERGENCY DETECTION (always runs first, before any AI)
// =====================================================================

const EMERGENCY_PATTERNS = [
  'chest pain', 'chest pressure', 'crushing chest', 'heart attack',
  'breathing difficulty', 'shortness of breath', "can't breathe", 'cant breathe',
  'severe bleeding', 'bleeding heavily', 'stroke', 'facial droop', 'speech slur',
  'unconscious', 'passed out', 'loss of consciousness', 'overdose', 'suicidal'
];

const hasEmergency = (text: string): boolean => {
  const lower = text.toLowerCase();
  return EMERGENCY_PATTERNS.some(p => lower.includes(p));
};

// =====================================================================
// MAIN CHATBOT RESPONSE FUNCTION
// =====================================================================

export const getChatbotResponse = async (
  userInput: string,
  history: { sender: 'user' | 'ai'; message: string }[],
  knowledgeBase: ChatbotKnowledge[]
): Promise<ChatResponse> => {

  const text = userInput.toLowerCase().trim();

  // 1. Emergency check — always first
  if (hasEmergency(text)) {
    return {
      message: '🚨 CRITICAL ALERT: The symptoms you described may be life-threatening.\n\n**Please call emergency services immediately: 911 (US) or 112 (Global) or go to your nearest Emergency Room. Do not wait.**\n\nIf you are with someone experiencing these symptoms, help them stay calm and do not leave them alone.',
      suggestedAction: { type: 'link', label: 'Contact Emergency Support', value: 'contact' }
    };
  }

  // 2. Try Supabase Edge Function first (production-grade, no key exposure)
  if (supabase) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);

      const { data, error } = await supabase.functions.invoke('medora-chatbot', {
        signal: controller.signal,
        body: {
          message: userInput,
          history: history.map(h => ({
            role: h.sender === 'user' ? 'user' : 'model',
            parts: [{ text: h.message }]
          }))
        }
      });
      clearTimeout(timeoutId);
      if (!error && data) {
        return data as ChatResponse;
      }
    } catch (e) {
      console.warn('Supabase Edge Function unavailable. Using OpenAI fallback.', e);
    }
  }

  // 3. OpenAI GPT-4o-mini (medical-only, real AI)
  const openAiResponse = await callOpenAI(userInput, history);
  if (openAiResponse) {
    // Detect if the response suggests a platform action
    let suggestedAction: ChatResponse['suggestedAction'] | undefined;

    if (openAiResponse.toLowerCase().includes('appointment') || openAiResponse.toLowerCase().includes('book')) {
      suggestedAction = { type: 'link', label: 'Book Appointment', value: 'book-appointment' };
    } else if (openAiResponse.toLowerCase().includes('doctor') || openAiResponse.toLowerCase().includes('specialist')) {
      suggestedAction = { type: 'link', label: 'Find a Doctor', value: 'doctors' };
    } else if (openAiResponse.toLowerCase().includes('dashboard') || openAiResponse.toLowerCase().includes('report')) {
      suggestedAction = { type: 'link', label: 'Open Dashboard', value: 'dashboard' };
    }

    return { message: openAiResponse, suggestedAction };
  }

  // 4. Local knowledge base keyword match
  for (const entry of knowledgeBase) {
    if (entry.keyword && text.includes(entry.keyword.toLowerCase())) {
      return { message: entry.responseText || '' };
    }
  }

  // 5. Keyword action triggers (smart local fallback)
  if (text.includes('check my symptoms') || text.includes('triage') || text.includes('symptom')) {
    return {
      message: "I'll help you assess your symptoms step-by-step. First, what is your primary symptom? (e.g., headache, chest discomfort, fatigue, cough, fever)",
      suggestedAction: { type: 'prompt', label: 'Start Symptom Check', value: 'Headache' }
    };
  }

  if (text.includes('find a doctor') || text.includes('consult') || text.includes('specialist')) {
    return {
      message: "We have 500+ board-certified specialists available for virtual consultations — covering cardiology, neurology, internal medicine, and more. Browse our verified doctors directory.",
      suggestedAction: { type: 'link', label: 'View Doctors', value: 'doctors' }
    };
  }

  if (text.includes('book appointment') || text.includes('schedule')) {
    return {
      message: "You can reserve a video consultation with one of our specialists in minutes. Choose your doctor, preferred date, and time slot.",
      suggestedAction: { type: 'link', label: 'Book Now', value: 'book-appointment' }
    };
  }

  if (text.includes('pricing') || text.includes('plan') || text.includes('cost') || text.includes('subscription')) {
    return {
      message: "Medora AI offers three care tiers: Care Essential (₹999/mo), Care Premium (₹2,999/mo with 2 virtual consultations), and Care Elite (₹7,999/mo with unlimited consultations + genetic profiling). View full details on our pricing page.",
      suggestedAction: { type: 'link', label: 'View Pricing', value: 'pricing' }
    };
  }

  if (text.includes('hello') || text.includes('hi') || text.includes('hey')) {
    return {
      message: "Hello! 👋 I'm your Medora AI medical assistant — powered by GPT-4 and restricted exclusively to health and medical guidance.\n\nI can help you:\n• Check symptoms & get health guidance\n• Understand lab reports & medical terms\n• Find the right specialist\n• Book consultations\n• Answer general wellness questions\n\nHow can I help your health today?",
      suggestedAction: { type: 'prompt', label: 'Check Symptoms', value: 'Check my symptoms' }
    };
  }

  // 6. Non-medical topic detected
  if (isLikelyNonMedical(text)) {
    return {
      message: "I'm your dedicated medical AI assistant. I can only help with health and medical questions. Is there anything about your health, symptoms, or wellness I can assist with?"
    };
  }

  // 7. Default medical fallback
  return {
    message: "I've noted your question. As Medora AI, I provide evidence-based health education and wellness guidance only — I don't diagnose clinical conditions or replace physician care.\n\nFor persistent or concerning symptoms, I recommend booking a consultation with one of our verified specialists for a proper clinical assessment.",
    suggestedAction: { type: 'link', label: 'Consult a Specialist', value: 'doctors' }
  };
};
