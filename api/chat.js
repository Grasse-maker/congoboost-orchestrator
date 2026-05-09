export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { messages, lossAmount } = req.body;
        
        // This key is safely hidden on the Vercel server, not exposed to the browser
        const GEMINI_API_KEY = "AIzaSyAzJYgQpcqnFrkQmPfB3Iglrj46zwkW9IA"; 
        
        // Format conversation history for Gemini
        const formattedContents = messages.map(msg => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }]
        }));

        // Context injected as system instruction
        const systemPrompt = `Tu es Atlas, l'IA Consultante Experte de l'agence 'Agentcy Enterprise'. 
Tu parles à un directeur d'école ou un entrepreneur. 
Le diagnostic a révélé que son école perd environ ${lossAmount}$ par an à cause d'une gestion manuelle (frictions administratives, retards de paiement, etc).
Ton but est de l'écouter, de répondre intelligemment à ses questions sur le business, l'économie ou la gestion scolaire avec un ton très professionnel, analytique et rassurant.
Si l'utilisateur semble convaincu ou demande comment faire, tu DOIS lui proposer de 'Passer à l'action' en parlant à un consultant humain, et lui dire de cliquer sur le bouton 'Parler à un humain'.
Fais des réponses concises, structurées et percutantes. Pas de longs paragraphes.`;

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
            const aiText = data.candidates[0].content.parts[0].text;
            
            // Basic markdown to HTML parsing for the response
            let htmlText = aiText
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\*(.*?)\*/g, '<em>$1</em>')
                .replace(/\n/g, '<br>');
                
            return res.status(200).json({ reply: htmlText });
        } else {
            throw new Error("Invalid response format from Gemini");
        }

    } catch (error) {
        console.error('Chat API Error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
