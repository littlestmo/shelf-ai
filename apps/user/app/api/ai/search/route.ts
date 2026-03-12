import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";
import { NextResponse } from "next/server";

const searchResultSchema = z.object({
  results: z.array(
    z.object({
      id: z.string(),
      relevanceScore: z.number().min(0).max(100),
      reason: z.string(),
    }),
  ),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { query, catalog } = body;

    if (!query || typeof query !== "string" || query.trim().length < 2) {
      return NextResponse.json(
        { error: "Query must be at least 2 characters" },
        { status: 400 },
      );
    }

    if (!Array.isArray(catalog) || catalog.length === 0) {
      return NextResponse.json(
        { error: "Catalog must be a non-empty array" },
        { status: 400 },
      );
    }

    const catalogSummary = catalog
      .map(
        (b: {
          id: string;
          title: string;
          author: string;
          category: string;
          description?: string;
        }) =>
          `[${b.id}] "${b.title}" by ${b.author} (${b.category})${b.description ? ` - ${b.description.slice(0, 100)}` : ""}`,
      )
      .join("\n");

    const { object } = await generateObject({
      model: google("gemini-2.5-flash"),
      output: "object",
      schema: searchResultSchema,
      prompt: `You are a library search assistant. A user is searching for books in a library catalog.

User query: "${query}"

Available books in the catalog:
${catalogSummary}

Return the most relevant books sorted by relevance. Include a relevance score (0-100) and a brief reason why each book matches the query. Only include books that genuinely match the query. If no books match well, return fewer results. Maximum 10 results.`,
    });

    return NextResponse.json(object);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Search failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
