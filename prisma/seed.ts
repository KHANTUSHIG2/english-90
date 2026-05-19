import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL ?? "file:./dev.db",
});

async function main() {
  console.log("Seeding database...");

  // Admin user
  const adminPass = await bcrypt.hash("admin1234", 12);
  await db.user.upsert({
    where: { email: "admin@ielts.prep" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@ielts.prep",
      password: adminPass,
      role: "ADMIN",
      targetBand: 9,
    },
  });

  // Student user
  const studentPass = await bcrypt.hash("student1234", 12);
  await db.user.upsert({
    where: { email: "student@ielts.prep" },
    update: {},
    create: {
      name: "Jane Smith",
      email: "student@ielts.prep",
      password: studentPass,
      role: "STUDENT",
      targetBand: 7.5,
    },
  });

  // ─── Listening Test ──────────────────────────────────────────────────────────
  const listeningTest = await db.listeningTest.upsert({
    where: { id: "sample-listening-1" },
    update: {},
    create: {
      id: "sample-listening-1",
      title: "Cambridge IELTS Practice Test 1",
      description: "A full IELTS Listening practice test covering everyday and academic topics.",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      difficulty: "MEDIUM",
      isPublished: true,
      sections: {
        create: [
          {
            sectionNum: 1,
            title: "A conversation about booking a holiday",
            questions: {
              create: [
                { questionNum: 1, type: "FILL_BLANK", prompt: "The woman wants to book a trip to ___.", correctAnswer: "Paris", explanation: "The woman clearly states she wants to visit Paris." },
                { questionNum: 2, type: "FILL_BLANK", prompt: "The tour departs on ___ (day of week).", correctAnswer: "Thursday", explanation: "The agent confirms Thursday departure." },
                { questionNum: 3, type: "FILL_BLANK", prompt: "The hotel name is the ___ Grand.", correctAnswer: "Royal", explanation: "Royal Grand is mentioned as the accommodation." },
                { questionNum: 4, type: "MCQ", prompt: "What type of room does the woman want?", options: JSON.stringify(["Single room", "Double room", "Twin room", "Suite"]), correctAnswer: "Twin room", explanation: "She requests a twin room for herself and her sister." },
                { questionNum: 5, type: "FILL_BLANK", prompt: "The total cost is £___.", correctAnswer: "899", explanation: "The agent quotes £899 for the package." },
              ],
            },
          },
          {
            sectionNum: 2,
            title: "A talk about local community facilities",
            questions: {
              create: [
                { questionNum: 6, type: "FILL_BLANK", prompt: "The new library opens at ___ AM on weekdays.", correctAnswer: "9", explanation: "The speaker states 9 AM opening time." },
                { questionNum: 7, type: "MCQ", prompt: "Which facility is FREE for residents?", options: JSON.stringify(["Swimming pool", "Tennis courts", "Gym", "Cinema"]), correctAnswer: "Swimming pool", explanation: "The swimming pool is free for local residents." },
                { questionNum: 8, type: "FILL_BLANK", prompt: "The community centre has ___ car parking spaces.", correctAnswer: "120", explanation: "120 spaces are available for visitors." },
                { questionNum: 9, type: "FILL_BLANK", prompt: "The contact number for bookings is ___.", correctAnswer: "01452 337890", explanation: "This number is given for reservations." },
                { questionNum: 10, type: "MCQ", prompt: "When does the new sports hall open?", options: JSON.stringify(["Next month", "In 3 months", "Next year", "Already open"]), correctAnswer: "Next month", explanation: "The sports hall is confirmed to open next month." },
              ],
            },
          },
          {
            sectionNum: 3,
            title: "A discussion between two students about a research project",
            questions: {
              create: [
                { questionNum: 11, type: "FILL_BLANK", prompt: "The students are studying ___ (subject).", correctAnswer: "Environmental Science", explanation: "Mentioned at the start of the discussion." },
                { questionNum: 12, type: "MCQ", prompt: "What is the main focus of their project?", options: JSON.stringify(["Climate change", "Plastic pollution", "Deforestation", "Water scarcity"]), correctAnswer: "Plastic pollution", explanation: "Plastic pollution is their agreed topic." },
                { questionNum: 13, type: "FILL_BLANK", prompt: "The deadline for the report is ___ (month).", correctAnswer: "March", explanation: "March deadline is confirmed by the tutor." },
                { questionNum: 14, type: "FILL_BLANK", prompt: "They plan to interview ___ companies.", correctAnswer: "three", explanation: "Three companies are named in the discussion." },
                { questionNum: 15, type: "MCQ", prompt: "Who will write the introduction?", options: JSON.stringify(["Tom", "Sarah", "Both together", "Neither — the tutor"]), correctAnswer: "Sarah", explanation: "Sarah volunteers to write the introduction." },
              ],
            },
          },
          {
            sectionNum: 4,
            title: "A lecture on the history of urban planning",
            questions: {
              create: [
                { questionNum: 16, type: "FILL_BLANK", prompt: "The first planned city in history is believed to be ___.", correctAnswer: "Mohenjo-daro", explanation: "Mohenjo-daro is cited as an early planned city." },
                { questionNum: 17, type: "FILL_BLANK", prompt: "Baron Haussmann redesigned ___ (city) in the 19th century.", correctAnswer: "Paris", explanation: "Paris was redesigned under Haussmann." },
                { questionNum: 18, type: "MCQ", prompt: "What was the primary goal of the Garden City movement?", options: JSON.stringify(["Industrial efficiency", "Combining town and country", "Reducing immigration", "Building taller structures"]), correctAnswer: "Combining town and country", explanation: "Ebenezer Howard aimed to combine town and country benefits." },
                { questionNum: 19, type: "FILL_BLANK", prompt: "The lecture mentions ___ as a modern sustainable city example.", correctAnswer: "Curitiba", explanation: "Curitiba in Brazil is praised as a model." },
                { questionNum: 20, type: "MCQ", prompt: "What does the lecturer say about smart cities?", options: JSON.stringify(["They are too expensive", "They reduce inequality automatically", "They use data to improve services", "They replace human planning"]), correctAnswer: "They use data to improve services", explanation: "Smart cities leverage data to enhance city services." },
              ],
            },
          },
        ],
      },
    },
  });

  // ─── Reading Test ────────────────────────────────────────────────────────────
  await db.readingTest.upsert({
    where: { id: "sample-reading-1" },
    update: {},
    create: {
      id: "sample-reading-1",
      title: "Academic Reading Practice Test 1",
      description: "Three academic passages on science, history, and society.",
      testType: "ACADEMIC",
      difficulty: "MEDIUM",
      isPublished: true,
      passages: {
        create: [
          {
            passageNum: 1,
            title: "The Cognitive Benefits of Bilingualism",
            content: `For many years, researchers debated whether speaking more than one language was an advantage or a disadvantage for children's cognitive development. Early studies in the mid-twentieth century suggested that bilingual children performed less well on verbal IQ tests than their monolingual counterparts. However, these findings were largely the result of methodological flaws, including the testing of children in their weaker language.

More recent research has overturned this view. A landmark study by Ellen Bialystok and colleagues demonstrated that bilingual adults outperformed monolinguals on tasks requiring the ability to ignore misleading information. The researchers attributed this advantage to the fact that bilinguals constantly manage two language systems, suppressing one while using the other. This ongoing mental exercise, they argued, strengthens the executive control system — the set of cognitive processes responsible for attention, planning, and task-switching.

Perhaps the most striking claim to emerge from this line of research is that lifelong bilingualism may delay the onset of dementia by approximately four to five years. This finding, based on a study of over 200 patients, attracted considerable media attention and some scepticism. Critics pointed out that the bilingual participants in the study were also immigrants, which meant they may have had other lifestyle differences that could account for the delay.

Despite these controversies, the weight of evidence suggests that managing two languages does confer measurable cognitive benefits. However, researchers are careful to note that the advantages are modest and do not transform bilinguals into intellectual supermen. Rather, the daily juggling of two languages appears to provide a form of mental workout that maintains cognitive flexibility into old age.`,
            questions: {
              create: [
                { questionNum: 1, type: "TRUE_FALSE_NG", prompt: "Early studies found that bilingual children performed worse than monolinguals on verbal IQ tests.", correctAnswer: "TRUE", explanation: "The passage states early studies showed this result." },
                { questionNum: 2, type: "TRUE_FALSE_NG", prompt: "Bialystok's study showed that bilinguals were better at ignoring irrelevant information.", correctAnswer: "TRUE", explanation: "Explicitly stated in the second paragraph." },
                { questionNum: 3, type: "TRUE_FALSE_NG", prompt: "All researchers agree that bilingualism delays dementia by exactly five years.", correctAnswer: "FALSE", explanation: "The delay was described as 'approximately four to five years' and faced scepticism." },
                { questionNum: 4, type: "FILL_BLANK", prompt: "The set of cognitive processes responsible for attention and planning is called the ___ control system.", correctAnswer: "executive", explanation: "The passage uses this exact term." },
                { questionNum: 5, type: "MCQ", prompt: "What criticism was made of the dementia delay study?", options: JSON.stringify(["Sample size too small", "Participants were immigrants with other lifestyle differences", "The study was not peer-reviewed", "Only children were tested"]), correctAnswer: "Participants were immigrants with other lifestyle differences", explanation: "This specific criticism is mentioned in the text." },
              ],
            },
          },
          {
            passageNum: 2,
            title: "The Rise and Fall of the Hanseatic League",
            content: `The Hanseatic League was a commercial confederation of merchant guilds and market towns that dominated trade in northern Europe from the thirteenth to the seventeenth century. At its height, the League encompassed over 200 cities stretching from London and Bruges in the west to Riga and Tallinn in the east. Its influence transformed the economic and political landscape of the Baltic and North Sea regions.

The origins of the League lay in the need for mutual protection. Individual merchants travelling the dangerous trade routes of medieval Europe were vulnerable to pirates, bandits, and the arbitrary taxation of local lords. By banding together, they could negotiate collective trade privileges, share the cost of maintaining trading posts (known as kontors), and present a unified political front to the rulers of the cities where they traded.

The League's most important kontors were located in London, Bruges, Bergen, and Novgorod. These establishments were effectively self-governing enclaves within foreign cities, enjoying special legal immunities and tax exemptions that native merchants could not access. The merchants who staffed them lived according to their own rules and maintained their own warehouses, courts, and even churches.

At its peak in the fourteenth and fifteenth centuries, the League wielded sufficient economic power to wage war against the kings of Denmark and emerge victorious. The Peace of Stralsund, signed in 1370, gave the League unprecedented control over Scandinavian trade and demonstrated that a commercial organization could defeat a sovereign state.

However, the League's dominance was not to last. The rise of nation-states in the sixteenth century brought with it more powerful central governments that were unwilling to tolerate the autonomous privileges of the Hanseatic traders. The discovery of new sea routes to Asia and the Americas shifted the centre of global trade away from the Baltic. By the early seventeenth century, the League had lost its commercial supremacy and effectively ceased to function.`,
            questions: {
              create: [
                { questionNum: 6, type: "FILL_BLANK", prompt: "Hanseatic trading posts in foreign cities were known as ___.", correctAnswer: "kontors", explanation: "The passage defines kontors as trading posts." },
                { questionNum: 7, type: "MCQ", prompt: "What was a key benefit that Hanseatic merchants received in foreign cities?", options: JSON.stringify(["Free housing", "Tax exemptions", "Military protection", "Priority shipping"]), correctAnswer: "Tax exemptions", explanation: "The passage mentions tax exemptions explicitly." },
                { questionNum: 8, type: "TRUE_FALSE_NG", prompt: "The Peace of Stralsund was signed in 1380.", correctAnswer: "FALSE", explanation: "The passage states it was signed in 1370." },
                { questionNum: 9, type: "TRUE_FALSE_NG", prompt: "The decline of the League was partly caused by new trade routes being discovered.", correctAnswer: "TRUE", explanation: "New routes to Asia and the Americas are cited as a cause of decline." },
                { questionNum: 10, type: "MCQ", prompt: "Which of the following was NOT listed as a Hanseatic kontor?", options: JSON.stringify(["London", "Bruges", "Copenhagen", "Bergen"]), correctAnswer: "Copenhagen", explanation: "Copenhagen is not mentioned; London, Bruges, Bergen, and Novgorod are." },
              ],
            },
          },
          {
            passageNum: 3,
            title: "Rewilding: Restoring Ecosystems Through Predator Reintroduction",
            content: `Rewilding is a progressive approach to conservation that aims to restore ecosystems to a self-sustaining state by reintroducing apex predators and allowing natural processes to regulate the landscape. Unlike traditional conservation, which often involves intensive management of individual species, rewilding takes a hands-off approach, trusting that the reintroduction of keystone species will trigger cascading ecological changes.

The most celebrated example is the reintroduction of grey wolves to Yellowstone National Park in 1995. Prior to their reintroduction, the park's elk population had grown unchecked, overgrazing riverbanks and preventing the regrowth of trees and shrubs. When wolves returned, they did not merely reduce elk numbers through predation. They also changed elk behaviour — the herds began avoiding open valleys and riverbanks where they were most vulnerable. This behavioural shift allowed vegetation to recover along rivers, which in turn stabilised stream banks, improved water quality, and created habitat for beavers, songbirds, and fish. Scientists coined the term "trophic cascade" to describe this chain of ecological changes triggered by the wolves' return.

Not everyone welcomes rewilding, however. Farmers and ranchers near rewilded areas often report livestock losses to predators, and their concerns are not easily dismissed. In Yellowstone, the wolf population has killed thousands of cattle and sheep over the decades since reintroduction, costing ranchers significant sums even after compensation payments. Critics also question whether results from Yellowstone — a vast, relatively wild area — can be replicated in the densely populated landscapes of western Europe, where rewilding advocates are pushing for the return of wolves, lynx, and bears.

Proponents argue that the economic benefits of rewilding, including tourism revenue and ecosystem services such as flood control and carbon sequestration, outweigh the costs. A study in Scotland estimated that rewilded landscapes generate significantly more revenue per hectare than sheep farming. Whether these calculations will persuade farmers and policymakers remains to be seen, but rewilding has undeniably shifted the debate about how humanity should coexist with the natural world.`,
            questions: {
              create: [
                { questionNum: 11, type: "FILL_BLANK", prompt: "Scientists use the term '___ cascade' to describe the chain of changes triggered by wolves.", correctAnswer: "trophic", explanation: "Defined in the second paragraph." },
                { questionNum: 12, type: "TRUE_FALSE_NG", prompt: "Wolves were reintroduced to Yellowstone in 1985.", correctAnswer: "FALSE", explanation: "The passage states 1995, not 1985." },
                { questionNum: 13, type: "TRUE_FALSE_NG", prompt: "The return of wolves changed both the numbers and the behaviour of elk.", correctAnswer: "TRUE", explanation: "Both effects are described in the passage." },
                { questionNum: 14, type: "MCQ", prompt: "What is one reason critics are sceptical about rewilding in Europe?", options: JSON.stringify(["Wolves are extinct in Europe", "Europe is too densely populated", "Rewilding is too expensive", "Governments do not support it"]), correctAnswer: "Europe is too densely populated", explanation: "Densely populated landscapes are cited as a challenge." },
                { questionNum: 15, type: "FILL_BLANK", prompt: "A Scottish study found that rewilded land generates more revenue than ___ farming.", correctAnswer: "sheep", explanation: "Sheep farming is the comparison used in the study." },
              ],
            },
          },
        ],
      },
    },
  });

  // ─── Writing Topics ──────────────────────────────────────────────────────────
  const writingTopics = [
    // Task 1 Academic
    {
      id: "wt-1",
      taskType: "TASK1_ACADEMIC",
      category: "Environment",
      title: "Bar chart showing energy consumption by source",
      prompt: "The bar chart below shows the percentage of energy produced from different sources in a country between 1990 and 2020.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.",
      sampleAnswer: `The bar chart illustrates the proportion of energy generated from five different sources — coal, oil, natural gas, nuclear power, and renewables — in a given country over a 30-year period from 1990 to 2020.

Overall, it is clear that coal and oil dominated energy production throughout the period, though both sources declined significantly by 2020. Conversely, renewable energy showed the most dramatic growth over the same timeframe.

In 1990, coal accounted for approximately 45% of total energy production, making it the dominant source. Oil contributed around 30%, while natural gas, nuclear, and renewables each provided less than 10%. By 2010, coal had fallen to around 35%, while renewables had risen to nearly 15%.

By 2020, the shift was even more pronounced. Coal's share had dropped to approximately 25%, and oil had fallen to around 20%. Natural gas remained relatively stable at roughly 18%. Most strikingly, renewables had surged to account for around 25% of total production, matching coal for the first time. Nuclear power remained the smallest contributor at approximately 12% throughout the entire period.

In conclusion, the most notable trend is the dramatic rise of renewable energy and the corresponding decline in fossil fuels, suggesting a significant shift in the country's energy policy over the 30-year period.`,
      difficulty: "MEDIUM",
    },
    {
      id: "wt-2",
      taskType: "TASK1_ACADEMIC",
      category: "Society",
      title: "Line graph — internet usage by age group",
      prompt: "The line graph below shows internet usage rates among different age groups in a European country from 2000 to 2020.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.",
      sampleAnswer: `The line graph shows the percentage of people in three age groups — 16–35, 36–55, and 56 and over — who used the internet regularly in a European country across a 20-year period.

Overall, internet usage increased across all age groups, with the youngest cohort consistently recording the highest rates. The most significant growth was observed among the oldest group.

In 2000, internet usage among 16–35 year-olds stood at approximately 60%, compared to roughly 30% for the 36–55 group and a mere 5% for those aged 56 and over. By 2010, the youngest group had reached nearly 90%, the middle group had risen to around 65%, and the oldest group had grown to approximately 25%.

By 2020, the 16–35 group had achieved near-universal usage at around 97%. The 36–55 cohort had closed the gap considerably, reaching approximately 88%. The most dramatic proportional increase was seen in the 56+ group, which climbed to around 65% — a thirteen-fold increase from its 2000 baseline.

In summary, while younger generations dominated internet uptake throughout the period, the older age group experienced the most rapid relative growth, illustrating the broadening reach of digital technology across all demographics.`,
      difficulty: "MEDIUM",
    },
    {
      id: "wt-3",
      taskType: "TASK1_ACADEMIC",
      category: "Economy",
      title: "Pie charts — household expenditure comparison",
      prompt: "The two pie charts below compare household expenditure in two countries — Country A and Country B — in 2022.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.",
      sampleAnswer: `The two pie charts compare the proportion of household spending across five categories — housing, food, transport, healthcare, and entertainment — in Country A and Country B in 2022.

Overall, housing was the largest expenditure in both countries, though Country A's residents spent considerably more of their income on food, while Country B's population allocated a greater proportion to healthcare.

In Country A, housing accounted for the largest share at 35%, followed by food at 28%. Transport represented 15% of spending, with healthcare and entertainment accounting for 12% and 10% respectively.

Country B showed a different pattern. While housing also dominated at 32%, healthcare was notably higher at 22%, compared to just 12% in Country A. Food spending was significantly lower in Country B at 18%. Transport and entertainment were broadly similar across both countries, at 16% and 12% respectively.

The most striking difference between the two countries lies in the food and healthcare categories. Country A's households spent ten percentage points more on food, while Country B's residents allocated ten percentage points more to healthcare. This likely reflects differences in the cost of living, healthcare systems, and dietary habits between the two nations.`,
      difficulty: "EASY",
    },
    {
      id: "wt-4",
      taskType: "TASK1_GENERAL",
      category: "Society",
      title: "Letter — complaint to a landlord about repairs",
      prompt: "You are renting a flat and there are several problems that need to be fixed. Write a letter to your landlord. In your letter:\n• describe the problems\n• explain how the problems are affecting you\n• say what action you want the landlord to take",
      sampleAnswer: `Dear Mr Harrison,

I am writing to bring to your attention several maintenance issues in the flat at 14 Maple Street that require urgent attention. Despite having mentioned some of these problems verbally when we last spoke two months ago, they have unfortunately remained unresolved.

Firstly, the boiler has not been functioning properly since October. It takes over an hour to produce hot water, which makes showering in the morning extremely difficult. Secondly, there is a persistent leak from the kitchen tap that has caused water damage to the cabinet below. I am also concerned about the safety implications if the leak worsens. Finally, several of the floorboards in the bedroom have become loose and creak loudly, disturbing my sleep at night.

These problems are significantly affecting my quality of life. The lack of reliable hot water has been particularly disruptive, especially during the recent cold weather, and I believe it may also be causing my utility bills to rise.

I would be grateful if you could arrange for a qualified plumber to inspect the boiler and kitchen tap, and for a carpenter to repair the floorboards. I would appreciate it if these repairs could be carried out within the next ten days.

I look forward to hearing from you and to reaching a satisfactory resolution to these matters.

Yours sincerely,
Alex Johnson`,
      difficulty: "EASY",
    },
    {
      id: "wt-5",
      taskType: "TASK1_GENERAL",
      category: "Technology",
      title: "Letter — applying for a job at a technology company",
      prompt: "You have seen a job advertisement for a position at a technology company. Write a letter applying for the job. In your letter:\n• explain why you are interested in the job\n• describe your relevant experience and skills\n• say when you are available for an interview",
      sampleAnswer: `Dear Hiring Manager,

I am writing to apply for the position of Software Developer advertised on your company's website last week. Having followed InnovateTech's impressive growth over the past two years, I am excited by the opportunity to contribute to your dynamic team.

I hold a degree in Computer Science from the University of Manchester and have three years of professional experience as a backend developer at DataSolutions Ltd. In this role, I specialised in building scalable APIs using Python and Node.js, and collaborated closely with cross-functional teams to deliver projects on time. I am also proficient in cloud platforms, particularly AWS, and have experience with agile methodologies.

What particularly attracts me to this position is your company's commitment to developing AI-driven solutions for healthcare. My final-year dissertation focused on machine learning applications in diagnostic imaging, and I am eager to apply this interest in a professional context. I believe my technical background, combined with my passion for using technology to solve real-world problems, makes me a strong fit for your team.

I am available for an interview at any time during the next three weeks and can provide references from my current employer upon request. I have attached my CV for your consideration.

Thank you for taking the time to read my application. I look forward to the opportunity to discuss how I can contribute to InnovateTech's continued success.

Yours faithfully,
Sarah Patel`,
      difficulty: "MEDIUM",
    },
    // Task 2 Essays
    {
      id: "wt-6",
      taskType: "TASK2",
      category: "Education",
      title: "Should university education be free for all students?",
      prompt: `In some countries, university education is provided free of charge to all students. Other countries require students to pay for their own tuition.\n\nDiscuss both views and give your own opinion.`,
      sampleAnswer: `The question of whether university education should be funded by the state or by individuals is one of the most contentious issues in educational policy today. While there are compelling arguments on both sides, I believe that a model combining government support with modest student contributions represents the most equitable solution.

Advocates of free university education argue that charging tuition fees creates significant financial barriers that disproportionately affect students from lower-income backgrounds. When the prospect of substantial debt deters talented young people from pursuing higher education, society loses out on their potential contributions as doctors, researchers, and innovators. Countries such as Germany and Norway have demonstrated that free university systems can coexist with high-quality education and strong economies.

On the other hand, those who favour a tuition fee model contend that higher education is primarily a private benefit — graduates typically earn substantially more than non-graduates over a lifetime. From this perspective, it is arguably unfair to require taxpayers who did not attend university to subsidise those who did. Furthermore, the significant cost of higher education means that government funding alone may be insufficient to maintain world-class institutions without compromising quality.

In my view, the most balanced approach is a hybrid model in which tuition fees are calibrated according to graduates' future earnings, as practised in the United Kingdom. Under such a system, students pay nothing upfront, and loan repayments are linked to income, ensuring that graduates in lower-paid occupations are not burdened by unmanageable debt. Students from the most disadvantaged backgrounds could receive full bursaries.

In conclusion, while the ideal of free education for all is admirable, the financial realities of higher education mean that some form of cost-sharing is necessary. A well-designed income-contingent repayment system can achieve both equity and sustainability.`,
      difficulty: "MEDIUM",
    },
    {
      id: "wt-7",
      taskType: "TASK2",
      category: "Environment",
      title: "Individual actions vs government policy on climate change",
      prompt: `Some people believe that individual actions, such as reducing personal carbon footprints and recycling, are the most effective way to tackle climate change. Others argue that only large-scale government policies can make a meaningful difference.\n\nDiscuss both views and give your own opinion.`,
      sampleAnswer: `Climate change represents arguably the most urgent challenge of the twenty-first century, and the debate over whether individuals or governments should take the lead in addressing it reflects fundamental disagreements about responsibility and effectiveness. While individual action is valuable, I am convinced that systemic government intervention is essential to achieving the scale of change required.

Those who champion individual responsibility argue that collective personal choices can drive significant change. When millions of people reduce their meat consumption, switch to electric vehicles, or install solar panels, the cumulative effect on carbon emissions can be substantial. Individual action also creates demand signals that encourage businesses to develop greener products and services. Moreover, changing personal behaviour can shift social norms, making sustainable living increasingly mainstream.

However, relying primarily on individuals to address climate change has serious limitations. Firstly, it places an unequal burden on ordinary citizens while allowing the largest corporate emitters to continue operating without constraint. Secondly, many green choices — such as purchasing electric vehicles or installing home insulation — remain prohibitively expensive for most people. Only government policies such as carbon taxes, emissions trading schemes, and mandatory fuel efficiency standards can create the systemic incentives needed to decarbonise entire economies.

In my view, individual action and government policy are complementary rather than competing approaches, but the evidence strongly suggests that top-down regulation is the more powerful lever. The energy transition required to limit warming to 1.5°C demands coordinated international agreements, massive public investment in renewable infrastructure, and strict regulations on industry — outcomes that individual consumers cannot achieve on their own.

In conclusion, while individual actions contribute meaningfully to the fight against climate change, decisive and ambitious government policy is indispensable for achieving the transformational change that the crisis demands.`,
      difficulty: "HARD",
    },
    {
      id: "wt-8",
      taskType: "TASK2",
      category: "Technology",
      title: "The impact of social media on society — more positive or negative?",
      prompt: `Social media has had a profound impact on society. Some people believe the impact has been largely positive, while others argue it has caused more harm than good.\n\nTo what extent do you agree or disagree?`,
      sampleAnswer: `Social media has become an almost inescapable feature of modern life, profoundly reshaping how people communicate, access information, and participate in civic life. While it offers undeniable benefits, I believe that the harms — particularly to mental health and democratic discourse — currently outweigh the advantages.

Proponents of social media argue that it has democratised communication, giving ordinary individuals a platform to share their views and organise collectively. Movements such as #MeToo and the Arab Spring demonstrated social media's capacity to amplify marginalised voices and challenge entrenched power structures. It has also enabled small businesses to reach global audiences and allowed people separated by geography to maintain meaningful relationships.

Nevertheless, the negative consequences are increasingly difficult to ignore. Extensive research links heavy social media use, particularly among adolescents, to elevated rates of anxiety, depression, and poor self-esteem. The curated perfection displayed on platforms such as Instagram creates unrealistic standards that fuel social comparison. Furthermore, the algorithms that govern these platforms are designed to maximise engagement by promoting emotionally charged and divisive content, contributing to political polarisation and the spread of misinformation.

The business model of most social media platforms — extracting attention and personal data to sell targeted advertising — is fundamentally misaligned with user wellbeing or the public good. Unlike television or print media, which are subject to strict regulations, social media companies have largely evaded meaningful oversight, allowing harmful content to proliferate unchecked.

In conclusion, while social media has brought genuine benefits in terms of connectivity and access to information, I believe that its current form does more harm than good. Robust regulation, greater algorithmic transparency, and digital literacy education are urgently needed to address its most damaging effects.`,
      difficulty: "MEDIUM",
    },
    {
      id: "wt-9",
      taskType: "TASK2",
      category: "Health",
      title: "Should governments impose taxes on unhealthy food?",
      prompt: `Some governments have introduced taxes on unhealthy food and drinks in order to reduce obesity and promote public health. Other people argue that individuals should be free to choose what they eat without government interference.\n\nDiscuss both views and give your own opinion.`,
      sampleAnswer: `The question of whether governments should levy taxes on unhealthy foods touches on fundamental tensions between individual freedom and collective wellbeing. While I respect the principle of personal choice, I believe that carefully designed taxes on harmful products represent a legitimate and effective public health measure.

Critics of food taxes argue that they represent an unacceptable intrusion into private life. Adults, they contend, have the right to make their own dietary choices without government interference. There is also concern that such taxes are inherently regressive, placing a disproportionate burden on lower-income households, which tend to spend a higher proportion of their income on food. Furthermore, sceptics question whether taxation meaningfully changes behaviour, arguing that determined consumers simply absorb the extra cost.

Proponents of food taxes, however, point to evidence from countries that have introduced them successfully. Mexico's tax on sugary drinks, introduced in 2014, led to a measurable reduction in consumption, particularly among lower-income groups who were most vulnerable to diet-related illness. The revenue generated can also be directed towards health promotion programmes, potentially offsetting the regressive impact. Obesity and diet-related diseases such as type 2 diabetes place enormous burdens on public healthcare systems, meaning that society as a whole bears the cost of individual dietary choices.

In my view, the case for targeted taxes on products with high sugar or saturated fat content is persuasive, provided the revenue is ring-fenced for health programmes and the policy is accompanied by clearer food labelling and nutritional education. Such an approach balances individual liberty with the legitimate interest governments have in promoting the health of their populations.

In conclusion, food taxes are a justifiable and evidence-based tool in the public health arsenal, though they should form part of a broader, multi-faceted strategy rather than a standalone solution.`,
      difficulty: "MEDIUM",
    },
    {
      id: "wt-10",
      taskType: "TASK2",
      category: "Society",
      title: "The advantages and disadvantages of living in a large city",
      prompt: `Many people choose to live in large cities, while others prefer smaller towns or rural areas.\n\nDiscuss the advantages and disadvantages of living in a large city and give your own opinion on whether the benefits outweigh the drawbacks.`,
      sampleAnswer: `The pull of the city has shaped human civilisation for millennia, and today, more than half of the world's population lives in urban areas. Large cities offer extraordinary opportunities, but they also impose significant costs on their residents. On balance, I believe the advantages of urban living outweigh the disadvantages for most people, though this depends heavily on individual circumstances.

The most compelling case for city living lies in the concentration of economic opportunity. Large cities are the engines of national economies, hosting the headquarters of major corporations, world-class universities, and thriving creative industries. Residents benefit from a depth and variety of employment opportunities that simply do not exist in smaller communities. Beyond work, cities offer cultural richness — theatres, museums, international cuisine, and a diversity of social interactions that can be deeply stimulating and broadening.

However, the drawbacks of urban life are equally real. Housing costs in major cities have reached crisis levels in many parts of the world, meaning that lower and middle-income residents are increasingly priced out of desirable areas. Traffic congestion, air pollution, and noise are chronic problems that damage both physical health and quality of life. Social isolation, paradoxically, is more common in dense urban environments than in close-knit small communities. The pace and competitiveness of city life also take a measurable toll on mental health.

In my opinion, cities remain the best option for young, mobile individuals seeking career advancement and cultural experience. However, for families with young children, those seeking community and green space, or people who have already established successful careers, smaller towns may offer a superior quality of life. The ideal is arguably a well-connected small city that combines urban amenities with a more human scale of living.

In conclusion, while the disadvantages of large cities — particularly cost and environmental quality — are genuine and growing, the economic and cultural advantages they offer continue to make them the destination of choice for millions worldwide.`,
      difficulty: "EASY",
    },
  ];

  for (const topic of writingTopics) {
    await db.writingTopic.upsert({
      where: { id: topic.id },
      update: {},
      create: topic as any,
    });
  }

  // ─── Vocabulary Words ────────────────────────────────────────────────────────
  const vocabWords = [
    { word: "abundant", definition: "Existing in large quantities; plentiful.", example: "The region has abundant natural resources.", category: "Environment", collocations: JSON.stringify(["abundant supply", "abundant evidence", "abundant wildlife"]) },
    { word: "advocate", definition: "To publicly support or recommend; also a person who does so.", example: "Many scientists advocate for stricter emissions regulations.", category: "Society", collocations: JSON.stringify(["advocate for", "strong advocate", "advocate change"]) },
    { word: "ambiguous", definition: "Open to more than one interpretation; unclear.", example: "The new policy is ambiguous and has caused considerable confusion.", category: "General Academic", collocations: JSON.stringify(["ambiguous result", "highly ambiguous", "deliberately ambiguous"]) },
    { word: "apparent", definition: "Seeming real or true, but not necessarily so; clearly visible.", example: "There was an apparent contradiction in the witness's testimony.", category: "General Academic", collocations: JSON.stringify(["apparent contradiction", "apparent lack of", "become apparent"]) },
    { word: "comprehensive", definition: "Complete and including everything that is relevant.", example: "The report provides a comprehensive analysis of the housing market.", category: "Education", collocations: JSON.stringify(["comprehensive review", "comprehensive plan", "comprehensive study"]) },
    { word: "controversial", definition: "Causing or likely to cause argument and disagreement.", example: "The government's decision to cut public services proved highly controversial.", category: "Society", collocations: JSON.stringify(["controversial topic", "highly controversial", "prove controversial"]) },
    { word: "crucial", definition: "Extremely important or necessary.", example: "It is crucial that students develop strong critical thinking skills.", category: "Education", collocations: JSON.stringify(["crucial role", "crucial factor", "prove crucial"]) },
    { word: "deteriorate", definition: "To become progressively worse.", example: "Air quality in the city began to deteriorate rapidly after industrialisation.", category: "Environment", collocations: JSON.stringify(["deteriorate rapidly", "begin to deteriorate", "health deteriorates"]) },
    { word: "diminish", definition: "To make or become less in amount, degree, or importance.", example: "Overuse of antibiotics may diminish their effectiveness over time.", category: "Health", collocations: JSON.stringify(["diminish significantly", "diminishing returns", "rapidly diminish"]) },
    { word: "emerge", definition: "To become visible or known; to develop gradually.", example: "New evidence has emerged suggesting a link between diet and mental health.", category: "General Academic", collocations: JSON.stringify(["emerge from", "evidence emerges", "trend emerges"]) },
    { word: "inevitable", definition: "Certain to happen and impossible to prevent.", example: "Some economists argue that automation will inevitably lead to widespread unemployment.", category: "Economy", collocations: JSON.stringify(["seem inevitable", "virtually inevitable", "inevitable consequence"]) },
    { word: "innovative", definition: "Featuring new methods, ideas, or products.", example: "The company is known for its innovative approach to renewable energy.", category: "Technology", collocations: JSON.stringify(["innovative solution", "innovative approach", "highly innovative"]) },
    { word: "substantial", definition: "Of considerable importance, size, or worth.", example: "The new tax policy will require substantial changes to how businesses operate.", category: "Economy", collocations: JSON.stringify(["substantial evidence", "substantial increase", "make substantial progress"]) },
    { word: "sustainable", definition: "Able to be maintained at a certain rate or level; not harmful to the environment.", example: "We need to find sustainable alternatives to fossil fuels.", category: "Environment", collocations: JSON.stringify(["sustainable development", "sustainable energy", "sustainable practice"]) },
    { word: "unprecedented", definition: "Never done or known before.", example: "The pandemic caused an unprecedented disruption to global supply chains.", category: "General Academic", collocations: JSON.stringify(["unprecedented levels", "truly unprecedented", "historically unprecedented"]) },
  ];

  for (const word of vocabWords) {
    const existing = await db.vocabularyWord.findFirst({ where: { word: word.word } });
    if (!existing) {
      await db.vocabularyWord.create({ data: word });
    }
  }

  // ─── Grammar Lessons ─────────────────────────────────────────────────────────
  const grammarLessons = [
    {
      title: "Conditionals in IELTS Writing",
      category: "Sentence Structure",
      order: 1,
      content: `<h3>Why Conditionals Matter</h3>
<p>Conditional sentences allow you to discuss hypothetical situations, causes and effects, and recommendations — all highly valued in IELTS Task 2 essays.</p>
<h4>First Conditional (Real / Possible)</h4>
<p><strong>Structure:</strong> If + present simple, will + infinitive</p>
<p><strong>Example:</strong> <em>If governments invest in renewable energy, they will significantly reduce carbon emissions.</em></p>
<h4>Second Conditional (Hypothetical / Unlikely)</h4>
<p><strong>Structure:</strong> If + past simple, would + infinitive</p>
<p><strong>Example:</strong> <em>If university education were free, more students from disadvantaged backgrounds would be able to pursue higher qualifications.</em></p>
<h4>Third Conditional (Impossible / Past Hypothetical)</h4>
<p><strong>Structure:</strong> If + past perfect, would have + past participle</p>
<p><strong>Example:</strong> <em>If stricter regulations had been introduced earlier, the environmental damage could have been avoided.</em></p>
<h4>IELTS Tip</h4>
<p>Using a mix of conditional types in your essay demonstrates grammatical range and earns marks under the Grammatical Range and Accuracy criterion.</p>`,
    },
    {
      title: "Passive Voice for Academic Style",
      category: "Sentence Structure",
      order: 2,
      content: `<h3>Why Use the Passive Voice?</h3>
<p>The passive voice is a hallmark of academic writing. It shifts emphasis from the subject to the action or result, making writing appear more objective and formal.</p>
<h4>Structure</h4>
<p><strong>Active:</strong> Subject + verb + object<br/><em>Researchers conducted a study on air pollution.</em></p>
<p><strong>Passive:</strong> Object + to be + past participle (+ by + agent)<br/><em>A study on air pollution was conducted (by researchers).</em></p>
<h4>When to Use It in IELTS</h4>
<ul>
<li>Task 1: <em>The data is presented in a bar chart. An increase can be observed in renewable energy.</em></li>
<li>Task 2: <em>It is widely believed that education should be funded by the government. Children are often influenced by advertising.</em></li>
</ul>
<h4>Common Passive Phrases in Academic Writing</h4>
<ul>
<li>It is argued that...</li>
<li>It has been suggested that...</li>
<li>It is widely acknowledged that...</li>
<li>It should be noted that...</li>
</ul>`,
    },
    {
      title: "Linking Words and Cohesive Devices",
      category: "Coherence & Cohesion",
      order: 3,
      content: `<h3>The Importance of Cohesion</h3>
<p>Coherence & Cohesion is worth 25% of your Writing mark. Examiners assess whether your ideas flow logically and are connected clearly.</p>
<h4>Contrast and Concession</h4>
<ul>
<li>However, / Nevertheless, / Nonetheless,</li>
<li>Although / Even though / Despite the fact that</li>
<li>On the other hand, / In contrast,</li>
<li>While / Whereas</li>
</ul>
<h4>Addition</h4>
<ul>
<li>Furthermore, / Moreover, / In addition,</li>
<li>Not only... but also</li>
<li>What is more,</li>
</ul>
<h4>Cause and Effect</h4>
<ul>
<li>Therefore, / As a result, / Consequently,</li>
<li>This leads to... / This results in...</li>
<li>Due to / Owing to / As a consequence of</li>
</ul>
<h4>Example and Illustration</h4>
<ul>
<li>For example, / For instance,</li>
<li>To illustrate, / To demonstrate,</li>
<li>such as / including</li>
</ul>
<h4>IELTS Warning</h4>
<p>Do NOT overuse linking words. Beginning every sentence with "Furthermore" or "However" will actually <em>reduce</em> your score. Use them purposefully, not mechanically.</p>`,
    },
    {
      title: "Complex Sentences and Relative Clauses",
      category: "Sentence Structure",
      order: 4,
      content: `<h3>Why Complex Sentences Score Higher</h3>
<p>Grammatical Range and Accuracy rewards the use of a variety of structures. Short, simple sentences receive lower band scores. Complex sentences demonstrate linguistic sophistication.</p>
<h4>Types of Complex Sentences</h4>
<p><strong>Relative Clauses:</strong></p>
<ul>
<li><em>Countries that invest heavily in education tend to have higher GDP per capita.</em></li>
<li><em>The policy, which was introduced in 2015, has had limited success.</em></li>
</ul>
<p><strong>Noun Clauses:</strong></p>
<ul>
<li><em>It is evident that climate change poses an existential threat.</em></li>
<li><em>What governments need to recognise is that short-term costs can yield long-term benefits.</em></li>
</ul>
<p><strong>Adverbial Clauses:</strong></p>
<ul>
<li><em>While individual actions are valuable, systemic change requires government intervention.</em></li>
<li><em>Although the policy was well-intentioned, it failed to achieve its stated objectives.</em></li>
</ul>
<h4>Practice Task</h4>
<p>Take this simple sentence and expand it using a relative clause:<br/>
<em>"Social media has changed communication."</em><br/>
Try: <em>"Social media, which has grown exponentially over the past two decades, has fundamentally transformed the way in which people communicate and access information."</em></p>`,
    },
  ];

  for (const lesson of grammarLessons) {
    const existing = await db.grammarLesson.findFirst({ where: { title: lesson.title } });
    if (!existing) {
      await db.grammarLesson.create({ data: lesson });
    }
  }

  console.log("✅ Database seeded successfully!");
  console.log("   Admin:   admin@ielts.prep   / admin1234");
  console.log("   Student: student@ielts.prep / student1234");
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect());
