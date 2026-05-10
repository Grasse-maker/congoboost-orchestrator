export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { messages, lossAmount } = req.body;
        const GEMINI_API_KEY = process.env.GEMINI_API_KEY; 
        
        if (!GEMINI_API_KEY) {
            return res.status(200).json({ reply: "<p>[Erreur Configuration] La clé API Gemini n'est pas configurée dans Vercel. Veuillez l'ajouter dans les variables d'environnement (GEMINI_API_KEY).</p>" });
        }

        let formattedContents = messages.map(msg => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }]
        }));

        if (formattedContents.length > 0 && formattedContents[0].role === 'model') {
            formattedContents.shift();
        }

        if (formattedContents.length === 0) {
            return res.status(200).json({ reply: "<p>Bonjour ! Je suis Atlas. Comment puis-je vous aider aujourd'hui ?</p>" });
        }

        const systemPrompt = `Tu es Atlas, l'IA Consultante Stratégique de l'agence 'Agentcy Enterprise'. 
Expert en business et modernisation scolaire. Perte annuelle détectée: ${lossAmount}$. 
Donne des conseils précis, structurés et pousse vers une consultation humaine sur WhatsApp.`;

        const payload = {
            system_instruction: { parts: [{ text: systemPrompt }] },
            contents: formattedContents,
            generationConfig: { temperature: 0.7, maxOutputTokens: 1000 }
        };

        // Liste de modèles à tester par ordre de préférence
        const modelsToTry = [
            "gemini-1.5-flash",
            "gemini-1.5-flash-001",
            "gemini-pro",
            "gemini-1.0-pro"
        ];

        let lastError = "";
        for (const model of modelsToTry) {
            try {
                const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
                        let aiText = data.candidates[0].content.parts[0].text;
                        let htmlText = aiText
                            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                            .replace(/\*(.*?)\*/g, '<em>$1</em>')
                            .replace(/^[-*] (.*)/gm, '<li>$1</li>') 
                            .replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>') 
                            .replace(/\n\n/g, '</p><p>') 
                            .replace(/\n/g, '<br>');
                        if (!htmlText.startsWith('<p>')) htmlText = `<p>${htmlText}</p>`;
                        return res.status(200).json({ reply: htmlText });
                    }
                } else {
                    const err = await response.json().catch(() => ({}));
                    lastError = err.error?.message || response.statusText;
                    console.warn(`Model ${model} failed: ${lastError}`);
                }
            } catch (e) {
                lastError = e.message;
            }
        }

        return res.status(200).json({ reply: `<p>Désolé, je rencontre des difficultés techniques avec mes modèles IA (${lastError}). Veuillez contacter un consultant humain pour avancer sur votre projet.</p>
        <div class="action-btns"><button class="action-btn primary" onclick="handleAction('action')">Parler à un humain</button></div>` });

    } catch (error) {
        return res.status(200).json({ reply: `<p>Une erreur critique est survenue : ${error.message}</p>` });
    }
}
