import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();

async function main() {
  const title = "Academic Listening Practice Test 12";
  const exists = await db.listeningTest.findFirst({ where: { title } });
  if (exists) { console.log("Already exists, skipping."); return; }

  await db.listeningTest.create({
    data: {
      title,
      description: "4-part academic listening test. Part 1: phone call for family visit advice. Part 2: football stadium tour guide talk. Part 3: students discuss handwriting research. Part 4: lecture on the Chembe Bird Sanctuary.",
      audioUrl: "https://REPLACE-WITH-YOUR-AUDIO-URL.mp3",
      duration: 1800,
      isPublished: false,
      sections: {
        create: [
          {
            sectionNum: 1,
            title: "Part 1 — Advice on Family Visit",
            description: "Complete the notes below. Write ONE WORD AND/OR A NUMBER for each answer.",
            questions: {
              create: [
                { questionNum: 1,  type: "FILL_BLANK", prompt: "Accommodation: ___ Hotel on George Street", correctAnswer: "Kings" },
                { questionNum: 2,  type: "FILL_BLANK", prompt: "Cost of family room per night: £___ (approx.)", correctAnswer: "125" },
                { questionNum: 3,  type: "FILL_BLANK", prompt: "Recommended Trips: A ___ tour of the city centre (starts in Carlton Square)", correctAnswer: "walking" },
                { questionNum: 4,  type: "FILL_BLANK", prompt: "A trip by ___ to the old fort", correctAnswer: "boat" },
                { questionNum: 5,  type: "FILL_BLANK", prompt: "Science Museum — best day to visit: ___", correctAnswer: "Tuesday" },
                { questionNum: 6,  type: "FILL_BLANK", prompt: "See the exhibition about ___ which opens soon", correctAnswer: "space" },
                { questionNum: 7,  type: "FILL_BLANK", prompt: "Clacton Market — good for ___ food", correctAnswer: "vegetarian" },
                { questionNum: 8,  type: "FILL_BLANK", prompt: "Clacton Market — need to have lunch before ___ p.m.", correctAnswer: "2.30" },
                { questionNum: 9,  type: "FILL_BLANK", prompt: "Theatre Tickets: save up to ___% on ticket prices at bargaintickets.com", correctAnswer: "75" },
                { questionNum: 10, type: "FILL_BLANK", prompt: "Free Activities — Blakewell Gardens: climb Telegraph Hill to see a view of the ___", correctAnswer: "port" },
              ],
            },
          },
          {
            sectionNum: 2,
            title: "Part 2 — Guide's Talk at a Football Stadium",
            questions: {
              create: [
                {
                  questionNum: 11, type: "MCQ",
                  prompt: "Which TWO things does the speaker say about visiting the football stadium with children? (Answer 1 of 2)",
                  options: JSON.stringify(["A. Children can get their photo taken with a football player", "B. There is a competition for children today", "C. Parents must stay with their children at all times", "D. Children will need sunhats and drinks", "E. The café has a special offer on meals for children"]),
                  correctAnswer: "B",
                },
                {
                  questionNum: 12, type: "MCQ",
                  prompt: "Which TWO things does the speaker say about visiting the football stadium with children? (Answer 2 of 2)",
                  options: JSON.stringify(["A. Children can get their photo taken with a football player", "B. There is a competition for children today", "C. Parents must stay with their children at all times", "D. Children will need sunhats and drinks", "E. The café has a special offer on meals for children"]),
                  correctAnswer: "C",
                },
                {
                  questionNum: 13, type: "MCQ",
                  prompt: "Which TWO features of the stadium tour are new this year? (Answer 1 of 2)",
                  options: JSON.stringify(["A. VIP tour", "B. 360 cinema experience", "C. audio guide", "D. dressing room tour", "E. tours in other languages"]),
                  correctAnswer: "A",
                },
                {
                  questionNum: 14, type: "MCQ",
                  prompt: "Which TWO features of the stadium tour are new this year? (Answer 2 of 2)",
                  options: JSON.stringify(["A. VIP tour", "B. 360 cinema experience", "C. audio guide", "D. dressing room tour", "E. tours in other languages"]),
                  correctAnswer: "C",
                },
                {
                  questionNum: 15, type: "MCQ",
                  prompt: "Events in the history of football: Which event took place in 1870?",
                  options: JSON.stringify(["A. the introduction of pay for the players", "B. a change to the design of the goal", "C. the first use of lights for matches", "D. the introduction of goalkeepers", "E. the first international match", "F. two changes to the rules of the game", "G. the introduction of a fee for spectators", "H. an agreement on the length of a game"]),
                  correctAnswer: "D",
                },
                {
                  questionNum: 16, type: "MCQ",
                  prompt: "Events in the history of football: Which event took place in 1874?",
                  options: JSON.stringify(["A. the introduction of pay for the players", "B. a change to the design of the goal", "C. the first use of lights for matches", "D. the introduction of goalkeepers", "E. the first international match", "F. two changes to the rules of the game", "G. the introduction of a fee for spectators", "H. an agreement on the length of a game"]),
                  correctAnswer: "F",
                },
                {
                  questionNum: 17, type: "MCQ",
                  prompt: "Events in the history of football: Which event took place in 1875?",
                  options: JSON.stringify(["A. the introduction of pay for the players", "B. a change to the design of the goal", "C. the first use of lights for matches", "D. the introduction of goalkeepers", "E. the first international match", "F. two changes to the rules of the game", "G. the introduction of a fee for spectators", "H. an agreement on the length of a game"]),
                  correctAnswer: "B",
                },
                {
                  questionNum: 18, type: "MCQ",
                  prompt: "Events in the history of football: Which event took place in 1877?",
                  options: JSON.stringify(["A. the introduction of pay for the players", "B. a change to the design of the goal", "C. the first use of lights for matches", "D. the introduction of goalkeepers", "E. the first international match", "F. two changes to the rules of the game", "G. the introduction of a fee for spectators", "H. an agreement on the length of a game"]),
                  correctAnswer: "H",
                },
                {
                  questionNum: 19, type: "MCQ",
                  prompt: "Events in the history of football: Which event took place in 1878?",
                  options: JSON.stringify(["A. the introduction of pay for the players", "B. a change to the design of the goal", "C. the first use of lights for matches", "D. the introduction of goalkeepers", "E. the first international match", "F. two changes to the rules of the game", "G. the introduction of a fee for spectators", "H. an agreement on the length of a game"]),
                  correctAnswer: "C",
                },
                {
                  questionNum: 20, type: "MCQ",
                  prompt: "Events in the history of football: Which event took place in 1880?",
                  options: JSON.stringify(["A. the introduction of pay for the players", "B. a change to the design of the goal", "C. the first use of lights for matches", "D. the introduction of goalkeepers", "E. the first international match", "F. two changes to the rules of the game", "G. the introduction of a fee for spectators", "H. an agreement on the length of a game"]),
                  correctAnswer: "G",
                },
              ],
            },
          },
          {
            sectionNum: 3,
            title: "Part 3 — Students Discuss Handwriting Research",
            questions: {
              create: [
                {
                  questionNum: 21, type: "MCQ",
                  prompt: "Which TWO benefits for children of learning to write did both students find surprising? (Answer 1 of 2)",
                  options: JSON.stringify(["A. improved fine motor skills", "B. improved memory", "C. improved concentration", "D. improved imagination", "E. improved spatial awareness"]),
                  correctAnswer: "C",
                },
                {
                  questionNum: 22, type: "MCQ",
                  prompt: "Which TWO benefits for children of learning to write did both students find surprising? (Answer 2 of 2)",
                  options: JSON.stringify(["A. improved fine motor skills", "B. improved memory", "C. improved concentration", "D. improved imagination", "E. improved spatial awareness"]),
                  correctAnswer: "E",
                },
                {
                  questionNum: 23, type: "MCQ",
                  prompt: "For children with dyspraxia, which TWO problems with handwriting do the students think are easiest to correct? (Answer 1 of 2)",
                  options: JSON.stringify(["A. not spacing letters correctly", "B. not writing in a straight line", "C. applying too much pressure when writing", "D. confusing letter shapes", "E. writing very slowly"]),
                  correctAnswer: "A",
                },
                {
                  questionNum: 24, type: "MCQ",
                  prompt: "For children with dyspraxia, which TWO problems with handwriting do the students think are easiest to correct? (Answer 2 of 2)",
                  options: JSON.stringify(["A. not spacing letters correctly", "B. not writing in a straight line", "C. applying too much pressure when writing", "D. confusing letter shapes", "E. writing very slowly"]),
                  correctAnswer: "C",
                },
                {
                  questionNum: 25, type: "MCQ",
                  prompt: "What does the woman say about using laptops to teach writing to children with dyslexia?",
                  options: JSON.stringify(["A. Children often lack motivation to learn that way", "B. Children become fluent relatively quickly", "C. Children react more positively if they make a mistake"]),
                  correctAnswer: "C",
                },
                {
                  questionNum: 26, type: "MCQ",
                  prompt: "When discussing whether to teach cursive or print writing, the woman thinks that",
                  options: JSON.stringify(["A. cursive writing disadvantages a certain group of children", "B. print writing is associated with lower academic performance", "C. most teachers in the UK prefer a traditional approach to handwriting"]),
                  correctAnswer: "A",
                },
                {
                  questionNum: 27, type: "MCQ",
                  prompt: "According to the students, what impact does poor handwriting have on exam performance?",
                  options: JSON.stringify(["A. There is evidence to suggest grades are affected by poor handwriting", "B. Neat handwriting is less important now than it used to be", "C. Candidates write more slowly and produce shorter answers"]),
                  correctAnswer: "A",
                },
                {
                  questionNum: 28, type: "MCQ",
                  prompt: "What prediction does the man make about the future of handwriting?",
                  options: JSON.stringify(["A. Touch typing will be taught before writing by hand", "B. Children will continue to learn to write by hand", "C. People will dislike handwriting on digital devices"]),
                  correctAnswer: "B",
                },
                {
                  questionNum: 29, type: "MCQ",
                  prompt: "The woman is concerned that relying on digital devices has made it difficult for her to",
                  options: JSON.stringify(["A. take detailed notes", "B. spell and punctuate", "C. read old documents"]),
                  correctAnswer: "B",
                },
                {
                  questionNum: 30, type: "MCQ",
                  prompt: "How do the students feel about their own handwriting?",
                  options: JSON.stringify(["A. concerned they are unable to write quickly", "B. embarrassed by comments made about it", "C. regretful that they have lost the habit"]),
                  correctAnswer: "C",
                },
              ],
            },
          },
          {
            sectionNum: 4,
            title: "Part 4 — Research Around the Chembe Bird Sanctuary",
            description: "Complete the notes below. Write ONE WORD ONLY for each answer.",
            questions: {
              create: [
                { questionNum: 31, type: "FILL_BLANK", prompt: "Birds of prey destroy ___ and other rodents.", correctAnswer: "rats" },
                { questionNum: 32, type: "FILL_BLANK", prompt: "They help prevent farmers from being bitten by ___.", correctAnswer: "snakes" },
                { questionNum: 33, type: "FILL_BLANK", prompt: "They support the economy by encouraging ___ in the area.", correctAnswer: "tourism" },
                { questionNum: 34, type: "FILL_BLANK", prompt: "Birds may be accidentally killed by ___ when hunting or sleeping.", correctAnswer: "traffic" },
                { questionNum: 35, type: "FILL_BLANK", prompt: "Risk of electrocution from power lines, especially during times of high ___.", correctAnswer: "rain" },
                { questionNum: 36, type: "FILL_BLANK", prompt: "Local farmers may illegally shoot or ___ them.", correctAnswer: "poison" },
                { questionNum: 37, type: "FILL_BLANK", prompt: "Protecting chickens: providing a ___ (expensive).", correctAnswer: "building" },
                { questionNum: 38, type: "FILL_BLANK", prompt: "Frightening birds of prey by keeping a ___.", correctAnswer: "dog" },
                { questionNum: 39, type: "FILL_BLANK", prompt: "Making a ___ (e.g., with metal objects).", correctAnswer: "noise" },
                { questionNum: 40, type: "FILL_BLANK", prompt: "A ___ of methods is usually most effective.", correctAnswer: "combination" },
              ],
            },
          },
        ],
      },
    },
  });

  console.log("✓ Created: " + title);
  console.log("\nNEXT STEP: Add real audio URL via admin panel.");
}

main().catch(console.error).finally(() => db.$disconnect());
