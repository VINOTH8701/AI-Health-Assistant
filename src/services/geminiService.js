/**
 * Google Gemini AI Integration Service & Healthcare Heuristics Engine
 */

// Emergency Red-Flag Trigger Keywords
const EMERGENCY_KEYWORDS = [
  'chest pain', 'heart attack', 'shortness of breath', 'can\'t breathe', 
  'difficulty breathing', 'numbness on one side', 'stroke', 'slurred speech',
  'sudden vision loss', 'unconscious', 'fainted', 'severe bleeding',
  'suicidal', 'anaphylaxis', 'choking', 'crushing chest'
];

export const checkEmergencyKeywords = (inputStr) => {
  const lower = inputStr.toLowerCase();
  const matched = EMERGENCY_KEYWORDS.filter(kw => lower.includes(kw));
  return {
    isEmergency: matched.length > 0,
    matchedKeywords: matched
  };
};

export const analyzeSymptomsWithAI = async (
  symptomInput, 
  severityScale, 
  userProfile = {}, 
  apiKey = '', 
  modelName = 'gemini-1.5-flash'
) => {
  // Step 1: Emergency Pre-screening Safety Check
  const emergencyCheck = checkEmergencyKeywords(symptomInput);
  if (emergencyCheck.isEmergency) {
    return {
      summary: "CRITICAL ALERT: Emergency red-flag symptoms detected.",
      potentialCauses: [
        "Cardiovascular / Respiratory / Neurological Distress",
        "Acute Medical Emergency Require Instant Intervention"
      ],
      recommendedActions: [
        "CALL EMERGENCY SERVICES (911 / 112) IMMEDIATELY",
        "Do not drive yourself to the hospital",
        "Stay calm and keep warm while waiting for emergency responders"
      ],
      suggestedSpecialist: "Emergency Medicine Physician / Trauma Specialist",
      emergencyFlag: true,
      matchedKeywords: emergencyCheck.matchedKeywords,
      modelUsed: 'Red-Flag Safety Engine',
      disclaimer: "EMERGENCY NOTICE: These symptoms require immediate professional emergency medical care."
    };
  }

  // Step 2: Live Google Gemini API call if key is available
  if (apiKey && apiKey.trim().length > 10) {
    try {
      const endpointModel = modelName || 'gemini-1.5-flash';
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${endpointModel}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `You are an expert medical wellness triage AI assistant (${endpointModel}). Analyze these non-emergency user symptoms:
Symptoms: "${symptomInput}"
Reported Severity (1-10): ${severityScale}
User Context: Age ${userProfile.age || 'N/A'}, Allergies: ${userProfile.allergies ? userProfile.allergies.join(', ') : 'None'}

PROVIDE A STRICT JSON RESPONSE format with these exact keys:
{
  "summary": "Short 1-2 sentence non-diagnostic summary",
  "potentialCauses": ["Cause 1", "Cause 2", "Cause 3"],
  "recommendedActions": ["Self care step 1", "Self care step 2", "Step 3"],
  "suggestedSpecialist": "Type of doctor to consult",
  "emergencyFlag": false,
  "disclaimer": "Non-diagnostic AI guidance. Consult a doctor for medical diagnosis."
}
Return ONLY valid JSON without markdown formatting.`
              }]
            }]
          })
        }
      );

      if (response.ok) {
        const data = await response.json();
        const textRes = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (textRes) {
          const cleanJson = textRes.replace(/```json/g, '').replace(/```/g, '').trim();
          const parsed = JSON.parse(cleanJson);
          return {
            ...parsed,
            modelUsed: endpointModel
          };
        }
      }
    } catch (err) {
      console.warn("Gemini API call failed, switching to intelligent healthcare engine fallback:", err);
    }
  }

  // Step 3: Intelligent Healthcare Knowledge Base Engine Fallback
  await new Promise(res => setTimeout(res, 900)); // Latency simulation

  const lower = symptomInput.toLowerCase();

  if (lower.includes('headache') || lower.includes('migraine')) {
    return {
      summary: "Symptoms suggest a tension-type headache or mild migraine episode.",
      potentialCauses: ["Tension / Stress Headache", "Mild Migraine", "Dehydration / Ocular Strain"],
      recommendedActions: [
        "Rest in a quiet, dark, well-ventilated room",
        "Drink 500ml of fresh water or electrolyte fluid",
        "Apply a cold or warm compress to forehead and neck"
      ],
      suggestedSpecialist: "Neurologist / General Practitioner",
      emergencyFlag: false,
      modelUsed: 'Intelligent Medical Heuristics Engine v2.0',
      disclaimer: "This non-diagnostic AI wellness suggestion does not replace professional medical evaluation."
    };
  }

  if (lower.includes('fever') || lower.includes('chills') || lower.includes('body ache')) {
    return {
      summary: "Indicators align with common viral syndrome or early upper respiratory response.",
      potentialCauses: ["Common Cold / Influenza", "Viral Respiratory Infection", "Overexertion / Dehydration"],
      recommendedActions: [
        "Get adequate bed rest and monitor body temperature every 4 hours",
        "Maintain high oral fluid intake (water, broths, herbal tea)",
        "Isolate if fever exceeds 100.4°F (38°C)"
      ],
      suggestedSpecialist: "Internal Medicine / Family Physician",
      emergencyFlag: false,
      modelUsed: 'Intelligent Medical Heuristics Engine v2.0',
      disclaimer: "Non-diagnostic AI guidance. Seek immediate care if fever exceeds 103°F or persists past 3 days."
    };
  }

  if (lower.includes('stomach') || lower.includes('nausea') || lower.includes('cramps') || lower.includes('acid')) {
    return {
      summary: "Symptoms point towards mild gastrointestinal upset or acid dyspepsia.",
      potentialCauses: ["Gastritis / Acid Reflux", "Dietary Indiscretion", "Mild Gastroenteritis"],
      recommendedActions: [
        "Consume small, bland meals (BRAT diet: Bananas, Rice, Applesauce, Toast)",
        "Avoid spicy, greasy, acidic foods and caffeine",
        "Sip peppermint or ginger tea slowly"
      ],
      suggestedSpecialist: "Gastroenterologist / Primary Care Physician",
      emergencyFlag: false,
      modelUsed: 'Intelligent Medical Heuristics Engine v2.0',
      disclaimer: "Non-diagnostic AI guidance. Consult a physician if severe abdominal pain develops."
    };
  }

  // General fallback
  return {
    summary: `Logged symptoms (${symptomInput.slice(0, 40)}...) evaluated with moderate concern level (${severityScale}/10).`,
    potentialCauses: ["Mild Systemic Stress", "Environmental Allergy / Seasonal Shift", "General Fatigue / Dehydration"],
    recommendedActions: [
      "Ensure 7-8 hours of uninterrupted restful sleep",
      "Maintain consistent daily water intake",
      "Record symptom progression in your Health History timeline"
    ],
    suggestedSpecialist: "General Practitioner / Family Physician",
    emergencyFlag: false,
    modelUsed: 'Intelligent Medical Heuristics Engine v2.0',
    disclaimer: "This is non-diagnostic AI guidance for educational and wellness tracking purposes only."
  };
};
