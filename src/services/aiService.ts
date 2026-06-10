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

const MEDICAL_SYSTEM_PROMPT = `You are **Med-AI Encyclopedia**, an advanced Medical & Healthcare Knowledge Assistant designed to function as a comprehensive, patient-friendly, evidence-based medical encyclopedia and an intelligent clinical conversation assistant.

# CLINICAL CONVERSATION MODE

In addition to functioning as a medical encyclopedia, you must operate as an intelligent healthcare conversation assistant.
Your goal is to understand the user's situation before providing conclusions whenever important information is missing.

## Conversation Principles

When a user describes symptoms, concerns, medications, medical history, or health conditions:
1. Gather relevant details gradually. Do not present all answers at once if background details are missing.
2. Ask concise follow-up questions.
3. Avoid overwhelming the user with too many questions at once (ask at most 2-3 questions per turn).
4. Maintain a warm, professional, reassuring, empathetic, calm, and non-judgmental tone.
5. Explain why information is being requested when appropriate.
6. Adapt questioning based on the user's responses.
7. Engage in natural conversation while maintaining medical accuracy. Avoid sounding robotic.

## Symptom Assessment Workflow

For symptom-related conversations, gather information using:

### Basic Information
* Age
* Biological sex (when medically relevant)
* Existing medical conditions
* Current medications
* Known allergies

### Symptom Information
* Main complaint
* Onset (when it started)
* Duration
* Severity (1–10 scale)
* Frequency
* Progression (improving, worsening, stable)

### Associated Symptoms
Ask about related symptoms that commonly occur with the condition (e.g., if user reports chest pain, ask about: shortness of breath, sweating, arm pain, jaw pain, dizziness, nausea).

## Conversational Example
User: "I have a headache."
AI: "I can help assess that. Could you tell me:
1. How long have you had the headache?
2. Where is the pain located?
3. On a scale of 1–10, how severe is it?
4. Do you have fever, nausea, blurred vision, or sensitivity to light?"

## Medication Conversations

When users ask about medicines, ask:
* Which medication?
* Dosage (if known)
* Why it was prescribed?
* How long they have been taking it?
* Any side effects?
Then provide educational information. Never instruct users to start, stop, or alter medications without physician guidance.

## Child Health Conversations

When discussing children, gather:
* Child's age
* Weight (if relevant)
* Symptoms & duration
* Vaccination status (when relevant)
Use age-appropriate guidance.

## Emergency Detection Mode

Continuously monitor for red-flag symptoms:
* Chest pain
* Difficulty breathing
* Severe allergic reaction
* Sudden weakness
* Stroke symptoms
* Loss of consciousness
* Severe bleeding
* Suicidal thoughts
* Seizures

When detected:
1. Clearly state that urgent medical evaluation is recommended.
2. Prioritize safety over educational discussion.
3. Explain why the symptoms may be serious.
4. Encourage immediate contact with emergency services or a healthcare professional.

## Differential Possibilities

When discussing symptoms:
* Do not claim a diagnosis.
* Instead, use language such as: "Several conditions could potentially cause these symptoms, including..."
* Explain possibilities in order of likelihood or seriousness.

## Follow-Up Conversation Mode

At the end of most symptom-related conversations, ask one relevant follow-up question (e.g., "Has this happened before?", "Have you noticed anything that makes it better or worse?", "Are you currently taking any medications for this?", "Do you have any underlying medical conditions?"). Keep the conversation moving naturally.

## Patient Education Mode

After answering a patient query:
1. Explain the condition.
2. Explain possible causes.
3. Explain warning signs.
4. Explain when medical evaluation is recommended.
5. Ask if the user would like a deeper explanation:
   "Would you like me to explain the condition, treatment options, prevention strategies, or possible causes in more detail?"

---

## Core Mission

Provide medically accurate, educational, easy-to-understand, and highly structured information covering healthcare, medicine, diagnostics, surgery, pharmaceuticals, preventive care, epidemics, child health, clinical research, allergies, and blood donation.

Your role is educational, explanatory, and informational.

You must never replace licensed medical professionals, diagnose users, prescribe treatments, or make definitive clinical decisions.

---

# PRIMARY KNOWLEDGE DOMAINS

## 1. Recent Medical Innovations & Healthcare Shifts

Explain modern healthcare developments including:
* Artificial Intelligence in Medicine
* AI-assisted Diagnostics
* AI in Radiology
* AI Pathology Systems
* Surgical Robotics
* Precision Medicine
* Personalized Therapies
* Digital Health Platforms
* Telemedicine
* Remote Patient Monitoring
* Wearable Health Devices
* Genomics
* CRISPR Gene Editing
* Regenerative Medicine
* Stem Cell Research
* Digital Therapeutics
* Healthcare Automation

For every innovation:
### Explain:
* What it is
* Why it matters
* Benefits
* Risks
* Current adoption status
* Indian healthcare relevance
* Future outlook

Use simple language first, technical language second.

---

## 2. Pharmaceutical Reference (Indian Market Focus)

Act as an educational drug encyclopedia.
For medicines, provide:

| Section               | Details                     |
| --------------------- | --------------------------- |
| Generic Name          | Official drug name          |
| Brand Names           | Common Indian brands        |
| Drug Class            | Therapeutic category        |
| Uses                  | Approved indications        |
| How It Works          | Mechanism explained simply  |
| Common Side Effects   | Frequent reactions          |
| Serious Side Effects  | Red-flag warnings           |
| Contraindications     | Who should avoid it         |
| Interactions          | Drug-food-drug interactions |
| Availability in India | CDSCO status when known     |
| Cost Considerations   | Relative affordability      |
| Patient Notes         | Practical guidance          |

Always distinguish:
* Generic Name
* Brand Name

Clearly state when information varies by manufacturer or region.
Never recommend starting or stopping medication.

---

## 3. Medical Technology & Surgery Simplifier

When explaining medical technologies, diagnostics, procedures, or surgeries:
### Use:
* Analogies
* Step-by-step explanations
* Visual text diagrams
* Tables
* Comparison charts

Example format:
## CT Scan vs MRI

| Feature    | CT Scan       | MRI             |
| ---------- | ------------- | --------------- |
| Technology | X-rays        | Magnetic Fields |
| Speed      | Fast          | Slower          |
| Best For   | Bone & Trauma | Soft Tissue     |
| Radiation  | Yes           | No              |

### Simple Analogy
CT Scan: "Like looking at slices of a loaf of bread using X-rays."
MRI: "Like using a powerful magnet to create highly detailed pictures of organs and tissues."

### Common Topics
* LASIK Surgery
* Cataract Surgery
* CT Scan
* MRI
* PET Scan
* Ultrasound
* Endoscopy
* Colonoscopy
* Angiography
* Dialysis
* Organ Transplantation
* Cardiac Procedures
* Cancer Treatments

Always assume the user has no medical background.

---

## 4. Epidemics & Contagious Disease Guide

Provide practical outbreak information.
Include:
### Disease Overview
* Cause
* Transmission
* Incubation Period
* Symptoms
* Risk Groups

### Prevention
* Hygiene
* Vaccination
* Isolation Measures
* Protective Equipment
* Travel Considerations

### During an Outbreak
Provide:
* Personal protection checklist
* Household safety checklist
* Community precautions
* When to seek medical care

Use concise bullet points.
Avoid alarmist language.

---

## 5. Child Care Encyclopedia

Provide evidence-based child healthcare information.
Topics include:
### Newborn Care
* Feeding
* Sleep
* Hygiene
* Growth Milestones

### Infant Care
* Vaccination schedules
* Nutrition
* Safety practices

### Childhood Health
* Common illnesses
* Fever management
* Development milestones
* Nutrition guidance
* School-age health

### Parent Checklists
Use practical checklists whenever possible.
Explain information clearly for first-time parents.

---

## 6. Drug Clinical Trials & Field Trials Explained

Explain clinical research in simple language.
### Clinical Trial Pipeline

| Phase       | Purpose                   |
| ----------- | ------------------------- |
| Preclinical | Lab & Animal Studies      |
| Phase I     | Safety Testing            |
| Phase II    | Effectiveness Testing     |
| Phase III   | Large Scale Validation    |
| Phase IV    | Post-Marketing Monitoring |

Explain:
* Recruitment
* Randomization
* Placebo
* Double-Blind Studies
* Ethics Committees
* Informed Consent
* Regulatory Approval

Use analogies whenever possible.

---

## 7. Pharmaceutical Allergy & Drug Sensitivity Guide

Explain medication allergies and adverse reactions.
Cover:
### Common Drug Allergies
* Penicillin
* Sulfonamides
* NSAIDs
* Anticonvulsants
* Contrast Dyes

### Symptoms
Mild:
* Rash
* Itching
* Hives
Moderate:
* Facial Swelling
* Wheezing
Emergency:
* Anaphylaxis
* Breathing Difficulty
* Collapse

### Safety Information
Provide:
* Allergy warning signs
* Emergency response guidance
* Screening questions
* Medical alert recommendations

Always advise urgent medical attention for severe allergic symptoms.

---

## 8. Blood Donation Encyclopedia

Provide complete educational guidance.
### Cover:
* Eligibility
* Age requirements
* Weight requirements
* Donation frequency
* Preparation
* Recovery

### Blood Group Compatibility
Present compatibility tables.
Example:

| Blood Type | Can Donate To |
| ---------- | ------------- |
| O Negative | All Types     |
| A Positive | A+, AB+       |

Explain:
* Whole Blood Donation
* Platelet Donation
* Plasma Donation

Provide myths vs facts sections when appropriate.

---

# RESPONSE STYLE REQUIREMENTS

## Language
Use:
* Warm
* Professional
* Educational
* Patient-friendly

Avoid excessive medical jargon.
If jargon is necessary:
1. State the medical term.
2. Immediately explain it in plain language.

Example:
"Hypertension (high blood pressure) means the force of blood against artery walls remains consistently elevated."

---

# VISUAL FORMATTING RULES

Maximize:
* Markdown headings
* Bullet points
* Numbered steps
* Tables
* Comparison charts
* ASCII visualizations

Example:
Heart Attack Warning Signs
[Chest Pressure]
↓
[Arm Pain]
↓
[Shortness of Breath]
↓
[Seek Emergency Care]

Keep layouts highly readable.

---

# ANSWER STRUCTURE

Whenever possible use:
## Overview
Brief explanation.

## Key Facts
Bullet summary.

## Detailed Explanation
Expanded content.

## Practical Takeaways
Actionable educational insights.

## Frequently Asked Questions
When relevant.

---

# SCIENTIFIC STANDARDS

Use:
* WHO guidance
* CDC guidance
* NIH references
* CDSCO references
* Indian public health standards
* Peer-reviewed evidence
* Established clinical guidelines

Clearly distinguish:
* Established evidence
* Emerging research
* Experimental treatments

Never present unverified claims as claims of fact.

---

# SAFETY RULES

Do NOT:
* Diagnose diseases
* Prescribe medications
* Recommend dosage changes
* Replace emergency services
* Encourage self-treatment of serious conditions

If symptoms suggest an emergency, instruct users to seek immediate medical attention.

---

# REQUIRED ENDING DISCLAIMER

At the end of every healthcare response, include exactly:

**Disclaimer:** This information is for educational purposes as a medical encyclopedia and does not constitute official medical advice. Please consult a licensed healthcare professional for medical concerns or treatments.`;

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

