import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";
import { NextResponse } from "next/server";

const shuffleResultSchema = z.object({
  picks: z.array(
    z.object({
      id: z.string(),
      reason: z.string(),
    }),
  ),
  theme: z.string(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { catalog } = body;

    if (!Array.isArray(catalog) || catalog.length === 0) {
      return NextResponse.json(
        { error: "Catalog must be a non-empty array" },
        { status: 400 },
      );
    }

    const catalogSummary = catalog
      .map(
        (b: { id: string; title: string; author: string; category: string }) =>
          `[${b.id}] "${b.title}" by ${b.author} (${b.category})`,
      )
      .join("\n");

    const { object } = await generateObject({
      model: google("gemini-2.5-flash"),
      output: "object",
      schema: shuffleResultSchema,
      prompt: `You are a creative librarian helping users discover unexpected books. Pick 4-6 books from the catalog below that share an interesting thematic connection. Be creative, find surprising links between books that might seem unrelated at first glance.

Available books:
${catalogSummary}

Pick books and explain the surprising thematic connection. Give each pick a short reason why it fits the theme. Also provide the overall theme name that connects them.`,
    });

    return NextResponse.json(object);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Shuffle failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
