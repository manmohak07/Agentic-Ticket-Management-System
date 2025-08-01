import { createAgent, gemini } from "@inngest/agent-kit";

const analyzeTicket = async (ticket) => {
    const agent = createAgent({
        model: gemini({
            model: "gemini-2.0-flash-lite",
            apiKey: process.env.GEMINI_API_KEY,
        }),
        name: 'AI Ticket Assistant',
        system: `You are an expert AI assistant integrated into a technical support ticketing system. Your primary function is to analyze new support tickets and provide a structured JSON output to assist human moderators.

                For every ticket you process, you must perform the following tasks:

                    1) Summarize: Create a concise summary of the user's issue.
                    2) Estimate Priority: Determine the priority of the ticket. It must be one of 'low', 'medium', or 'high'.
                    3) Provide Helpful Notes: Write actionable notes for the human moderator. This could include potential root causes, next diagnostic steps, or questions to ask the user for more clarity.
                    4) List Relevant Skills: Identify and list the technical skills required to resolve the issue.

                VVIMPORTANT
                CRITICAL INSTRUCTIONS:

                    1) Your entire response MUST be a single, valid JSON object.
                    2)Do NOT include any text, comments, explanations, or markdown formatting before or after the JSON object.
                    3)The JSON object must conform to this exact structure: { "summary": "string", "priority": "low" | "medium" | "high", "helpfulNotes": "string", "relatedSkills": ["string"] }`
    });

    const respone = await agent.run(`
        You are a ticket triage agent. ONLY RETURN a strict JSON object with NO extra tests, markdown or headers.

        Analyze the ticket and provide a JSON object with:
            - summary: A short sentence (1-2 lines) summarizing the issue.
            - priority: One of 'low', 'medium', or 'high'.
            - helpful notes: A detailed technical explanation that the moderator can use to resolve the issue. Include any relevant external links or resources.
            - related skills: A JSON array required to highlight technical skills required to resolve the issue (e.g. ["React", "MongoDB"])
        
        Respond only in JSON format, below is an example for your reference:
            {
                "summary": "Short summary of the ticket",
                "priority": "low" | "medium" | "high",
                "helpfulNotes": "Here are useful tips...",
                "relatedSkills": ["React", "Node.js"]
            }

        ---

        - Title: ${ticket.title}
        - Description: ${ticket.description}
        `);
    
    const raw = respone.output[0].context;

    try {
        const match = raw.match(/```json\s*([\s\S]*?)\s*```/i);
        const jsonString = match ? match[1] : raw.trim();
        
        return JSON.parse(jsonString);
    } catch (error) {
        console.log("Failed to get response from AI " + error.message);
        return null;
    }
}

export default analyzeTicket;
