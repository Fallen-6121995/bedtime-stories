const prompts = {
  panchatantra: ({ childName, ageGroup, topic, language, langCode }) => `You are a traditional Indian storyteller.

Write a **Panchatantra-style** bedtime story in "${language}" for a child named "${childName}", in the age group "${ageGroup}", about the topic: "${topic}".

📜 STORY REQUIREMENTS:
1. The story must follow the **morality, tone, and wisdom** found in Panchatantra tales — animal characters, clever plots, and a life lesson.
2. The main character and plot must be about the exact topic: "${topic}". Do NOT replace or change the subject.
3. Use simple, friendly storytelling — suitable for children in the "${ageGroup}" range.
4. End the story with a **clear, traditional-style moral**, just like in Panchatantra (e.g., "Slow and steady wins the race", "Greed leads to loss").

🛑 OUTPUT FORMAT — Return ONLY a valid JSON object. No markdown, no extra text. It must be directly parsable by \`JSON.parse()\`.

Use this structure exactly:

{
  "title": "Story title including the topic '${topic}'",
  "language": "${language}",
  "ageGroup": "${ageGroup}",
  "story_en": "Panchatantra-style story in English",
  "story_${langCode}": "Same story translated in ${language}"
}

Do NOT include any intro text,commentary, explanations, or code formatting. Only return the pure JSON object as shown.`,
  fairyTale: ({ childName, ageGroup, topic, language, langCode }) => `
You are an expert children's storyteller.

🎯 GOAL:
Write a magical and engaging story in "${language}" for a child named "${childName}", aged "${ageGroup}", about the topic "${topic}". The story should be:
- Imaginative, slightly suspenseful, and full of warmth.
- Suitable for children in the "${ageGroup}" range.
- About exactly the topic: "${topic}". Do NOT change or substitute it.

🧠 ENGAGEMENT INSTRUCTIONS:
- Begin with something surprising or mysterious.
- Include magical or clever twists.
- Use fun dialogue between characters.
- Keep curiosity high and maintain a child-friendly tone.
- End with a positive and meaningful moral.

🛑 OUTPUT FORMAT — Return ONLY a valid JSON object. No markdown, no extra text. It must be directly parsable by \`JSON.parse()\`.
Use this structure exactly:

{
  "title": "Story title that includes the topic: '${topic}'",
  "language": "${language}",
  "ageGroup": "${ageGroup}",
  "story_en": "Full story in English",
  "story_${langCode}": "Same story translated in ${language}"
}

Do NOT include any intro text,commentary, explanations, or code formatting. Only return the pure JSON object as shown.`,
  adventureFantasy: ({ childName, ageGroup, topic, language, langCode }) => `

You are a master storyteller crafting a fantasy adventure story for children aged "${ageGroup}". Your task is to write an engaging, emotionally rich, and culturally appropriate story in "${language}" about "${topic}". 

The story should feel like a timeless children's fantasy — filled with wonder, ups and downs, and a satisfying, heartwarming ending.

---

🎯 OBJECTIVES:
- Write a magical, adventurous, and emotionally gripping story for a child named "${childName}".
- The story must **focus entirely on the topic**: "${topic}". Do NOT alter or substitute it.
- Adapt the character names, cultural details, and tone to suit the **language and cultural feel of "${language}"**.
  - For English, use names familiar to English-speaking children.
  - For Hindi, use Indian kid-friendly names and relatable cultural references.

---

📚 STORY ELEMENTS TO INCLUDE:

- Begin with something **surprising, whimsical, or mysterious** to hook the child.
- Add **magical elements** like glowing rivers, talking creatures, floating kingdoms, or enchanted forests.
- Let the main character face a fun challenge or mystery they must solve using **bravery, cleverness, or kindness**.
- Include **dialogue** that brings the characters to life and feels fun and expressive for kids.
- Make the journey adventurous — with **ups and downs**, suspense, discovery, and resolution.
- Use **vivid, sensory descriptions** that awaken imagination (sights, sounds, textures, magic).
- Ensure the tone remains **wholesome, emotionally rewarding, and age-appropriate** — no violence, fear, or dark content.
- End with a **gentle moral or life lesson** (e.g., about friendship, truth, courage, or helping others).

---

🧠 UNIVERSAL STORYTELLING PRINCIPLES:

- Base the plot on **emotions and experiences kids understand**: curiosity, getting lost, feeling different, wanting to help, etc.
- Make the **main character grow** through their adventure — from uncertain to brave, selfish to kind, etc.
- Encourage imagination by adding **small mysteries, riddles, or magical rules** that the character must understand.
- Use names, foods, places, and story flavor that **match the cultural tone** of the language chosen.
- Keep the story **playful, imaginative, and soothing**, even in tense moments.

---

🛑 OUTPUT FORMAT — Return ONLY a valid JSON object (no markdown, no explanations).

Use this exact structure:

{
  "title": "Exciting, age-appropriate story title in English (must include the topic '${topic}')",
  "language": "${language}",
  "ageGroup": "${ageGroup}",
  "story_en": "Complete fantasy adventure story in English",
  "story_${langCode}": "Same story translated in ${language}"
}

Return ONLY the pure JSON string. No markdown, no commentary, no formatting — it must be cleanly parsable by JSON.parse().
`,
  mysteryExplorer: ({ childName, ageGroup, topic, language, langCode }) => `
  You are a children's mystery author crafting a **safe, exciting explorer-style mystery story** in "${language}" for a child named "${childName}", aged "${ageGroup}".

---

🧭 GOAL:
Invent a **fun and age-appropriate mystery adventure** involving a hidden clue, a magical map, or a strange event. 
Let the AI choose a suitable mystery concept and story title on its own.

---

🕵️ STORY ELEMENTS:
- Begin with a mysterious clue, map, or event that sparks curiosity.
- The main character explores to uncover the truth behind the mystery.
- Include child-friendly suspense, magical riddles, or gentle twists.
- The adventure may take place in forests, schools, caves, or secret gardens.
- Use mystery, logic, and kindness to solve the challenge — **no fear or dark danger**.
- Characters and places should feel familiar and magical.
- End with joyful discovery, surprise, and a heartwarming resolution.

---

🧒 NAMES & LOCATIONS:
- Use children-friendly names based on the language:
  - For Hindi: Arjun, Meera, Rani, Bunty
  - For English: Max, Lily, Ben, Emma
  - For other languages: Use locally appropriate names
- Set the story in magical or whimsical versions of real places: an old treehouse, forgotten temple, secret staircase, floating island, etc.

---

🛑 OUTPUT FORMAT — Return ONLY a valid JSON object. No markdown, no extra text. It must be directly parsable by \`JSON.parse()\`.

Use this structure exactly:

{
  "title": "Invented mystery adventure title in English",
  "language": "${language}",
  "ageGroup": "${ageGroup}",
  "story_en": "Full mystery story in English",
  "story_${langCode}": "Same story translated in ${language}"
}`
}



