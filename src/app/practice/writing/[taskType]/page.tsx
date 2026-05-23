export const dynamic = "force-dynamic";
import { db } from "@/lib/db";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// ─── Guide content per task type ─────────────────────────────────────────────

const TASK_GUIDE: Record<string, {
  label: string;
  subtitle: string;
  timeWords: string;
  overview: string;
  structure: { heading: string; detail: string }[];
  criteria: { name: string; description: string }[];
  tips: string[];
  doAndDont: { do: string[]; dont: string[] };
  bandDescriptors: { band: string; description: string; color: string }[];
}> = {
  TASK1_ACADEMIC: {
    label: "Task 1 — Academic",
    subtitle: "Describe a visual (graph, chart, table, map, or process diagram)",
    timeWords: "20 minutes · at least 150 words",
    overview:
      "You are given a graph, chart, table, map, or process diagram and asked to describe the main features in your own words. You must NOT give your opinion — just report the data objectively.",
    structure: [
      {
        heading: "Introduction (1–2 sentences)",
        detail:
          "Paraphrase the task question. State what the visual shows (what, where, when). Do NOT copy the question word for word.",
      },
      {
        heading: "Overview (2–3 sentences)",
        detail:
          "Summarise the 2–3 most important overall trends or features. This is the most important paragraph — examiners look for it first. Use phrases like 'Overall, it is clear that…' or 'In general, the most notable feature is…'",
      },
      {
        heading: "Detail Paragraph 1",
        detail:
          "Describe the first main feature with specific data (figures, percentages, years). Group similar data together. Use precise language: 'rose sharply by 15%', 'remained relatively stable at around 40%'.",
      },
      {
        heading: "Detail Paragraph 2",
        detail:
          "Describe the second main feature with supporting data. Compare and contrast where relevant. Avoid listing every single number — select the most significant.",
      },
    ],
    criteria: [
      { name: "Task Achievement", description: "Do you cover the key features? Is there a clear overview? Are data accurate?" },
      { name: "Coherence & Cohesion", description: "Is the response logically organised? Are paragraphs clear? Are linking words used well?" },
      { name: "Lexical Resource", description: "Is vocabulary varied and accurate? Do you use language of change (increase, plummet, stabilise)?" },
      { name: "Grammatical Range & Accuracy", description: "Are a variety of structures used correctly? Are tenses consistent with the data?" },
    ],
    tips: [
      "Always write an Overview paragraph — without it, you cannot score above Band 5.",
      "Paraphrase the introduction — do not copy the question.",
      "Select and group data — do not list every number.",
      "Use language of change: rose, fell, peaked, plateaued, fluctuated, remained steady.",
      "Use approximation language: approximately, roughly, around, just under/over.",
      "Check tenses: past tense for completed periods, present perfect for recent trends.",
      "Write at least 150 words but aim for 170–190 for safety.",
    ],
    doAndDont: {
      do: [
        "Paraphrase the task prompt in your introduction",
        "Include an overview of the main trends",
        "Group related data in the same paragraph",
        "Use specific figures to support your points",
        "Use a range of vocabulary for movement (surged, declined, levelled off)",
      ],
      dont: [
        "Give your personal opinion or recommend solutions",
        "Copy the question word for word",
        "Describe every single data point without grouping",
        "Ignore the most significant trends",
        "Use vague language without supporting data",
      ],
    },
    bandDescriptors: [
      { band: "Band 9", description: "Fully satisfies all requirements. Presents, highlights and illustrates key features. Well-organised with clear overview.", color: "bg-green-100 text-green-800" },
      { band: "Band 7", description: "Covers the key features with some detail. Clear overview present. Minor errors in vocabulary/grammar only.", color: "bg-blue-100 text-blue-800" },
      { band: "Band 6", description: "Addresses the task but some features may be poorly covered. Overview present but not always clear.", color: "bg-amber-100 text-amber-800" },
      { band: "Band 5", description: "Recounts detail but no clear overview. Data may be inaccurate or missing. Limited range of vocabulary.", color: "bg-orange-100 text-orange-800" },
    ],
  },

  TASK2: {
    label: "Task 2 — Essay",
    subtitle: "Write an academic essay in response to a viewpoint, argument, or problem",
    timeWords: "40 minutes · at least 250 words",
    overview:
      "You are given a statement, question, or argument and asked to write a discursive essay. Unlike Task 1, you ARE expected to give your own opinion clearly and support it with reasons and examples.",
    structure: [
      {
        heading: "Introduction (2–3 sentences)",
        detail:
          "Sentence 1: Paraphrase the topic (general statement). Sentence 2: Outline the debate/issue. Sentence 3: State your position clearly — 'This essay will argue that…' or 'In my view…'. Do NOT write a long introduction.",
      },
      {
        heading: "Body Paragraph 1 — Main Argument",
        detail:
          "Topic sentence → Explanation → Example/Evidence → Mini-conclusion. One clear idea per paragraph. Develop it fully with reasons and real-world examples. Aim for 5–7 sentences.",
      },
      {
        heading: "Body Paragraph 2 — Second Argument (or Counter-Argument)",
        detail:
          "For 'Discuss both views' questions: present the opposing view fairly here. For 'To what extent do you agree' questions: present your second supporting argument. Use cohesive devices to link back to your thesis.",
      },
      {
        heading: "Conclusion (2–3 sentences)",
        detail:
          "Restate your position in different words. Summarise the main reasons. You may add a brief final thought or recommendation. Do NOT introduce new ideas in the conclusion.",
      },
    ],
    criteria: [
      { name: "Task Achievement", description: "Do you fully address all parts of the question? Is your position clear? Are ideas well-developed with examples?" },
      { name: "Coherence & Cohesion", description: "Is the essay logically organised? Are paragraphs well-structured? Are linking words used accurately (not mechanically)?" },
      { name: "Lexical Resource", description: "Is vocabulary precise, varied, and academic? Are collocations and word forms correct? Few/no spelling errors?" },
      { name: "Grammatical Range & Accuracy", description: "Are complex structures used (conditionals, relative clauses, passive voice)? Are they accurate?" },
    ],
    tips: [
      "Read the question type carefully: 'Discuss both views', 'To what extent do you agree', 'Advantages/disadvantages', 'Causes and solutions' — each needs a different structure.",
      "State your position clearly in the introduction and stick to it throughout.",
      "One idea per paragraph — topic sentence → explanation → example → link.",
      "Use academic vocabulary: crucial, substantial, inevitable, advocate, detrimental.",
      "Use a range of grammar: conditionals, passive voice, relative clauses, complex sentences.",
      "Do not use informal language: 'a lot of' → 'a significant number of', 'good' → 'beneficial'.",
      "Aim for 260–290 words — going far over 300 words increases the risk of errors.",
    ],
    doAndDont: {
      do: [
        "Answer all parts of the question",
        "State your position clearly in the introduction",
        "Develop each point with explanation AND example",
        "Use a variety of linking words (not just 'However' and 'Furthermore')",
        "Write a proper conclusion that restates your view",
      ],
      dont: [
        "Write a list of points without developing them",
        "Change your opinion mid-essay",
        "Use memorised phrases that don't fit the topic",
        "Start every sentence with a linking word",
        "Introduce new arguments in the conclusion",
      ],
    },
    bandDescriptors: [
      { band: "Band 9", description: "Addresses all parts fully. Position is consistent throughout. Well-developed ideas with fully extended supporting examples.", color: "bg-green-100 text-green-800" },
      { band: "Band 7", description: "Addresses all parts. Clear position. Main ideas extended and supported. Some less precise vocabulary or minor grammatical errors.", color: "bg-blue-100 text-blue-800" },
      { band: "Band 6", description: "Addresses all parts but not always equally. Position is present. Main ideas supported but not fully developed.", color: "bg-amber-100 text-amber-800" },
      { band: "Band 5", description: "Only partially addresses the task. Position may be unclear. Ideas are limited and not always logically connected.", color: "bg-orange-100 text-orange-800" },
    ],
  },
};

