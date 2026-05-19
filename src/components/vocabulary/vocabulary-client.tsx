"use client";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Word {
  id: string;
  word: string;
  definition: string;
  example: string;
  category: string;
  collocations: string | null;
}

export function VocabularyClient({
  words,
  categories,
  mastered,
  userId,
}: {
  words: Word[];
  categories: string[];
  mastered: string[];
  userId?: string;
}) {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [masteredIds, setMasteredIds] = useState<Set<string>>(new Set(mastered));
  const [selectedWord, setSelectedWord] = useState<Word | null>(null);
  const [flashcardMode, setFlashcardMode] = useState(false);
  const [flashIdx, setFlashIdx] = useState(0);
  const [showDef, setShowDef] = useState(false);

  const filtered =
    activeCategory === "All" ? words : words.filter((w) => w.category === activeCategory);

  const flashWords = filtered.filter((w) => !masteredIds.has(w.id));

  async function toggleMastered(wordId: string) {
    if (!userId) return;
    const isMastered = masteredIds.has(wordId);
    const newSet = new Set(masteredIds);
    if (isMastered) newSet.delete(wordId);
    else newSet.add(wordId);
    setMasteredIds(newSet);

    await fetch("/api/vocabulary/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ wordId, mastered: !isMastered }),
    });
  }

  if (flashcardMode && flashWords.length > 0) {
    const word = flashWords[flashIdx % flashWords.length];
    return (
      <div className="max-w-lg mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button variant="outline" size="sm" onClick={() => setFlashcardMode(false)}>← Browse Mode</Button>
          <span className="text-sm text-text-secondary">{flashIdx + 1} / {flashWords.length} remaining</span>
        </div>
        <div
          className="bg-white rounded-2xl border border-border shadow-md p-8 text-center cursor-pointer min-h-56 flex flex-col items-center justify-center"
          onClick={() => setShowDef(!showDef)}
        >
          <div className="text-3xl font-bold text-primary mb-2">{word.word}</div>
          <Badge variant="info" className="mb-4">{word.category}</Badge>
          {showDef ? (
            <>
              <p className="text-text-primary mb-2">{word.definition}</p>
              <p className="text-sm text-text-secondary italic">"{word.example}"</p>
            </>
          ) : (
            <p className="text-text-secondary text-sm">Tap to reveal definition</p>
          )}
        </div>
        <div className="flex gap-3 mt-6">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => { setFlashIdx((p) => (p + 1) % flashWords.length); setShowDef(false); }}
          >
            Skip
          </Button>
          <Button
            variant="secondary"
            className="flex-1"
            onClick={() => { toggleMastered(word.id); setFlashIdx((p) => (p + 1) % flashWords.length); setShowDef(false); }}
          >
            Got it!
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {["All", ...categories].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                cat === activeCategory
                  ? "bg-primary text-white"
                  : "bg-white border border-border text-text-secondary hover:text-primary"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <Button size="sm" variant="outline" onClick={() => { setFlashcardMode(true); setFlashIdx(0); setShowDef(false); }}>
          Flashcard Mode
        </Button>
        <span className="text-sm text-text-secondary ml-auto">
          {masteredIds.size} / {words.length} mastered
        </span>
      </div>

      {/* Word grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((word) => {
          const isMastered = masteredIds.has(word.id);
          return (
            <Card
              key={word.id}
              className={`cursor-pointer transition-all border ${isMastered ? "border-green-200 bg-green-50" : "border-border hover:shadow-md"}`}
              onClick={() => setSelectedWord(selectedWord?.id === word.id ? null : word)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-semibold text-text-primary">{word.word}</div>
                    <Badge variant="info" className="mt-1 text-xs">{word.category}</Badge>
                  </div>
                  {userId && (
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleMastered(word.id); }}
                      className={`text-lg transition-colors ${isMastered ? "text-success" : "text-gray-300 hover:text-success"}`}
                      title={isMastered ? "Mastered" : "Mark as mastered"}
                    >
                      ✓
                    </button>
                  )}
                </div>
                {selectedWord?.id === word.id && (
                  <div className="mt-3 pt-3 border-t border-border text-sm space-y-2">
                    <p className="text-text-primary">{word.definition}</p>
                    <p className="text-text-secondary italic text-xs">"{word.example}"</p>
                    {word.collocations && (
                      <div className="text-xs">
                        <span className="font-semibold text-primary">Collocations: </span>
                        <span className="text-text-secondary">
                          {(JSON.parse(word.collocations) as string[]).join(", ")}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
