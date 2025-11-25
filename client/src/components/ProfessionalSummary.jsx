

import { Loader2, Sparkles } from 'lucide-react';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import api from '../configs/api';
import toast from 'react-hot-toast';

const ProfessionalSummary = ({ data, onChange }) => {
  const { token } = useSelector(state => state.auth);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateSummary = async () => {
    try {
      setIsGenerating(true);

      const prompt = `Enhance my professional summary: "${data}"`;

      const response = await api.post(
        '/api/ai/enhance-pro-sum',
        { userContent: prompt },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // FIXED — update via onChange()
      onChange(response.data.enhancedContent);

      toast.success("Summary enhanced!");
    } catch (error) {
      toast.error(error?.response?.data?.message || "AI enhancement failed");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-4">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <h3 className="text-lg font-semibold text-gray-900">Professional Summary</h3>
          <p className="text-sm text-gray-500 -mt-0.5">
            Add summary for your resume here
          </p>
        </div>

        <button
          disabled={isGenerating}
          onClick={generateSummary}   // FIXED
          className="flex items-center gap-2 px-3 py-1 text-sm bg-purple-100 
                     text-purple-700 rounded hover:bg-purple-200 transition-colors"
        >
          {isGenerating ? (
            <Loader2 className='size-4 animate-spin' />
          ) : (
            <Sparkles className="size-4" />
          )}
          {isGenerating ? "Enhancing..." : "AI Enhance"}
        </button>
      </div>

      {/* Textarea */}
      <div className="mt-4">
        <textarea
          value={data || ""}
          onChange={(e) => onChange(e.target.value)}   // FIXED
          rows={7}
          className="w-full p-3 px-4 mt-2 border text-sm border-gray-300 rounded-lg 
                     focus:ring focus:ring-blue-500 focus:border-blue-500 outline-none 
                     transition-colors resize-none"
          placeholder="Write a compelling professional summary..."
        />

        <p className="text-xs text-gray-500 max-w-[80%] mx-auto text-center mt-2">
          Tip: Keep it concise (3–4 sentences) and focus on your most relevant achievements.
        </p>
      </div>

    </div>
  );
};

export default ProfessionalSummary;