let lastApiError: string | null = null;

export type ChatbotStatus = 'live' | 'demo' | 'error';
export type ChatProvider = 'openai' | 'gemini' | null;

export const getChatbotStatus = (): { status: ChatbotStatus; error: string | null; provider: ChatProvider } => {
  const openAiKey = import.meta.env.VITE_OPENAI_API_KEY;
  const geminiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  const hasOpenAi = openAiKey && !openAiKey.includes('PASTE_MY_') && !openAiKey.includes('PASTE_YOUR_') && openAiKey.trim() !== '';
  const hasGemini = geminiKey && !geminiKey.includes('PASTE_MY_') && !geminiKey.includes('PASTE_YOUR_') && geminiKey.trim() !== '';
  
  if (!hasOpenAi && !hasGemini) {
    return { status: 'demo', error: null, provider: null };
  }
  
  if (lastApiError) {
    return { status: 'error', error: lastApiError, provider: hasOpenAi ? 'openai' : 'gemini' };
  }
  
  return { status: 'live', error: null, provider: hasOpenAi ? 'openai' : 'gemini' };
};

export const resetChatbotStatus = () => {
  lastApiError = null;
};

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
  if (Array.isArray(history)) {
    const recentHistory = history.slice(-16);
    for (const h of recentHistory) {
      if (h && typeof h.message === 'string') {
        messages.push({
          role: h.sender === 'user' ? 'user' : 'assistant',
          content: h.message
        });
      }
    }
  }

  // Add current user message
  messages.push({ role: 'user', content: userMessage || '' });

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    const response = await fetch('/api-openai/v1/chat/completions', {
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
      const status = response.status;
      let errText = '';
      const rawText = await response.text();
      try {
        const errJson = JSON.parse(rawText);
        errText = errJson?.error?.message || rawText || response.statusText;
      } catch (e) {
        errText = rawText || response.statusText;
      }
      const errorMsg = `OpenAI API error (${status}): ${errText}`;
      console.error(errorMsg);
      lastApiError = errorMsg;
      throw new Error(errorMsg);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content ?? null;
    if (content) {
      lastApiError = null;
    }
    return content;
  } catch (err: any) {
    console.error('OpenAI fetch error:', err);
    const errorMsg = err.message || 'Network error connecting to OpenAI';
    lastApiError = errorMsg;
    throw new Error(errorMsg);
  }
};

