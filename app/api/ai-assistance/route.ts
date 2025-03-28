import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Allow longer processing time for AI responses
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const {
      prompt,
      code,
      language,
      examples,
      constraints,
      title,
      description,
      difficulty,
    } = await req.json();

    // Initialize the Google Generative AI with the API key
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

    // Get the generative model (Gemini Pro)
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Create a system prompt that includes context about the code
    const systemPrompt = `You are an AI coding assistant for the Syntax Spring a modern, interactive coding challenge platform designed to help developers improve their programming skills through hands-on practice. 
    Help users with their coding questions, explain concepts, suggest improvements, 
    and provide code examples but not a direct solution to the problem.
    
    Challenge Title: ${title}
    Challenge Description: ${description}
    Difficulty: ${difficulty}. Let your response nature be based on the DIFFICULTY level (it can be EASY, MEDIUM, HARD)
    constraints: ${constraints}
    Examples of solution behavior: ${examples}

    The user is working with ${language} code. Here is their current code:
    \`\`\`${language}
    ${code}
    \`\`\`
    
    User query: ${prompt}
    
    Based on the above information provide the user with tips, hints, online reference on how to complete the challenge but NOT THE ACTUAL solution. Let the user learn and figure out the solution with your help.
    
    Also provide them with advice on the importance of going thought process and figuring out the answer without using any ai tool or any other code examples out there to provide them solution. They should take their time and learn.
    
    NB: Only respond to learning, coding and motivation related questions. Else simply say Sorry I can't help out with that.
    `;

    // Generate content using the Gemini model
    const result = await model.generateContent(systemPrompt);
    const response = result.response;
    const text = response.text();

    return NextResponse.json({
      response: text,
    });
  } catch (error) {
    console.error("AI assistance error:", error);
    return NextResponse.json(
      {
        error: "Failed to get AI assistance",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