// adventureFantasy: ({ childName, ageGroup, language, langCode }) => `

// You are a master children's storyteller creating a **fantasy adventure story** in "${language}" for a child named "${childName}" aged "${ageGroup}".

// ---

// 🎯 OBJECTIVE:
// Invent a **magical, exciting story concept and title** suitable for a fantasy adventure that includes:
// - Wonder, mystery, and fantasy elements
// - Magical characters and lands
// - A quest or challenge with ups and downs
// - A gentle, meaningful ending or lesson

// ---

// 💡 STORY INSTRUCTIONS:
// - Come up with your **own original story topic** suitable for fantasy adventure and children aged "${ageGroup}"
// - Create an **engaging, age-appropriate story title** based on your invented topic
// - Use simple and vivid language for children
// - Start with something magical or mysterious to grab attention
// - Make sure the main character goes on a journey or solves a problem using **kindness, cleverness, or courage**
// - Keep the characters safe, friendly, and emotionally positive
// - Add moments of tension, fun, and resolution
// - Include magical creatures, strange lands, or enchanted items
// - End with a **moral or gentle life lesson**

// ---

// 🧒 CHARACTER NAMES:
// - Use child-appropriate names based on the language:
//   - Hindi: Indian names like Meera, Arjun, Pari, Raju
//   - English: Names like Lily, Max, Oliver, Sophie
//   - Spanish/French/etc.: Use culturally appropriate kids' names

// ---

// 🛑 OUTPUT FORMAT — Return ONLY a valid JSON object. No markdown, no extra text. It must be directly parsable by \`JSON.parse()\`.

// Use this structure exactly:

// {
//   "title": "Invented fantasy adventure story title in English",
//   "language": "${language}",
//   "ageGroup": "${ageGroup}",
//   "story_en": "Full story in English",
//   "story_${langCode}": "Same story translated in ${language}"
// }

// `

module.exports = prompts;