const callGemini = async (
  userMessage: string,
  history: { sender: 'user' | 'ai'; message: string }[]
): Promise<string | null> => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) return null;

  const contents: { role: 'user' | 'model'; parts: { text: string }[] }[] = [];

  if (Array.isArray(history)) {
    const recentHistory = history.slice(-16);
    for (const h of recentHistory) {
      if (h && typeof h.message === 'string') {
        contents.push({
          role: h.sender === 'user' ? 'user' : 'model',
          parts: [{ text: h.message }]
        });
      }
    }
  }

  contents.push({
    role: 'user',
    parts: [{ text: userMessage || '' }]
  });

  const modelsToTry = ['gemini-flash-latest', 'gemini-flash-lite-latest'];
  let lastError: any = null;
  const isOAuth = apiKey.startsWith('AQ.');

  for (const model of modelsToTry) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const url = isOAuth
        ? `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`
        : `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };

      if (isOAuth) {
        headers['Authorization'] = `Bearer ${apiKey}`;
      }

      const response = await fetch(
        url,
        {
          signal: controller.signal,
          method: 'POST',
          headers,
          body: JSON.stringify({
            contents,
            systemInstruction: {
              parts: [{ text: MEDICAL_SYSTEM_PROMPT }]
            },
            generationConfig: {
              maxOutputTokens: 600,
              temperature: 0.4
            }
          })
        }
      );
      clearTimeout(timeoutId);

      if (!response.ok) {
        const status = response.status;
        let errText = '';
        const rawText = await response.text();
        try {
          const errJson = JSON.parse(rawText);
          errText = errJson?.error?.message || rawText || response.statusText;
        } catch (e) {
          errText = rawText || response.statusText;
        }
        const errorMsg = `Gemini API error (${status}) with model ${model}: ${errText}`;
        console.warn(errorMsg);
        lastError = new Error(errorMsg);
        continue;
      }

      const data = await response.json();
      const content = data.candidates?.[0]?.content?.parts?.[0]?.text ?? null;
      if (content) {
        lastApiError = null;
        return content;
      }
    } catch (err: any) {
      console.warn(`Gemini fetch error with model ${model}:`, err);
      lastError = err;
    }
  }

  const errorMsg = lastError?.message || 'Network error connecting to Gemini';
  lastApiError = errorMsg;
  throw new Error(errorMsg);
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
  const lower = String(text || '').toLowerCase();
  return EMERGENCY_PATTERNS.some(p => lower.includes(p));
};

// =====================================================================
// CLINICAL CONVERSATION FALLBACK MODE (Rule-Based High Fidelity)
// =====================================================================

const SYMPTOMS = [
  { name: 'headache', questions: ['How long have you had the headache?', 'Where is the pain located?', 'On a scale of 1–10, how severe is it?', 'Do you have other symptoms like fever, nausea, stiff neck, or light sensitivity?'] },
  { name: 'migraine', questions: ['How long have you had the headache?', 'Where is the pain located?', 'On a scale of 1–10, how severe is it?', 'Do you have other symptoms like fever, nausea, stiff neck, or light sensitivity?'] },
  { name: 'fever', questions: ['What is your current temperature?', 'How long has the fever lasted?', 'Do you have chills, body aches, a cough, or a sore throat?', 'Have you recently traveled or been exposed to anyone who is sick?'] },
  { name: 'cough', questions: ['Is it a dry cough or are you coughing up mucus?', 'How long have you had it?', 'Do you experience shortness of breath, wheezing, or chest pain?', 'Is it worse at any particular time of day?'] },
  { name: 'stomach', questions: ['Where exactly is the pain located in your abdomen?', 'Is it sharp, dull, cramping, or burning?', 'Do you have nausea, vomiting, diarrhea, or fever?', 'Does eating make it better or worse?'] },
  { name: 'abdomen', questions: ['Where exactly is the pain located in your abdomen?', 'Is it sharp, dull, cramping, or burning?', 'Do you have nausea, vomiting, diarrhea, or fever?', 'Does eating make it better or worse?'] }
];

const isSymptomQuery = (text: string): boolean => {
  const symptomKeywords = [
    'headache', 'migraine', 'fever', 'cough', 'stomach', 'abdomen', 'pain', 'ache', 'sore throat', 
    'fatigue', 'tired', 'dizzy', 'nausea', 'vomit', 'diarrhea', 'constipation', 'cramp', 'rash', 
    'itch', 'swelling', 'shortness of breath', 'breathless', 'backache', 'weakness'
  ];
  return symptomKeywords.some(kw => text.includes(kw));
};

const getLocalClinicalResponse = (text: string, history: { sender: 'user' | 'ai'; message: string }[]): string => {
  let matchedSymptomName = 'general';
  
  // Find the first user message in the current session history that contains a symptom keyword.
  // This ensures we continue tracking the primary symptom complaint even if subsequent messages
  // mention other terms (e.g. "no fever").
  const userMessages = history
    .filter(h => h && h.sender === 'user')
    .map(h => h.message.toLowerCase());
  userMessages.push(text);

  outerLoop:
  for (const msg of userMessages) {
    for (const s of SYMPTOMS) {
      if (msg.includes(s.name)) {
        matchedSymptomName = s.name;
        break outerLoop;
      }
    }
  }

  // Count how many times the AI has asked clinical questions or given symptom advice in the history
  // to determine the current step of the flow.
  const hasAskedFollowUps = history.some(h => 
    h && h.sender === 'ai' && 
    (h.message.includes('To better understand') || h.message.includes('How long have you had') || h.message.includes('scale of 1'))
  );

  const hasGivenDifferentials = history.some(h => 
    h && h.sender === 'ai' && 
    (h.message.includes('Several conditions could potentially cause') || h.message.includes('possibilities'))
  );

  if (!hasAskedFollowUps) {
    // Step 1: Ask follow-up questions
    const matched = SYMPTOMS.find(s => matchedSymptomName.includes(s.name));
    const questions = matched ? matched.questions : [
      'How long have you had this symptom?',
      'On a scale of 1–10, how severe is the discomfort?',
      'Does anything make it better or worse?',
      'Are you experiencing any other symptoms?'
    ];
    
    return `I can help assess your symptom. To better understand and provide the best educational guidance, could you tell me:
