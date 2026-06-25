const axios = require('axios');

/**
 * AI service providing profile reviews, gap analysis, roadmaps, and chatbot replies.
 * Uses Gemini API if GEMINI_API_KEY is configured, else falls back to a high-fidelity local generator.
 */
/**
 * Helper to call Gemini API
 */
const callGemini = async (prompt) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured in environment.");
  }
  const modelName = process.env.GEMINI_MODEL || "gemini-pro";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

  const response = await axios.post(
    url,
    {
      contents: [{ parts: [{ text: prompt }] }]
    },
    {
      headers: { 'Content-Type': 'application/json' },
      timeout: 15000
    }
  );

  if (
    response.data &&
    response.data.candidates &&
    response.data.candidates[0] &&
    response.data.candidates[0].content &&
    response.data.candidates[0].content.parts &&
    response.data.candidates[0].content.parts[0]
  ) {
    const text = response.data.candidates[0].content.parts[0].text;
    if (text) return text;
  }
  throw new Error("Invalid or empty response from Gemini API");
};

/**
 * Helper to call Groq API (OpenAI-compatible)
 */
const callGroq = async (prompt) => {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("GROQ_API_KEY is not configured in environment.");
  }
  const modelName = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";
  const url = "https://api.groq.com/openai/v1/chat/completions";

  const response = await axios.post(
    url,
    {
      model: modelName,
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      stream: false
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      timeout: 15000
    }
  );

  if (
    response.data &&
    response.data.choices &&
    response.data.choices[0] &&
    response.data.choices[0].message
  ) {
    const text = response.data.choices[0].message.content;
    if (text) return text;
  }
  throw new Error("Invalid or empty response from Groq API");
};

/**
 * AI service providing profile reviews, gap analysis, roadmaps, and chatbot replies.
 * Uses configured preferred provider (Gemini or Groq), falls back dynamically if preferred fails,
 * and uses local rule-based simulation as final fallback.
 */
