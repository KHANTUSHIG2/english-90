export const dynamic = "force-dynamic";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: "🎧",
    title: "Listening Tests",
    description:
      "Authentic 4-section tests with real-time audio. Instant band score on submission with detailed answer review.",
    color: "bg-blue-50 border-blue-100",
    iconBg: "bg-blue-100",
    link: "/practice/listening",
  },
  {
    icon: "📖",
    title: "Reading Tests",
    description:
      "Academic and General Training passages with a split-screen reader. Highlight text, track time, review mistakes.",
    color: "bg-green-50 border-green-100",
    iconBg: "bg-green-100",
    link: "/practice/reading",
  },
  {
    icon: "✍️",
    title: "Writing + AI Feedback",
    description:
      "Submit Task 1 and Task 2 essays and receive an instant AI-generated band score across all 4 criteria.",
    color: "bg-amber-50 border-amber-100",
    iconBg: "bg-amber-100",
    link: "/practice/writing",
  },
  {
    icon: "📚",
    title: "Vocabulary & Grammar",
    description:
      "Topic-based word lists, flashcards, collocations, and grammar lessons with quizzes.",
    color: "bg-purple-50 border-purple-100",
    iconBg: "bg-purple-100",
    link: "/practice/vocabulary",
  },
];

const steps = [
  {
    num: "01",
    title: "Create your free account",
    desc: "Sign up in 30 seconds with email or Google.",
  },
  {
    num: "02",
    title: "Choose a skill to practise",
    desc: "Select from Listening, Reading, Writing, or Vocabulary.",
  },
  {
    num: "03",
    title: "Get instant feedback",
    desc: "See your band score and detailed corrections right away.",
  },
];

const testimonials = [
  {
    name: "khantushig",
    text: "who made this website — this site is very good",
  },
];

export default function HomePage() {
  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-800 to-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            Free access — no credit card required
          </div>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6 text-balance">
            Achieve Your Target{" "}
            <span className="text-blue-300">IELTS Band Score</span>
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-10 text-balance">
            Practice all four IELTS skills with authentic tests, get AI-powered writing
            feedback, and track your progress — all in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="bg-white text-primary hover:bg-blue-50 w-full sm:w-auto">
                Start Free Practice
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 w-full sm:w-auto">
                Log In
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-6 max-w-lg mx-auto">
            {[
            
              { val: "4.8 / 5", label: "Rating" },
              { val: "Band 7+", label: "Avg. improvement" },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-2xl font-bold">{s.val}</div>
                <div className="text-blue-200 text-sm">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              Everything you need to succeed
            </h2>
            <p className="text-text-secondary text-lg max-w-xl mx-auto">
              From authentic practice tests to AI-powered essay scoring, we have every tool
              you need.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => (
              <Link key={f.title} href={f.link}>
                <Card className={`border ${f.color} hover:shadow-md transition-shadow h-full cursor-pointer`}>
                  <CardContent className="p-6">
                    <div className={`w-12 h-12 ${f.iconBg} rounded-xl flex items-center justify-center text-2xl mb-4`}>
                      {f.icon}
                    </div>
                    <h3 className="font-semibold text-text-primary mb-2">{f.title}</h3>
                    <p className="text-text-secondary text-sm leading-relaxed">{f.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* AI Writing feedback preview */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="text-primary font-semibold text-sm uppercase tracking-wide mb-3">
                AI-Powered Writing Feedback
              </div>
              <h2 className="text-3xl font-bold text-text-primary mb-4">
                Know exactly where to improve
              </h2>
              <p className="text-text-secondary mb-6 leading-relaxed">
                Submit your essay and receive a detailed analysis in seconds — band scores
                across all 4 criteria, grammar corrections, vocabulary upgrades, and a
                model band-9 answer.
              </p>
              <ul className="space-y-3">
                {[
                  "Estimated band score per criterion",
                  "Grammar errors highlighted with corrections",
                  "Vocabulary suggestions (word upgrades)",
                  "Cohesion and paragraph structure review",
                  "Band-9 model answer for comparison",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-text-primary">
                    <span className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center text-success text-xs font-bold">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Link href="/practice/writing">
                  <Button>Try Writing Feedback</Button>
                </Link>
              </div>
            </div>

            {/* Mock feedback card */}
            <div className="bg-muted rounded-2xl p-6 border border-border">
              <div className="flex items-center justify-between mb-4">
                <span className="font-semibold text-text-primary">Essay Feedback</span>
                <span className="bg-amber-100 text-amber-800 text-xs font-semibold px-3 py-1 rounded-full">
                  Band 6.5
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-4">
                {[
                  { label: "Task Achievement", score: 7.0 },
                  { label: "Coherence & Cohesion", score: 6.5 },
                  { label: "Lexical Resource", score: 6.0 },
                  { label: "Grammar Accuracy", score: 6.5 },
                ].map((c) => (
                  <div key={c.label} className="bg-white rounded-lg p-3 border border-border">
                    <div className="text-xs text-text-secondary mb-1">{c.label}</div>
                    <div className="text-lg font-bold text-primary">{c.score}</div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5 mt-1">
                      <div
                        className="bg-primary rounded-full h-1.5"
                        style={{ width: `${(c.score / 9) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-red-50 border border-red-100 rounded-lg p-3 text-xs">
                <span className="font-semibold text-red-700">Grammar: </span>
                <span className="line-through text-red-500">The people is</span>
                <span className="text-success ml-2 font-medium">People are</span>
                <span className="text-text-secondary ml-1">— subject-verb agreement</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-primary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-text-primary mb-12">How it works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((s, i) => (
              <div key={s.num} className="relative">
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-primary-100" />
                )}
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg mb-4">
                    {s.num}
                  </div>
                  <h3 className="font-semibold text-text-primary mb-2">{s.title}</h3>
                  <p className="text-text-secondary text-sm">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-text-primary text-center mb-12">
            Students who achieved their goals
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <Card key={t.name} className="border border-border">
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-warning text-sm">★</span>
                    ))}
                  </div>
                  <p className="text-text-secondary text-sm leading-relaxed mb-4">"{t.text}"</p>
                  <div className="flex items-center">
                    <span className="font-semibold text-text-primary text-sm">{t.name}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary text-white text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">Ready to start your IELTS journey?</h2>
          <p className="text-blue-100 mb-8">
            Join thousands of students practising smarter. Free access, no credit card.
          </p>
          <Link href="/register">
            <Button size="lg" className="bg-white text-primary hover:bg-blue-50">
              Create Free Account
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
