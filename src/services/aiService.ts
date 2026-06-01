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

/**
 * You are Medora AI Assistant. You provide general health education and wellness guidance. 
 * You do not diagnose, prescribe medication, or replace licensed medical care. 
 * For urgent or severe symptoms, advise immediate medical attention.
 */
export const getChatbotResponse = async (
  userInput: string,
  history: { sender: 'user' | 'ai'; message: string }[],
  knowledgeBase: ChatbotKnowledge[]
): Promise<ChatResponse> => {
  
  // 1. Attempt to invoke the Supabase Edge Function 'medora-chatbot' securely
  // if Supabase is active, preventing exposure of private AI API keys in the frontend
  if (supabase) {
    try {
      const { data, error } = await supabase.functions.invoke('medora-chatbot', {
        body: { 
          message: userInput, 
          history: history.map(h => ({
            role: h.sender === 'user' ? 'user' : 'model',
            parts: [{ text: h.message }]
          }))
        }
      });
      if (!error && data) {
        return data as ChatResponse;
      }
    } catch (e) {
      console.warn('Supabase Edge Function not reachable. Seamlessly transitioning to local AI fallback graph.', e);
    }
  }

  // 2. Local Fallback Triage & Cautious Medical Triage State Machine
  // Simulate network delay for a modern SaaS conversational feel
  await new Promise((resolve) => setTimeout(resolve, 600));

  const text = userInput.toLowerCase().trim();

  // EMERGENCY CRITICAL SIGNS FILTER
  // Checks for severe signs: chest pain, breathing difficulty, severe bleeding, stroke, loss of consciousness
  const hasEmergencySigns = 
    text.includes('chest pain') || text.includes('chest pressure') || text.includes('crushing chest') ||
    text.includes('breathing difficulty') || text.includes('shortness of breath') || text.includes('cant breathe') ||
    text.includes('severe bleeding') || text.includes('bleeding heavily') ||
    text.includes('stroke') || text.includes('facial droop') || text.includes('speech slurr') ||
    text.includes('unconscious') || text.includes('passed out') || text.includes('loss of consciousness');

  if (hasEmergencySigns) {
    return {
      message: "✦ CRITICAL SAFETY ALERT: The symptoms you described (such as crushing chest pressure, shortness of breath, heavy bleeding, or potential neurological/stroke indicators) suggest a potential life-threatening emergency. \n\n**Please seek immediate emergency medical care: dial emergency services (112 or 911) or proceed to the nearest emergency department immediately. Do not delay care.**",
      suggestedAction: { type: 'link', label: 'Emergency Support Call', value: 'contact' }
    };
  }

  // Triage state machine
  const triageStep = getTriageState(history);
  if (triageStep > 0) {
    return handleTriageStep(triageStep, text);
  }

  // 3. Specific Website Action triggers
  if (text.includes('check my symptoms') || text === 'symptom_check' || text.includes('triage')) {
    return {
      message: "I am starting your interactive AI Symptom Triage. Let's analyze your condition step-by-step. First, what is your primary symptom? (e.g., headache, back pain, fatigue, cough)",
      suggestedAction: { type: 'prompt', label: 'Check Headache', value: 'Headache' }
    };
  }

  if (text.includes('explain my report') || text.includes('explain report') || text.includes('upload pdf') || text.includes('lab report')) {
    return {
      message: "To analyze your laboratory blood panels or EHR PDF documents, please go to your User Dashboard and navigate to the Health Reports page to upload the file. I will extract biological indicators and clarify complex metrics in plain language.",
      suggestedAction: { type: 'link', label: 'Go to Reports Page', value: 'dashboard' }
    };
  }

  if (text.includes('find a doctor') || text.includes('doctors') || text.includes('consult')) {
    return {
      message: "We have board-certified specialist physicians available for private virtual consultations. You can browse specialized practitioners in cardiology, neurology, oncology, and triage on our Doctors directory.",
      suggestedAction: { type: 'link', label: 'View Doctors Directory', value: 'doctors' }
    };
  }

  if (text.includes('book appointment') || text.includes('schedule') || text.includes('book a call')) {
    return {
      message: "To reserve a video consultation slot with one of our clinical specialists, navigate to the Book Appointment page and choose your preferred doctor, date, and slot.",
      suggestedAction: { type: 'link', label: 'Go to Booking Page', value: 'book-appointment' }
    };
  }

  if (text.includes('medicine reminder') || text.includes('reminder') || text.includes('pill') || text.includes('capsule')) {
    return {
      message: "To configure medication schedules, pharmacokinetics timers, and capsule reminder logs, visit the Medication Reminders tab inside your User Dashboard.",
      suggestedAction: { type: 'link', label: 'Open Reminders Dashboard', value: 'dashboard' }
    };
  }

  if (text.includes('pricing') || text.includes('plan') || text.includes('subscription') || text.includes('cost')) {
    return {
      message: "Medora AI offers premium clinical support tiers: Care Essential (₹999/mo) for base AI features, Care Premium (₹2999/mo) which includes 2 virtual doctor calls, and Care Elite (₹7999/mo) for unlimited consultations and genetic mapping. Review details on our plans page.",
      suggestedAction: { type: 'link', label: 'View Pricing Plans', value: 'pricing' }
    };
  }

  if (text.includes('service') || text.includes('features') || text.includes('longevity') || text.includes('cardiology AI')) {
    return {
      message: "Medora AI provides high-end clinical services: 1. Cardiology AI Analytics (remote ECG). 2. Neuro-Cognitive Diagnostics (sleep and brain metrics). 3. Genetic Longevity Profiling. Please visit our Services page to explore features.",
      suggestedAction: { type: 'link', label: 'Explore Services', value: 'features' }
    };
  }

  if (text.includes('health tips') || text.includes('tips') || text.includes('wellness') || text.includes('longevity tips')) {
    return {
      message: "For optimal longevity and general wellness: \n1. Aim for 7 to 8 hours of restorative sleep to support cognitive autophagy. \n2. Engage in 150 minutes of zone-2 cardiovascular conditioning weekly. \n3. Sync smart wearables in your Dashboard to monitor heart rate variability (HRV) baselines.",
      suggestedAction: { type: 'link', label: 'View Wellness Dashboard', value: 'dashboard' }
    };
  }

  // 4. Search the Admin Chatbot Knowledge base keywords
  for (const entry of knowledgeBase) {
    if (text.includes(entry.keyword.toLowerCase())) {
      return { message: entry.responseText };
    }
  }

  // 5. Default medical assistant conversational guidelines
  if (text.includes('hello') || text.includes('hi') || text.includes('hey') || text.includes('who are you')) {
    return {
      message: "Hello! ✦ I am the Medora AI Assistant, your digital clinical wellness companion. I can guide symptom triages, explain lab values, summarize health reports, or assist in scheduling consultations. What health metrics or guidelines can I support you with?",
      suggestedAction: { type: 'prompt', label: 'Check my symptoms', value: 'Check my symptoms' }
    };
  }

  if (text.includes('thank') || text.includes('helpful') || text.includes('great') || text.includes('appreciate')) {
    return {
      message: "You are welcome. Your health data is protected via point-to-point encryption and secure database controls. Let me know if you need any other wellness support."
    };
  }

  // Cautious general fallback medical disclaimer statement
  return {
    message: "I have noted your inquiry. As the Medora AI Assistant, I provide general educational and wellness guidance only. I do not diagnose clinical conditions or replace licensed physician care. If your symptoms are persistent or concerning, I strongly advise reserving a detailed consultation with one of our verified general practitioners or specialists.",
    suggestedAction: { type: 'link', label: 'Consult Certified Physician', value: 'doctors' }
  };
};