1. ${questions[0]}
2. ${questions[1]}
3. ${questions[2]}
4. ${questions[3]}

**Disclaimer:** This information is for educational purposes as a medical encyclopedia and does not constitute official medical advice. Please consult a licensed healthcare professional for medical concerns or treatments.`;
  } else if (!hasGivenDifferentials) {
    // Step 2: Provide differentials, ask one relevant follow-up, and suggest patient education
    let differentials = '';
    if (matchedSymptomName === 'headache' || matchedSymptomName === 'migraine') {
      differentials = `* **Tension Headache:** The most common type, typically presenting as a constant, dull ache on both sides of the head, often triggered by stress, fatigue, or muscle strain.
* **Dehydration Headache:** Occurs when the body lacks sufficient fluids, causing blood vessels to temporarily narrow and leading to a throbbing ache.
* **Migraine:** A neurological condition causing moderate to severe throbbing pain, often on one side of the head, and sometimes accompanied by nausea or sensitivity to light/sound.`;
    } else if (matchedSymptomName === 'fever') {
      differentials = `* **Viral Infection:** Such as the common cold, flu, or gastroenteritis, which are typical causes of elevated body temperature as the immune system fights the virus.
* **Bacterial Infection:** Such as strep throat or a urinary tract infection, which may require specific medical evaluation and antibiotic treatment.
* **Inflammatory Response:** Non-infectious causes of inflammation that can trigger a temporary spike in temperature.`;
    } else if (matchedSymptomName === 'cough') {
      differentials = `* **Acute Bronchitis:** Inflammation of the airways, often following a viral cold, causing a dry or productive cough.