// ─── Page ────────────────────────────────────────────────────────────────────

export default async function WritingTopicListPage({ params }: { params: { taskType: string } }) {
  const taskType = params.taskType;
  const guide = TASK_GUIDE[taskType];
  if (!guide) notFound();

  const topics = await db.writingTopic.findMany({
    where: { taskType, isPublished: true },
    orderBy: { createdAt: "asc" },
  });

  const categories = [...new Set(topics.map((t) => t.category))];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Back link */}
      <div className="mb-6">
        <Link href="/practice/writing" className="text-sm text-primary hover:underline">
          ← Back to Writing
        </Link>
      </div>

      {/* Hero */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary mb-1">{guide.label}</h1>
        <p className="text-text-secondary">{guide.subtitle}</p>
        <div className="flex items-center gap-2 mt-2">
          <span className="inline-flex items-center gap-1.5 bg-primary-50 text-primary text-sm font-medium px-3 py-1 rounded-full">
            ⏱ {guide.timeWords}
          </span>
        </div>
      </div>

      {/* Overview */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 mb-8">
        <h2 className="font-semibold text-primary mb-2">What is {guide.label}?</h2>
        <p className="text-sm text-text-primary leading-relaxed">{guide.overview}</p>
      </div>

      {/* Structure */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-text-primary mb-4">Recommended Structure</h2>
        <div className="space-y-3">
          {guide.structure.map((step, i) => (
            <div key={i} className="flex gap-4 items-start">
              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                {i + 1}
              </div>
              <div className="flex-1 bg-white border border-border rounded-xl p-4">
                <div className="font-semibold text-text-primary text-sm mb-1">{step.heading}</div>
                <p className="text-sm text-text-secondary leading-relaxed">{step.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Marking Criteria */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-text-primary mb-4">How Examiners Mark Your Work</h2>
        <p className="text-sm text-text-secondary mb-4">
          Each criterion is worth <strong>25%</strong> of your Task {taskType === "TASK2" ? "2" : "1"} score.
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          {guide.criteria.map((c, i) => (
            <div key={i} className="bg-white border border-border rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-full bg-primary-50 text-primary text-xs font-bold flex items-center justify-center">
                  {i + 1}
                </div>
                <span className="font-semibold text-text-primary text-sm">{c.name}</span>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">{c.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Band Descriptors */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-text-primary mb-4">Band Score Guide</h2>
        <div className="space-y-3">
          {guide.bandDescriptors.map((b) => (
            <div key={b.band} className="flex items-start gap-3 bg-white border border-border rounded-xl p-4">
              <span className={`text-sm font-bold px-2.5 py-1 rounded-full flex-shrink-0 ${b.color}`}>
                {b.band}
              </span>
              <p className="text-sm text-text-secondary leading-relaxed">{b.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Do & Don't */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-text-primary mb-4">Do's and Don'ts</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-green-50 border border-green-100 rounded-xl p-5">
            <div className="font-semibold text-green-800 mb-3 flex items-center gap-1.5">
              <span className="text-lg">✓</span> Do
            </div>
            <ul className="space-y-2">
              {guide.doAndDont.do.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-green-900">
                  <span className="text-success mt-0.5 flex-shrink-0">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-red-50 border border-red-100 rounded-xl p-5">
            <div className="font-semibold text-red-800 mb-3 flex items-center gap-1.5">
              <span className="text-lg">✗</span> Don't
            </div>
            <ul className="space-y-2">
              {guide.doAndDont.dont.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-red-900">
                  <span className="text-danger mt-0.5 flex-shrink-0">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Tips */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-text-primary mb-4">Examiner Tips</h2>
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-5">
          <ul className="space-y-3">
            {guide.tips.map((tip, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-text-primary">
                <span className="w-5 h-5 rounded-full bg-warning text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                  {i + 1}
                </span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Topic list */}
      <div className="border-t border-border pt-10">
        <h2 className="text-2xl font-bold text-text-primary mb-2">Practice Topics</h2>
        <p className="text-text-secondary mb-6">{topics.length} topics available — choose one to start writing.</p>

        {topics.length === 0 ? (
          <div className="text-center py-16 text-text-secondary">
            <div className="text-5xl mb-4">✍️</div>
            <p>No topics available yet. Check back soon!</p>
          </div>
        ) : (
          categories.map((cat) => (
            <div key={cat} className="mb-8">
              <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wide mb-3">
                {cat}
              </h3>
              <div className="space-y-3">
                {topics
                  .filter((t) => t.category === cat)
                  .map((topic) => (
                    <Link key={topic.id} href={`/practice/writing/topic/${topic.id}`}>
                      <Card className="hover:shadow-md transition-shadow cursor-pointer border border-border">
                        <CardContent className="p-5 flex items-center justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-text-primary line-clamp-2">
                              {topic.title}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              {topic.imageUrl && <Badge variant="info">Has image</Badge>}
                            </div>
                          </div>
                          <svg className="w-5 h-5 text-text-secondary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