// =====================================================================
// TRIAGE CONVERSATION HISTORY LOG TRAVERSER
// =====================================================================

const getTriageState = (history: { sender: 'user' | 'ai'; message: string }[]): number => {
  for (let i = history.length - 1; i >= 0; i--) {
    const msg = history[i].message;
    if (msg.includes("what is your primary symptom?")) {
      return 1; // User just answered symptom
    }
    if (msg.includes("how long have you experienced this?")) {
      return 2; // User just answered duration
    }
    if (msg.includes("do you have any associated warning flags")) {
      return 3; // User just answered associated warnings
    }
  }
  return 0;
};

const handleTriageStep = (step: number, answer: string): ChatResponse => {
  if (step === 1) {
    return {
      message: `Thank you. I have recorded your primary symptom: "${answer}". To help compile your diagnostic details, how long have you experienced this? (e.g., since this morning, 3 days, over a week)`,
      suggestedAction: { type: 'prompt', label: 'Since today', value: 'Since this morning' }
    };
  }
  if (step === 2) {
    return {
      message: `Recorded duration: "${answer}". Almost complete. Do you have any associated warning flags like active fever, shortness of breath, sudden dizziness, or vomiting? (Yes / No)`,
      suggestedAction: { type: 'prompt', label: 'No, none', value: 'No' }
    };
  }
  if (step === 3) {
    const isSevere = answer.includes('yes') || answer.includes('fever') || answer.includes('short') || answer.includes('dizzy') || answer.includes('vomit');
    if (isSevere) {
      return {
        message: "✦ Medora AI Triage Report: [WARNING - ORANGE TIER]\nYour inputs show potential signs of systemic distress. I recommend scheduling an virtual consultation today. I suggest consulting Dr. Sarah Jenkins (Internal Medicine & Triage) for an expedited clinical assessment.",
        suggestedAction: { type: 'link', label: 'Consult Dr. Sarah Jenkins', value: 'doctors' }
      };
    } else {
      return {
        message: "✦ Medora AI Triage Report: [OBSERVE - GREEN TIER]\nNo severe clinical warning flags identified. Recommended general guidance: Rest, optimal hydration, and avoid excessive physical exertion. If these symptoms continue for more than 48 hours, proceed to schedule a consultation with our primary care team.",
        suggestedAction: { type: 'link', label: 'View Health Dashboard', value: 'dashboard' }
      };
    }
  }
  return { message: "Triage assessment completed." };
};