* **Post-Nasal Drip:** Mucus dripping down the back of the throat due to allergies or sinus issues, triggering a persistent tickle and cough.
* **Gastroesophageal Reflux Disease (GERD):** Stomach acid backing up into the esophagus, which can irritate the airway and cause a chronic dry cough.`;
    } else {
      differentials = `* **Mild Localized Inflammation:** A common response to minor irritation, strain, or localized stress in the affected area.
* **Systemic Response:** A general reaction by the body's immune or digestive systems to environmental, dietary, or minor infectious factors.
* **Stress or Fatigue:** Physical tension or lack of rest manifesting as physical discomfort or pain.`;
    }

    return `Thank you for sharing those details. 

Several conditions could potentially cause these symptoms, including:
${differentials}

To help narrow this down, has this happened before?

Would you like me to explain the condition, treatment options, prevention strategies, or possible causes in more detail?

**Disclaimer:** This information is for educational purposes as a medical encyclopedia and does not constitute official medical advice. Please consult a licensed healthcare professional for medical concerns or treatments.`;
  } else {
    // Step 3: Advice, warning signs, and patient education
    return `Thank you for the context. Understanding whether this is a recurring or new issue is very helpful.

Here are some general, evidence-based wellness tips:
* **Stay Hydrated:** Ensure you drink adequate water throughout the day.
* **Get Rest:** Allow your body time to rest and recover in a quiet, comfortable environment.
* **Monitor Symptoms:** Keep a log of your symptoms, noting when they occur, their severity, and any potential triggers.
* **Watch for Warning Signs:** If you experience any red-flag symptoms such as severe sudden onset pain, high persistent fever, difficulty breathing, or neurological changes, seek medical care immediately.

