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

        // Format conversation history for Gemini
        let formattedContents = messages
            .map(msg => ({
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
Tu es un expert en entrepreneuriat, économie, business, et modernisation des établissements scolaires.
Tu parles à un dirigeant d'école ou un entrepreneur. 
Le diagnostic a révélé une perte annuelle de ${lossAmount}$ due à une gestion obsolète. 
Ta mission est de fournir des conseils EXTRÊMEMENT précis et détaillés. 
Analyse les causes (frais non perçus, inefficacité administrative, image de marque dégradée) et explique comment la transition vers un écosystème SaaS (logiciel de gestion, bulletins numériques, automatisation WhatsApp) transforme une école en une entreprise d'élite.
Ton ton doit être analytique, stratégique et percutant. 
Si l'utilisateur demande comment faire ou semble convaincu, pousse-le à cliquer sur 'Parler à un humain' pour un audit personnalisé.
Fais des réponses structurées avec des points clés.`;

        const payload = {
            system_instruction: {
                parts: [{ text: systemPrompt }]
            },
            contents: formattedContents,
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 1000,
            }
        };

        let response;
        try {
            response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
        } catch (fetchErr) {
            return res.status(200).json({ reply: `<p>Erreur de connexion au serveur IA : ${fetchErr.message}. Vérifiez que le serveur Vercel a accès à Internet.</p>` });
        }

        if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            console.error("Gemini API Error:", errData);
            return res.status(200).json({ reply: `<p>L'IA a retourné une erreur (${response.status}) : ${errData.error?.message || 'Erreur inconnue'}.</p>` });
        }

        const data = await response.json();
        
        if (data.candidates && data.candidates[0]) {
            const candidate = data.candidates[0];
            
            if (candidate.content && candidate.content.parts && candidate.content.parts[0]) {
                let aiText = candidate.content.parts[0].text;
                
                // Advanced markdown to HTML parsing
                let htmlText = aiText
                    .replace(/```(.*?)```/gs, '<pre><code>$1</code></pre>') 
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/\*(.*?)\*/g, '<em>$1</em>')
                    .replace(/^[-*] (.*)/gm, '<li>$1</li>') 
                    .replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>') 
                    .replace(/<\/ul><ul>/g, '') 
                    .replace(/\n\n/g, '</p><p>') 
                    .replace(/\n/g, '<br>');
                
                if (!htmlText.startsWith('<p>')) htmlText = `<p>${htmlText}</p>`;
                    
                return res.status(200).json({ reply: htmlText });
            } else if (candidate.finishReason === 'SAFETY') {
                return res.status(200).json({ reply: "<p>Désolé, je ne peux pas répondre à cette demande pour des raisons de sécurité. Concentrons-nous sur la stratégie de votre établissement.</p>" });
            } else {
                return res.status(200).json({ reply: "<p>Désolé, j'ai eu un problème pour formuler ma réponse (FinishReason: " + candidate.finishReason + "). Essayons de reformuler.</p>" });
            }
        } else {
            return res.status(200).json({ reply: "<p>Désolé, aucune réponse n'a été générée par l'IA. Veuillez réessayer.</p>" });
        }

    } catch (error) {
        console.error('Chat API Error:', error);
        return res.status(200).json({ reply: `<p>Une erreur interne est survenue : ${error.message}</p>` });
    }
}
