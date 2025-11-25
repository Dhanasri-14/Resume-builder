
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ResumePreview from "../components/ResumePreview";

import api from "../configs/api";

const Preview = () => {
  const { resumeId } = useParams();

  const [isLoading, setIsLoading] = useState(true);
  const [resumeData, setResumeData] = useState(null);

  const loadResume = async () => {
    try {
      const { data } = await api.get(`/api/resumes/public/${resumeId}`);
      setResumeData(data.resume);
    } catch (error) {
      console.log(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadResume();
  }, []);

  if (isLoading) return <Loader />;

  return resumeData ? (
    <div className="bg-slate-100">
      <div className="max-w-3xl mx-auto py-10">
        <ResumePreview
          data={resumeData}
          template={resumeData.template}
          accentColor={resumeData.accent_Color}
          classes="py-4 bg-white"
        />
      </div>
    </div>
  ) : (
    <div className="text-center py-10 text-red-500">Failed to load resume</div>
  );
};

export default Preview;