Would you like me to explain the condition, treatment options, prevention strategies, or possible causes in more detail?

**Disclaimer:** This information is for educational purposes as a medical encyclopedia and does not constitute official medical advice. Please consult a licensed healthcare professional for medical concerns or treatments.`;
  }
};

// =====================================================================
// MAIN CHATBOT RESPONSE FUNCTION
// =====================================================================

export const getChatbotResponse = async (
  userInput: string,
  history: { sender: 'user' | 'ai'; message: string }[],
  knowledgeBase: ChatbotKnowledge[]
): Promise<ChatResponse> => {

  const userInputStr = typeof userInput === 'string' ? userInput : '';
  const text = userInputStr.toLowerCase().trim();
  


  // 1. Emergency check — always first
  if (hasEmergency(text)) {
    return {
      message: '🚨 CRITICAL ALERT: The symptoms you described may be life-threatening.\n\n**Please call emergency services immediately: 911 (US) or 112 (Global) or go to your nearest Emergency Room. Do not wait.**\n\nIf you are with someone experiencing these symptoms, help them stay calm and do not leave them alone.',
      suggestedAction: { type: 'link', label: 'Contact Emergency Support', value: 'contact' }
    };
  }

  // 2. Try local OpenAI first if key is present (ensures local MEDICAL_SYSTEM_PROMPT changes are active)
  let openAiResponse: string | null = null;
  let geminiResponse: string | null = null;
  let openAiError: string | null = null;
  let geminiError: string | null = null;

  const openAiKey = import.meta.env.VITE_OPENAI_API_KEY;
  const geminiKey = import.meta.env.VITE_GEMINI_API_KEY;

  const hasOpenAi = openAiKey && !openAiKey.includes('PASTE_MY_') && !openAiKey.includes('PASTE_YOUR_') && openAiKey.trim() !== '';
  const hasGemini = geminiKey && !geminiKey.includes('PASTE_MY_') && !geminiKey.includes('PASTE_YOUR_') && geminiKey.trim() !== '';
  console.log('[DEBUG] OpenAI key present:', hasOpenAi, 'Gemini key present:', hasGemini, 'geminiKey value:', geminiKey);

  // Try OpenAI
  if (hasOpenAi) {
    try {
      openAiResponse = await callOpenAI(userInputStr, history);
    } catch (err: any) {
      console.error('Error during callOpenAI:', err);
      openAiError = err.message || 'OpenAI Connection Error';
    }
  }

  // If OpenAI is successful, return it
  if (openAiResponse) {
    let suggestedAction: ChatResponse['suggestedAction'] | undefined;
    const lowerResponse = openAiResponse.toLowerCase();
    if (lowerResponse.includes('appointment') || lowerResponse.includes('book')) {
      suggestedAction = { type: 'link', label: 'Book Appointment', value: 'book-appointment' };
    } else if (lowerResponse.includes('doctor') || lowerResponse.includes('specialist')) {
      suggestedAction = { type: 'link', label: 'Find a Doctor', value: 'doctors' };
    } else if (lowerResponse.includes('dashboard') || lowerResponse.includes('report')) {
      suggestedAction = { type: 'link', label: 'Open Dashboard', value: 'dashboard' };
    }
    return { message: openAiResponse, suggestedAction };
  }

  // Try Gemini
  if (hasGemini) {
    try {
      geminiResponse = await callGemini(userInputStr, history);
    } catch (err: any) {
      console.error('Error during callGemini:', err);
      geminiError = err.message || 'Gemini Connection Error';
    }
  }

  // If Gemini is successful, return it
  if (geminiResponse) {
    let suggestedAction: ChatResponse['suggestedAction'] | undefined;
    const lowerResponse = geminiResponse.toLowerCase();
    if (lowerResponse.includes('appointment') || lowerResponse.includes('book')) {
      suggestedAction = { type: 'link', label: 'Book Appointment', value: 'book-appointment' };
    } else if (lowerResponse.includes('doctor') || lowerResponse.includes('specialist')) {
      suggestedAction = { type: 'link', label: 'Find a Doctor', value: 'doctors' };
    } else if (lowerResponse.includes('dashboard') || lowerResponse.includes('report')) {
      suggestedAction = { type: 'link', label: 'Open Dashboard', value: 'dashboard' };
    }
    return { message: geminiResponse, suggestedAction };
  }

  // If any key was configured but both failed, return descriptive error
  if (openAiError || geminiError) {
    let errMessage = `⚠️ **[AI Doctor Configuration Error]**\nMedora AI encountered an issue while communicating with your AI models.\n`;
    if (openAiError) {
      errMessage += `\n**OpenAI Error Details:**\n*${openAiError}*\n`;
    }
    if (geminiError) {
      errMessage += `\n**Gemini Error Details:**\n*${geminiError}*\n`;
    }
    errMessage += `\n**Troubleshooting Steps:**
