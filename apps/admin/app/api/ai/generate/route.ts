import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";
import { NextResponse } from "next/server";

const bookSchema = z.object({
  title: z.string(),
  author: z.string(),
  synopsis: z.string(),
  chapters: z.array(z.string()),
  category: z.string(),
  isbn: z.string(),
  pages: z.number(),
  language: z.string(),
  publisher: z.string(),
  edition: z.string(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { prompt } = body;

    if (!prompt || typeof prompt !== "string" || prompt.trim().length < 10) {
      return NextResponse.json(
        { error: "Prompt must be at least 10 characters" },
        { status: 400 },
      );
    }

    const { object } = await generateObject({
      model: google("gemini-2.5-flash"),
      output: "object",
      schema: bookSchema,
      prompt: `You are a creative book generator for a library management system. Based on the following description, generate a complete book entry with realistic metadata.

Description: "${prompt}"

Generate:
- A compelling title
- A realistic author name (not "AI Generated")
- A detailed synopsis (2-3 paragraphs)
- 8-12 chapter titles that tell a story arc
- An appropriate category (one of: Fiction, Non-Fiction, Technology, Science, History, Self-Help, Academic, Thriller, Mystery, Fantasy, Biography, Philosophy, Art, Romance, Dystopian, Journal, Poetry, Comics)
- A realistic ISBN-13 number
- Estimated page count (150-600)
- Language (default English)
- A realistic publisher name
- Edition (e.g. "First Edition")`,
    });

    return NextResponse.json(object);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
