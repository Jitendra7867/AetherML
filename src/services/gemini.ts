export interface Message {
  role: 'user' | 'model';
  text: string;
}

export async function askGemini(chatHistory: Message[], newPrompt: string): Promise<string> {
  const customKey = localStorage.getItem('aether_custom_gemini_key');
  const apiKey = customKey || import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("Gemini API key is not configured. Please add an API key in the chat settings or project .env file.");
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
  
  // Format history for Gemini API: roles must be 'user' or 'model'
  const formattedContents = [
    ...chatHistory.map(msg => ({
      role: msg.role,
      parts: [{ text: msg.text }]
    })),
    {
      role: 'user',
      parts: [{ text: newPrompt }]
    }
  ];

  const requestBody = {
    contents: formattedContents,
    systemInstruction: {
      parts: [
        {
          text: `You are the AetherML AI Assistant, a friendly and expert Machine Learning tutor. Your sole purpose is to help users learn Machine Learning and understand the content on this website (AetherML).

CRITICAL RULES:
1. ONLY answer queries that are related to Machine Learning (math, stats, algorithms, training, models, frameworks, datasets) OR queries directly related to the AetherML website itself (e.g., navigating the site, using the visualizers, curriculum structure).
2. If the user asks about ANYTHING else (including but not limited to general web programming, software development outside ML, general mathematics outside ML, writing essays, recipes, creative writing, general knowledge, sports, history, geography, coding in languages/frameworks not related to data science/ML), you must politely refuse to answer.
3. Your refusal message should be: "I'm sorry, I can only answer questions related to Machine Learning and the AetherML platform. Let's focus on learning ML!" or a polite variation of this. Do not answer any forbidden queries under any circumstances.
4. Keep your responses concise, structured, and easy to read. Use Markdown formatting for headings, lists, bold text, and code blocks where applicable.`
        }
      ]
    },
    generationConfig: {
      temperature: 0.2,
      maxOutputTokens: 1000
    }
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error("Gemini API Error:", errorData);
    throw new Error(errorData?.error?.message || "Failed to connect to the AI model.");
  }

  const data = await response.json();
  const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!replyText) {
    throw new Error("Invalid response received from Gemini API.");
  }

  return replyText;
}
