
// controllers/aiController.js

import OpenAI from "openai";
import Resume from "../models/Resume.js";

// ❗ Remove the duplicate import of ai.js
// import ai from "../configs/ai.js";

// Initialize OpenAI client (ONLY ONCE)
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// POST: /api/ai/enhance-pro-sum
export const enhanceProfessionalSummary = async (req, res) => {
  try {
    const { userContent } = req.body;

    if (!userContent) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const response = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL,
      messages: [
        {
          role: "system",
          content:
            "You are an expert in resume writing. Enhance the professional summary into 1–2 strong ATS-friendly sentences. Only return the improved text.",
        },
        { role: "user", content: userContent },
      ],
    });

    const enhancedContent = response.choices[0].message.content;
    return res.status(200).json({ enhancedContent });

  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// POST: /api/ai/enhance-job-desc
export const enhanceJobDescription = async (req, res) => {
  try {
    const { userContent } = req.body;

    if (!userContent) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const response = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL,
      messages: [
        {
          role: "system",
          content:
            "You are an expert in resume writing. Enhance the job description into 1–2 strong ATS-friendly sentences highlighting responsibilities and achievements. Only return the improved text.",
        },
        { role: "user", content: userContent },
      ],
    });

    const enhancedContent = response.choices[0].message.content;
    return res.status(200).json({ enhancedContent });

  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// POST: /api/ai/upload-resume
export const uploadResume = async (req, res) => {
  try {
    const { resumeText, title } = req.body;
    const userId = req.userId;

    if (!resumeText) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const systemPrompt =
      "You are an expert AI agent to extract data from resume.";

    const userPrompt = `Extract data from this resume: ${resumeText}
Provide the output strictly in JSON format:
{
  "professional_summary": "",
  "skills": [],
  "personal_info": {
    "image": "",
    "full_name": "",
    "profession": "",
    "email": "",
    "phone": "",
    "location": "",
    "linkedin": "",
    "website": ""
  },
  "experience": [
    {
      "company": "",
      "position": "",
      "start_date": "",
      "end_date": "",
      "description": "",
      "is_current": ""
    }
  ],
  "project": [
    {
      "name": "",
      "type": "",
      "description": ""
    }
  ],
  "education": [
    {
      "institution": "",
      "degree": "",
      "field": "",
      "graduation_date": "",
      "gpa": ""
    }
  ]
}`;

    const response = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" },
    });

    const extractedData = response.choices[0].message.content;
    const parsedData = JSON.parse(extractedData);

    // Create resume in DB
    const newResume = await Resume.create({
      userId,
      title,
      ...parsedData,
    });

    return res.json({ resumeId: newResume._id });

  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