const generateAIContent = async (type, context) => {
  const targetRole = context.targetRole || "MERN Developer";
  
  // Build the prompt based on request type
  let prompt = "";
  if (type === 'review') {
    prompt = `Review this developer profile. Target Role: ${targetRole}. Github Score: ${context.githubScore}/100, DSA Score: ${context.dsaScore}/100, ATS Resume Score: ${context.atsScore}/100. Return JSON/Text summarizing: Strengths, Weaknesses, Interview Readiness rating out of 10, and 3 key recommendations.`;
  } else if (type === 'gap-analysis') {
    prompt = `Compare this developer's skills [${(context.skills || []).join(', ')}] with the required skills for target role: ${targetRole}. List missing skills and action steps.`;
  } else if (type === 'roadmap') {
    prompt = `Generate a 30, 60, 90-day learning roadmap to transition to target role: ${targetRole} from current skills: [${(context.skills || []).join(', ')}]. Format in markdown.`;
  } else {
    prompt = `You are a career assistant for developers. The user is a developer targeting the role of ${targetRole} with Placement readiness score: ${context.placementScore}%. Answer their query: "${context.message}". Keep it professional and helpful.`;
    
    if (context.file) {
      const { originalname, mimetype, path: filePath, size } = context.file;
      const sizeMB = (size / (1024 * 1024)).toFixed(2);
      
      // Determine if file is text-friendly and can be parsed
      const textFriendlyTypes = [
        'text/', 'application/json', 'application/javascript', 
        'application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];
      const isTextFriendly = textFriendlyTypes.some(t => mimetype.includes(t)) || 
                             ['.txt', '.csv', '.json', '.js', '.ts', '.py', '.html', '.css', '.md', '.pdf', '.docx'].some(ext => originalname.toLowerCase().endsWith(ext));
      
      if (isTextFriendly) {
        try {
          const { parseResumeFile } = require('./resumeService');
          const fileContent = await parseResumeFile(filePath);
          prompt += `\n\n[Attached Document File: ${originalname} (Size: ${sizeMB} MB)]\nHere is the content of the attached document:\n---\n${fileContent}\n---`;
        } catch (err) {
          prompt += `\n\n[Attached File: ${originalname} (${mimetype})] - Note: Failed to parse content.`;
        }
      } else {
        // Media files (image, video, audio)
        prompt += `\n\n[Attached Media/Binary File: ${originalname} (${mimetype}, Size: ${sizeMB} MB)]\nThe user has attached a media or binary file. Acknowledge this attachment in your response.`;
      }
    }
  }

  const preferred = (process.env.PREFERRED_AI_PROVIDER || 'gemini').toLowerCase().trim();
  const geminiKey = process.env.GEMINI_API_KEY;
  const groqKey = process.env.GROQ_API_KEY;

  // Build routing order
  const routingOrder = [];
  if (preferred === 'groq') {
    if (groqKey) routingOrder.push({ name: 'Groq', call: callGroq });
    if (geminiKey) routingOrder.push({ name: 'Gemini', call: callGemini });
  } else {
    if (geminiKey) routingOrder.push({ name: 'Gemini', call: callGemini });
    if (groqKey) routingOrder.push({ name: 'Groq', call: callGroq });
  }

  // Execute routing with automatic failover
  for (const provider of routingOrder) {
    try {
      console.log(`[AI SERVICE] Attempting AI generation using ${provider.name}...`);
      const result = await provider.call(prompt);
      console.log(`[AI SERVICE] Successfully generated response using ${provider.name}`);
      return result;
    } catch (e) {
      console.warn(`[AI SERVICE] ${provider.name} call failed:`, e.message);
    }
  }

  console.warn("[AI SERVICE] All configured API calls failed or no keys configured. Using local fallback engine.");

  // --- Premium Local Fallback Engine ---
  if (type === 'review') {
    return `### 📊 DevLens AI Profile Review for **${targetRole}**

#### 🌟 Key Strengths
- **Solid Core Foundation**: Your GitHub project analytics show active development in structural codebase design.
- **Problem Solving**: Your analytical metrics show steady activity on code execution challenges.
- **Structured Resume Layout**: High keyword indexing on primary technologies.

#### ⚠️ Improvement Opportunities
- **DevOps Integration**: Lack of containerization (Docker/Kubernetes) or automated CI/CD pipeline commits.
- **System Design Depth**: You need to work on scalability concepts like distributed caching, database indexing, and API gateways.
- **DSA Complexity**: Focus on advanced data structures (Trees, Graphs, Dynamic Programming) to boost interview confidence.

#### 📈 Interview Readiness
**Rating: 7.2 / 10**
- *MERN/Frontend Developer:* 8.0/10 (High framework proficiency)
- *System Design & DSA:* 6.0/10 (Requires theoretical depth)

#### 🎯 Strategic Action Items
1. Deploy your current repository projects to live hosting services (Vercel, Render, AWS) and add links to your resume.
2. Solve at least 3 Medium-level DSA challenges daily focusing on sliding window and graph traversal.
3. Integrate Docker files into your top 2 repositories to demonstrate deployment knowledge.`;
  }

  if (type === 'gap-analysis') {
    const requiredSkillsMap = {
      "MERN Developer": ["React.js", "Node.js", "Express.js", "MongoDB", "Redux Toolkit", "JWT Auth", "REST APIs", "Docker"],
      "Frontend Developer": ["React.js", "Tailwind CSS", "TypeScript", "Redux Toolkit", "Next.js", "Jest/Cypress", "Web Performance"],
      "Backend Developer": ["Node.js", "Express.js", "PostgreSQL", "MongoDB", "Redis", "Docker", "REST/GraphQL APIs", "JWT Auth", "System Design"],
      "Data Scientist": ["Python", "SQL", "Pandas", "NumPy", "Scikit-Learn", "Matplotlib/Seaborn", "Statistics", "Machine Learning"],
      "ML Engineer": ["Python", "PyTorch/TensorFlow", "Scikit-Learn", "DSA Algorithms", "Docker", "Model Deployment", "Flask/FastAPI", "Deep Learning"],
      "DevOps Engineer": ["Docker", "Kubernetes", "AWS Cloud", "CI/CD Pipelines", "Linux Bash Scripting", "Terraform", "Nginx", "Git"]
    };

    const targetSkills = requiredSkillsMap[targetRole] || requiredSkillsMap["MERN Developer"];
    const currentSkills = (context.skills || []).map(s => s.toLowerCase());
    
    const missing = targetSkills.filter(skill => {
      const lowerSkill = skill.toLowerCase();
      return !currentSkills.some(cs => cs.includes(lowerSkill) || lowerSkill.includes(cs));
    });

    return `### 🔍 Skill Gap Analysis: Current Profile vs. **${targetRole}**

| Required Skill | Status | Action Required |
| :--- | :--- | :--- |
${targetSkills.map(skill => {
  const isMissing = missing.includes(skill);
  return `| **${skill}** | ${isMissing ? '❌ Missing' : '✅ Acquired'} | ${isMissing ? `Incorporate into a new portfolio project.` : 'Showcase advanced features in GitHub repos.'}`;
}).join('\n')}

#### 💡 Recommendations for bridging the gap:
- You have **${targetSkills.length - missing.length}** out of **${targetSkills.length}** essential skill components.
- **Priority Action**: Learn **${missing.slice(0, 3).join(', ') || 'Docker/Kubernetes'}** immediately. Build a dedicated micro-project implementing these missing concepts.`;
  }

  if (type === 'roadmap') {
    return `# 🗓️ 90-Day Developer Acceleration Roadmap
Target Role: **${targetRole}**

## 🗓️ Phase 1: Days 1 - 30 (Foundation & Gap Bridging)
- **Focus**: Learn and integrate missing core tools.
- **Daily Tasks**:
  - Solve 1 Leetcode Easy problem and 1 Medium problem related to Arrays/Hashing.
  - Spend 2 hours daily reading official documentation of missing technologies.
- **Milestone**: Build a mini-app focusing purely on backend structures or advanced state-management.
- ` + '`[ ]` Check off intermediate accomplishments after building.' + `

## 🗓️ Phase 2: Days 31 - 60 (Deployment & Scalability)
- **Focus**: Database Optimization, Caching, and Containerization.
- **Daily Tasks**:
  - Implement caching (e.g., Redis) or advanced SQL indexing.
  - Containerize your project using Docker. Write a clean \`Dockerfile\` and \`docker-compose.yml\`.
- **Milestone**: Launch a multi-container application on AWS/Render.
- ` + '`[ ]` Verify container performance and endpoint latency.' + `

## 🗓️ Phase 3: Days 61 - 90 (Interview Prep & ATS Polish)
- **Focus**: System Design concepts and mock interview challenges.
- **Daily Tasks**:
  - Study system design principles (load balancers, scaling databases, message queues).
  - Update Resume ATS keywords matching **${targetRole}**.
- **Milestone**: Complete 3 mock interviews and publish 2 detailed project case studies on GitHub.
- ` + '`[ ]` Finalize portfolio submission and target job applications.' + ``;
  }

  // Fallback for career chatbot query
  const lowercaseMsg = context.message ? context.message.toLowerCase() : "";
  
  if (lowercaseMsg.includes('learn') || lowercaseMsg.includes('suggest') || lowercaseMsg.includes('study')) {
    return `Based on your chosen path of **${targetRole}**, here are the critical technologies you should prioritize learning:
1. **Advanced Framework Concepts**: Deepen your knowledge in modern lifecycle management and optimization models.
2. **Containerization & Cloud Services**: Learn Docker/Kubernetes and AWS fundamentals. Modern SaaS dashboards require clean deployment skills.
3. **Database Performance**: Look into indexing, database design, and query caching with Redis.

Would you like me to generate a structured 30-day task list for any of these areas?`;
  }
  
  if (lowercaseMsg.includes('resume') || lowercaseMsg.includes('ats') || lowercaseMsg.includes('cv')) {
    return `To optimize your resume for **${targetRole}** roles:
- Use standard section headers (Experience, Projects, Education, Skills).
- Inject target keywords (e.g. ${targetRole === 'MERN Developer' ? 'React, Node, MongoDB, Express, API integration' : 'Docker, Kubernetes, CI/CD, Terraform'}).
- Format descriptions with bullet points containing metric indicators (e.g., "reduced latency by 20%").
- Export your resume as a clean PDF containing readable text instead of flat images.`;
  }

  return `Hello! I am your DevLens AI Career Assistant. 

Based on your target path (**${targetRole}**), you currently show a placement readiness rating of **${context.placementScore || 65}%**. 

To boost your progress, you can:
- Ask me for a detailed **90-Day Learning Roadmap**.
- Type \`Analyze my profile\` to view a checklist of required vs. missing competencies.
- Upload a new resume in the **Resume section** to run keyword similarity scoring.

How can I help you accelerate your developer career today?`;
};

module.exports = { generateAIContent };
