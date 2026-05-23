import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();

async function main() {
  const title = "Academic Listening Practice Test 11 — Hartwell & Beyond";
  const exists = await db.listeningTest.findFirst({ where: { title } });
  if (exists) { console.log("Already exists, skipping."); return; }

  await db.listeningTest.create({
    data: {
      title,
      description: "4-part academic listening test. Part 1: phone call to tourist information. Part 2: wildlife park guide talk. Part 3: students discuss sleep research. Part 4: lecture on urban beekeeping.",
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
                { questionNum: 1,  type: "FILL_BLANK", prompt: "Accommodation: ___ Hotel on George Street", correctAnswer: "Thornton" },
                { questionNum: 2,  type: "FILL_BLANK", prompt: "Cost of family room per night: £___ (approx.)", correctAnswer: "110" },
                { questionNum: 3,  type: "FILL_BLANK", prompt: "Recommended Trips: A ___ tour of the city centre (starts in Carlton Square)", correctAnswer: "cycling" },
                { questionNum: 4,  type: "FILL_BLANK", prompt: "A trip by ___ to the old fort", correctAnswer: "ferry" },
                { questionNum: 5,  type: "FILL_BLANK", prompt: "Science Museum — best day to visit: ___", correctAnswer: "Thursday" },
                { questionNum: 6,  type: "FILL_BLANK", prompt: "See the exhibition about ___ which opens soon", correctAnswer: "oceans" },
                { questionNum: 7,  type: "FILL_BLANK", prompt: "Clacton Market — good for ___ food", correctAnswer: "organic" },
                { questionNum: 8,  type: "FILL_BLANK", prompt: "Clacton Market — need to have lunch before ___ p.m.", correctAnswer: "1" },
                { questionNum: 9,  type: "FILL_BLANK", prompt: "Theatre Tickets: save up to ___% on ticket prices at bargaintickets.com", correctAnswer: "30" },
                { questionNum: 10, type: "FILL_BLANK", prompt: "Free Activities — Blakewell Gardens: climb Telegraph Hill to see a view of the ___", correctAnswer: "harbour" },
              ],
            },
          },
          {
            sectionNum: 2,
            title: "Part 2 — Guide's talk at Mossfield Wildlife Park",
            questions: {
              create: [
                {
                  questionNum: 11, type: "MCQ",
                  prompt: "Which TWO things does the speaker say about visiting the wildlife park with young children? (Answer 1 of 2)",
                  options: JSON.stringify(["A. Children can feed some of the animals", "B. There is a face-painting activity for children today", "C. Children under five must be in pushchairs on the forest trail", "D. Children will need to bring insect repellent", "E. The park shop has a discount on children's guides today"]),
                  correctAnswer: "A",
                },
                {
                  questionNum: 12, type: "MCQ",
                  prompt: "Which TWO things does the speaker say about visiting the wildlife park with young children? (Answer 2 of 2)",
                  options: JSON.stringify(["A. Children can feed some of the animals", "B. There is a face-painting activity for children today", "C. Children under five must be in pushchairs on the forest trail", "D. Children will need to bring insect repellent", "E. The park shop has a discount on children's guides today"]),
                  correctAnswer: "E",
                },
                {
                  questionNum: 13, type: "MCQ",
                  prompt: "Which TWO attractions at the wildlife park are new this season? (Answer 1 of 2)",
                  options: JSON.stringify(["A. the nocturnal animal house", "B. the treetop walkway", "C. the bird of prey display", "D. the children's nature trail", "E. the outdoor cinema"]),
                  correctAnswer: "B",
                },
                {
                  questionNum: 14, type: "MCQ",
                  prompt: "Which TWO attractions at the wildlife park are new this season? (Answer 2 of 2)",
                  options: JSON.stringify(["A. the nocturnal animal house", "B. the treetop walkway", "C. the bird of prey display", "D. the children's nature trail", "E. the outdoor cinema"]),
                  correctAnswer: "D",
                },
                {
                  questionNum: 15, type: "MCQ",
                  prompt: "Which animal was first introduced to Mossfield Wildlife Park in 1998?",
                  options: JSON.stringify(["A. snow leopards", "B. Komodo dragons", "C. African penguins", "D. red pandas", "E. giant tortoises", "F. meerkats", "G. ring-tailed lemurs", "H. black bears"]),
                  correctAnswer: "F",
                },
                {
                  questionNum: 16, type: "MCQ",
                  prompt: "Which animal was first introduced to Mossfield Wildlife Park in 2003?",
                  options: JSON.stringify(["A. snow leopards", "B. Komodo dragons", "C. African penguins", "D. red pandas", "E. giant tortoises", "F. meerkats", "G. ring-tailed lemurs", "H. black bears"]),
                  correctAnswer: "C",
                },
                {
                  questionNum: 17, type: "MCQ",
                  prompt: "Which animal was first introduced to Mossfield Wildlife Park in 2007?",
                  options: JSON.stringify(["A. snow leopards", "B. Komodo dragons", "C. African penguins", "D. red pandas", "E. giant tortoises", "F. meerkats", "G. ring-tailed lemurs", "H. black bears"]),
                  correctAnswer: "D",
                },
                {
                  questionNum: 18, type: "MCQ",
                  prompt: "Which animal was first introduced to Mossfield Wildlife Park in 2011?",
                  options: JSON.stringify(["A. snow leopards", "B. Komodo dragons", "C. African penguins", "D. red pandas", "E. giant tortoises", "F. meerkats", "G. ring-tailed lemurs", "H. black bears"]),
                  correctAnswer: "A",
                },
                {
                  questionNum: 19, type: "MCQ",
                  prompt: "Which animal was first introduced to Mossfield Wildlife Park in 2016?",
                  options: JSON.stringify(["A. snow leopards", "B. Komodo dragons", "C. African penguins", "D. red pandas", "E. giant tortoises", "F. meerkats", "G. ring-tailed lemurs", "H. black bears"]),
                  correctAnswer: "G",
                },
                {
                  questionNum: 20, type: "MCQ",
                  prompt: "Which animal was first introduced to Mossfield Wildlife Park in 2020?",
                  options: JSON.stringify(["A. snow leopards", "B. Komodo dragons", "C. African penguins", "D. red pandas", "E. giant tortoises", "F. meerkats", "G. ring-tailed lemurs", "H. black bears"]),
                  correctAnswer: "B",
                },
              ],
            },
          },
          {
            sectionNum: 3,
            title: "Part 3 — Priya and James discuss sleep research",
            questions: {
              create: [
                {
                  questionNum: 21, type: "MCQ",
                  prompt: "Which TWO benefits of regular sleep schedules did both students find surprising? (Answer 1 of 2)",
                  options: JSON.stringify(["A. improved ability to memorise vocabulary", "B. faster recovery from illness", "C. reduced levels of anxiety before exams", "D. better performance in creative tasks", "E. improved time management skills"]),
                  correctAnswer: "C",
                },
                {
                  questionNum: 22, type: "MCQ",
                  prompt: "Which TWO benefits of regular sleep schedules did both students find surprising? (Answer 2 of 2)",
                  options: JSON.stringify(["A. improved ability to memorise vocabulary", "B. faster recovery from illness", "C. reduced levels of anxiety before exams", "D. better performance in creative tasks", "E. improved time management skills"]),
                  correctAnswer: "D",
                },
                {
                  questionNum: 23, type: "MCQ",
                  prompt: "For students with irregular sleep, which TWO study strategies do the students think are most effective? (Answer 1 of 2)",
                  options: JSON.stringify(["A. studying in short blocks with regular breaks", "B. avoiding all screens two hours before sleep", "C. reviewing notes immediately after waking", "D. using background music while studying", "E. studying at the same time every day"]),
                  correctAnswer: "A",
                },
                {
                  questionNum: 24, type: "MCQ",
                  prompt: "For students with irregular sleep, which TWO study strategies do the students think are most effective? (Answer 2 of 2)",
                  options: JSON.stringify(["A. studying in short blocks with regular breaks", "B. avoiding all screens two hours before sleep", "C. reviewing notes immediately after waking", "D. using background music while studying", "E. studying at the same time every day"]),
                  correctAnswer: "E",
                },
                {
                  questionNum: 25, type: "MCQ",
                  prompt: "What does the woman say about the data collection method used in the study?",
                  options: JSON.stringify(["A. Too few participants were involved", "B. Self-reported data may not be accurate", "C. The researchers ignored important variables"]),
                  correctAnswer: "B",
                },
                {
                  questionNum: 26, type: "MCQ",
                  prompt: "When discussing caffeine's effect on sleep, the man thinks that...",
                  options: JSON.stringify(["A. students are unaware of how much caffeine they consume", "B. the recommended daily limit is too high for most people", "C. the research findings contradict popular belief"]),
                  correctAnswer: "C",
                },
                {
                  questionNum: 27, type: "MCQ",
                  prompt: "According to the students, what effect does sleep deprivation have on exam performance?",
                  options: JSON.stringify(["A. Students tend to make more grammatical errors", "B. There is clear evidence that grades are significantly lower", "C. Students write less and fail to develop arguments fully"]),
                  correctAnswer: "B",
                },
                {
                  questionNum: 28, type: "MCQ",
                  prompt: "What recommendation does the woman make regarding napping?",
                  options: JSON.stringify(["A. Naps should replace night-time sleep when necessary", "B. Short naps of under 30 minutes can improve alertness", "C. Students should avoid napping on the day before an exam"]),
                  correctAnswer: "B",
                },
                {
                  questionNum: 29, type: "MCQ",
                  prompt: "The man is concerned that his sleep habits have affected his ability to...",
                  options: JSON.stringify(["A. complete assignments on time", "B. concentrate during seminars", "C. retain information from lectures"]),
                  correctAnswer: "C",
                },
                {
                  questionNum: 30, type: "MCQ",
                  prompt: "How do both students feel about the practical recommendations in the research paper?",
                  options: JSON.stringify(["A. impressed by how specific the advice is", "B. unsure whether the advice suits all students equally", "C. frustrated that the advice was not given earlier in their course"]),
                  correctAnswer: "B",
                },
              ],
            },
          },
          {
            sectionNum: 4,
            title: "Part 4 — Lecture on Urban Beekeeping Research",
            questions: {
              create: [
                { questionNum: 31, type: "FILL_BLANK", prompt: "Urban bees pollinate ___ and other garden plants.", correctAnswer: "vegetables" },
                { questionNum: 32, type: "FILL_BLANK", prompt: "They help local farmers by improving crop ___.", correctAnswer: "yields" },
                { questionNum: 33, type: "FILL_BLANK", prompt: "Beekeeping has become an important part of urban ___ in many cities.", correctAnswer: "culture" },
                { questionNum: 34, type: "FILL_BLANK", prompt: "Urban beekeeping contributes to the economy through the sale of local ___.", correctAnswer: "honey" },
                { questionNum: 35, type: "FILL_BLANK", prompt: "The bees may be harmed by ___ from traffic and industry.", correctAnswer: "pollution" },
                { questionNum: 36, type: "FILL_BLANK", prompt: "Loss of ___ spaces in cities reduces the availability of flowers.", correctAnswer: "green" },
                { questionNum: 37, type: "FILL_BLANK", prompt: "Local residents may unknowingly use ___ that kills bees.", correctAnswer: "pesticides" },
                { questionNum: 38, type: "FILL_BLANK", prompt: "Creation of ___ gardens on rooftops provides diverse pollen and nectar.", correctAnswer: "wildflower" },
                { questionNum: 39, type: "FILL_BLANK", prompt: "Providing artificial ___ boxes on buildings supports bee colonies.", correctAnswer: "nesting" },
                { questionNum: 40, type: "FILL_BLANK", prompt: "A ___ of methods is usually most effective.", correctAnswer: "combination" },
              ],
            },
          },
        ],
      },
    },
  });

  console.log("✓ Created: " + title);
  console.log("\nNEXT STEP: Generate audio from prisma/audio-script-test-11.txt");
  console.log("Then edit the test in admin to set the real audioUrl.");
}

main().catch(console.error).finally(() => db.$disconnect());