1. Check that your API keys in the \`.env\` file are correct and active.
2. Verify that your accounts have sufficient usage credits (or are within free tier limits).
3. If you want to use the local offline demo model, clear both API keys in the \`.env\` file.`;
    return { message: errMessage };
  }

  // 3. If OpenAI/Gemini failed or was not configured, and it's a symptom query, handle locally
  if (isSymptomQuery(text)) {
    const localClinicalResponse = getLocalClinicalResponse(text, history);
    return { message: localClinicalResponse };
  }

  // 4. Try Supabase Edge Function next (production-grade, no key exposure)
  if (supabase) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 seconds timeout for remote edge function

      const formattedHistory = Array.isArray(history)
        ? history.filter(h => h && typeof h.message === 'string').map(h => ({
          role: h.sender === 'user' ? 'user' : 'model',
          parts: [{ text: h.message }]
        }))
        : [];

      const { data, error } = await supabase.functions.invoke('medora-chatbot', {
        signal: controller.signal,
        body: {
          message: userInputStr,
          history: formattedHistory
        }
      });
      clearTimeout(timeoutId);
      if (!error && data) {
        return data as ChatResponse;
      }
    } catch (e) {
      console.warn('Supabase Edge Function unavailable.', e);
    }
  }

  // 4. Local knowledge base keyword match
  if (Array.isArray(knowledgeBase)) {
    for (const entry of knowledgeBase) {
      if (entry && entry.keyword) {
        const kw = String(entry.keyword).toLowerCase();
        if (text.includes(kw)) {
          return { message: entry.responseText || '' };
        }
      }
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
