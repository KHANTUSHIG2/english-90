export const dynamic = "force-dynamic";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

const tasks = [
  {
    type: "TASK1_ACADEMIC",
    label: "Task 1 — Academic",
    desc: "Describe a graph, chart, diagram, or map in at least 150 words.",
    time: "20 minutes",
    words: "150+",
    icon: "📊",
    color: "bg-blue-50 border-blue-100 hover:border-blue-300",
    href: "/practice/writing/TASK1_ACADEMIC",
  },
  {
    type: "TASK2",
    label: "Task 2 — Essay",
    desc: "Write an essay in response to a viewpoint or argument in at least 250 words.",
    time: "40 minutes",
    words: "250+",
    icon: "✍️",
    color: "bg-amber-50 border-amber-100 hover:border-amber-300",
    href: "/practice/writing/TASK2",
  },
];

export default function WritingPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary mb-2">Writing Practice</h1>
        <p className="text-text-secondary">
          Submit your essay and receive instant AI-powered feedback with band scores across
          all four criteria.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {tasks.map((t) => (
          <Link key={t.type} href={t.href}>
            <Card className={`border ${t.color} transition-all h-full cursor-pointer`}>
              <CardContent className="p-6">
                <div className="text-4xl mb-4">{t.icon}</div>
                <h2 className="text-lg font-bold text-text-primary mb-2">{t.label}</h2>
                <p className="text-sm text-text-secondary mb-4 leading-relaxed">{t.desc}</p>
                <div className="flex gap-4 text-xs text-text-secondary">
                  <span>⏱ {t.time}</span>
                  <span>📝 {t.words} words</span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-10 bg-primary-50 rounded-xl p-6 border border-primary-100">
        <h3 className="font-semibold text-primary mb-2">How AI Feedback Works</h3>
        <ul className="space-y-2 text-sm text-text-secondary">
          <li className="flex items-start gap-2">
            <span className="text-primary font-bold mt-0.5">1.</span>
            Choose a task type and browse topics by category.
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary font-bold mt-0.5">2.</span>
            Write your essay in the timed editor with a live word counter.
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary font-bold mt-0.5">3.</span>
            Submit and receive your band score + detailed feedback within 30 seconds.
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary font-bold mt-0.5">4.</span>
            Review grammar errors, vocabulary suggestions, and a model answer.
          </li>
        </ul>
      </div>
    </div>
  );
}
