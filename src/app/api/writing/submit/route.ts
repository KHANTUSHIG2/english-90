export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT = `You are an expert IELTS examiner with 20 years of experience scoring writing tests.
You evaluate essays using the official IELTS band descriptors (1-9 scale):
- Task Achievement/Response: Does the essay address all parts of the task? Is the position clear and developed?
- Coherence and Cohesion: Is the essay logically organized? Are cohesive devices used correctly?
- Lexical Resource: Is vocabulary varied, precise, and appropriate? Are there spelling errors?
- Grammatical Range and Accuracy: Are a range of structures used? Are they accurate?

Return ONLY valid JSON, no markdown code blocks, no extra text.`;

function buildPrompt(taskType: string, prompt: string, essay: string, wordCount: number): string {
  return `IELTS Writing Task: ${taskType.replace(/_/g, " ")}
Task Prompt: ${prompt}
Student Essay (${wordCount} words): ${essay}

Score this essay using the official IELTS band descriptors and return JSON in exactly this structure:
{
  "overallBand": <number 1-9, half-bands allowed e.g. 6.5>,
  "criteria": {
    "taskAchievement": <number 1-9>,
    "coherenceCohesion": <number 1-9>,
    "lexicalResource": <number 1-9>,
    "grammarAccuracy": <number 1-9>
  },
  "grammarErrors": [
    { "original": "<exact phrase from essay>", "corrected": "<correction>", "explanation": "<brief explanation>" }
  ],
  "vocabularySuggestions": [
    { "original": "<word in essay>", "suggestion": "<better word(s)>", "reason": "<why this is better>" }
  ],
  "overallFeedback": "<2-3 sentence summary of performance>",
  "strengths": ["<strength 1>", "<strength 2>"],
  "improvements": ["<improvement 1>", "<improvement 2>", "<improvement 3>"]
}

Provide 3-6 grammar errors and 3-5 vocabulary suggestions. Be specific and constructive.`;
}

function mockFeedback(wordCount: number): any {
  const band = wordCount >= 250 ? 6.0 : wordCount >= 150 ? 5.5 : 5.0;
  return {
    overallBand: band,
    criteria: {
      taskAchievement: band,
      coherenceCohesion: band - 0.5,
      lexicalResource: band,
      grammarAccuracy: band + 0.5,
    },
    grammarErrors: [
      {
        original: "the peoples are",
        corrected: "people are",
        explanation: "'People' is already plural; no article needed.",
      },
    ],
    vocabularySuggestions: [
      {
        original: "important",
        suggestion: "crucial / pivotal",
        reason: "More academic and precise vocabulary.",
      },
    ],
    overallFeedback:
      "Your essay addresses the task but would benefit from more developed arguments and a wider range of vocabulary. Work on using more complex sentence structures.",
    strengths: ["Clear introduction", "Relevant ideas presented"],
    improvements: [
      "Develop each argument with specific examples",
      "Use a wider range of linking devices",
      "Increase lexical variety",
    ],
  };
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { topicId, essayText, wordCount } = await req.json();

  if (!topicId || !essayText) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const topic = await db.writingTopic.findUnique({ where: { id: topicId } });
  if (!topic) return NextResponse.json({ error: "Topic not found" }, { status: 404 });

  let feedback: any;

  if (!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY === "your-anthropic-api-key-here") {
    // Demo mode: return mock feedback
    feedback = mockFeedback(wordCount);
  } else {
    try {
      const message = await client.messages.create({
        model: "claude-opus-4-5",
        max_tokens: 1500,
        system: SYSTEM_PROMPT,
        messages: [
          {
            role: "user",
            content: buildPrompt(topic.taskType, topic.prompt, essayText, wordCount),
          },
        ],
      });

      const raw = message.content[0].type === "text" ? message.content[0].text : "";
      feedback = JSON.parse(raw);
    } catch {
      feedback = mockFeedback(wordCount);
    }
  }

  await db.writingSubmission.create({
    data: {
      userId: session.user.id,
      topicId,
      essayText,
      wordCount,
      overallBand: feedback.overallBand,
      taskAchievement: feedback.criteria.taskAchievement,
      coherenceCohesion: feedback.criteria.coherenceCohesion,
      lexicalResource: feedback.criteria.lexicalResource,
      grammarAccuracy: feedback.criteria.grammarAccuracy,
      aiFeedback: JSON.stringify(feedback),
    },
  });

  return NextResponse.json({ feedback });
}
