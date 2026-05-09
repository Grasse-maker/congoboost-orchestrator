export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { messages, lossAmount } = req.body;
        
        // This key is now securely pulled from Vercel Environment Variables
        const GEMINI_API_KEY = process.env.GEMINI_API_KEY; 
        
        if (!GEMINI_API_KEY) {
            return res.status(500).json({ error: 'API Key not configured' });
        }
        // Format conversation history for Gemini
        const formattedContents = messages.map(msg => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }]
        }));

        // Context injected as system instruction
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
            contents: formattedContents,
            systemInstruction: {
                role: "system",
                parts: [{ text: systemPrompt }]
            },
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 500,
            }
        };

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errText = await response.text();
            console.error("Gemini API Error:", errText);
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.candidates && data.candidates[0] && data.candidates[0].content) {
            let aiText = data.candidates[0].content.parts[0].text;
            
            // Advanced markdown to HTML parsing
            let htmlText = aiText
                .replace(/```(.*?)```/gs, '<pre><code>$1</code></pre>') // Code blocks
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\*(.*?)\*/g, '<em>$1</em>')
                .replace(/^[-*] (.*)/gm, '<li>$1</li>') // Bullet points
                .replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>') // Wrap lists
                .replace(/<\/ul><ul>/g, '') // Clean up nested lists
                .replace(/\n\n/g, '</p><p>') // Paragraphs
                .replace(/\n/g, '<br>');
            
            if (!htmlText.startsWith('<p>')) htmlText = `<p>${htmlText}</p>`;
                
            return res.status(200).json({ reply: htmlText });
        } else {
            throw new Error("Invalid response format from Gemini");
        }

    } catch (error) {
        console.error('Chat API Error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
