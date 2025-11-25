





import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../configs/api';
import {
  ArrowLeftIcon,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  DownloadIcon,
  EyeIcon,
  EyeOffIcon,
  FileText,
  FolderIcon,
  GraduationCap,
  Share2Icon,
  Sparkles,
  User
} from 'lucide-react';

import PersonalInfoForm from '../components/PersonalInfoForm';
import ResumePreview from '../components/ResumePreview';
import TemplateSelector from '../components/TemplateSelector';
import ColorPicker from '../components/ColorPicker';
import ProfessionalSummary from '../components/ProfessionalSummary';
import ExperienceForm from '../components/ExperienceForm';
import EducationForm from '../components/EducationForm';
import ProjectForm from '../components/ProjectForm';
import SkillsForm from '../components/SkillsForm';
import { useSelector } from 'react-redux';

const ResumeBuilder = () => {
  const { resumeId } = useParams();
  const { token } = useSelector((state) => state.auth);

  const [resumeData, setResumeData] = useState({
    _id: '',
    title: '',
    personal_info: {},
    professional_summary: '',
    experience: [],
    education: [],
    project: [],
    skills: [],
    template: 'classic',
    accent_color: '#3B82F6',
    public: false,
  });

  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [removeBackground, setRemoveBackground] = useState(false);

  const sections = [
    { id: 'personal', name: 'Personal Info', icon: User },
    { id: 'summary', name: 'Summary', icon: FileText },
    { id: 'experience', name: 'Experience', icon: Briefcase },
    { id: 'education', name: 'Education', icon: GraduationCap },
    { id: 'projects', name: 'Projects', icon: FolderIcon },
    { id: 'skills', name: 'Skills', icon: Sparkles },
  ];

  const activeSection = sections[activeSectionIndex];

  // ---------------------------------------------------
  // LOAD EXISTING RESUME  (FIXED)
  // ---------------------------------------------------
  const loadExistingResume = async () => {
    if (!resumeId) return;

    try {
      const { data } = await api.get(`/api/resumes/get`, {
        params: { resumeId },
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data?.resume) {
        setResumeData(prev => ({
          ...prev,
          ...data.resume,
          title: data.resume.title || prev.title
        }));

        document.title = data.resume.title || "Resume Builder";
      }
    } catch (error) {
      console.error('Failed to load resume:', error?.response?.data || error);
    }
  };

  useEffect(() => {
    loadExistingResume();
  }, [resumeId, token]);

  // ---------------------------------------------------
  // SAVE RESUME (CREATE / UPDATE) — FIXED VALIDATION
  // ---------------------------------------------------
  const saveResume = async () => {
    try {
     if (!resumeData.title || resumeData.title.trim() === "") {
    alert("Please add a resume title before saving.");
    return;
}


      let response;

      if (resumeData._id) {
        const formData = new FormData();
        formData.append('resumeId', resumeData._id);
        formData.append('resumeData', JSON.stringify(resumeData));
        formData.append('removeBackground', removeBackground.toString());

        const img = resumeData.personal_info?.image;

        if (img instanceof File) {
          formData.append('image', img);
        }

        response = await api.put('/api/resumes/update', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        });
      } else {
        response = await api.post(
          '/api/resumes/create',
          { title: resumeData.title },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response?.data?.resume?._id) {
          setResumeData(prev => ({ ...prev, _id: response.data.resume._id }));
        }
      }

      alert(response?.data?.message || "Saved successfully!");
    } catch (error) {
      console.error("SAVE ERROR:", error?.response?.data || error.message);
      alert(error?.response?.data?.message || "Failed to save resume");
    }
  };

  // ---------------------------------------------------
  // PUBLIC/PRIVATE SWITCH
  // ---------------------------------------------------
  const changeResumeVisibility = () =>
    setResumeData(prev => ({ ...prev, public: !prev.public }));

  const handleShare = () => {
    const frontendUrl = window.location.href.split('/app')[0];
    const resumeUrl = `${frontendUrl}/view/${resumeData._id}`;

    if (navigator.share) {
      navigator.share({ url: resumeUrl, text: 'My Resume' });
    } else {
      alert('Sharing not supported on this browser.');
    }
  };

  const downloadResume = () => window.print();

  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Link
          to="/app"
          className="inline-flex gap-2 items-center text-slate-500 hover:text-slate-700 transition-all"
        >
          <ArrowLeftIcon className="size-4" /> Back to Dashboard
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-8">
        <div className="grid lg:grid-cols-12 gap-8">

          {/* LEFT PANEL */}
          <div className="relative lg:col-span-5 rounded-lg overflow-hidden">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 pt-1">

              {/* Progress Bar */}
              <hr className="absolute top-0 left-0 right-0 border-2 border-gray-200" />
              <hr
                className="absolute top-0 left-0 h-1 bg-green-600 border-none transition-all"
                style={{
                  width: `${(activeSectionIndex * 100) / (sections.length - 1)}%`,
                }}
              />

              {/* Navigation */}
              <div className="flex justify-between items-center mb-6 border-b border-gray-300 py-1">
                <div className="flex items-center gap-2">
                  <TemplateSelector
                    selectedTemplate={resumeData.template}
                    onChange={(template) =>
                      setResumeData(prev => ({ ...prev, template }))
                    }
                  />
                  <ColorPicker
                    selectedColor={resumeData.accent_color}
                    onChange={(color) =>
                      setResumeData(prev => ({ ...prev, accent_color: color }))
                    }
                  />
                </div>

                <div className="flex items-center">
                  {activeSectionIndex !== 0 && (
                    <button
                      onClick={() =>
                        setActiveSectionIndex(prev => Math.max(prev - 1, 0))
                      }
                      className="flex items-center gap-1 p-3 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
                    >
                      <ChevronLeft className="size-4" /> Previous
                    </button>
                  )}

                  <button
                    onClick={() =>
                      setActiveSectionIndex(prev =>
                        Math.min(prev + 1, sections.length - 1)
                      )
                    }
                    disabled={activeSectionIndex === sections.length - 1}
                    className={`flex items-center gap-1 p-3 rounded-lg text-sm text-gray-600 hover:bg-gray-50 
                      ${
                        activeSectionIndex === sections.length - 1 &&
                        "opacity-50"
                      }
                    `}
                  >
                    Next <ChevronRight className="size-4" />
                  </button>
                </div>
              </div>

              {/* FORM CONTENT */}
              <div className="space-y-6">
                {activeSection.id === 'personal' && (
                  <PersonalInfoForm
                    data={resumeData.personal_info}
                    onChange={(data) =>
                      setResumeData(prev => ({ ...prev, personal_info: data }))
                    }
                    removeBackground={removeBackground}
                    setRemoveBackground={setRemoveBackground}
                  />
                )}

                {activeSection.id === 'summary' && (
                  <ProfessionalSummary
                    data={resumeData.professional_summary}
                    onChange={(data) =>
                      setResumeData(prev => ({
                        ...prev,
                        professional_summary: data,
                      }))
                    }
                  />
                )}

                {activeSection.id === 'experience' && (
                  <ExperienceForm
                    data={resumeData.experience}
                    onChange={(data) =>
                      setResumeData(prev => ({ ...prev, experience: data }))
                    }
                  />
                )}

                {activeSection.id === 'education' && (
                  <EducationForm
                    data={resumeData.education}
                    onChange={(data) =>
                      setResumeData(prev => ({ ...prev, education: data }))
                    }
                  />
                )}

                {activeSection.id === 'projects' && (
                  <ProjectForm
                    data={resumeData.project}
                    onChange={(data) =>
                      setResumeData(prev => ({ ...prev, project: data }))
                    }
                  />
                )}

                {activeSection.id === 'skills' && (
                  <SkillsForm
                    data={resumeData.skills}
                    onChange={(data) =>
                      setResumeData(prev => ({ ...prev, skills: data }))
                    }
                  />
                )}
              </div>


              {/* RESUME TITLE INPUT */}
<div className="mb-4">
  <label className="block text-sm font-medium text-gray-700">
    Resume Title
  </label>
  <input
    type="text"
    value={resumeData.title}
    onChange={(e) =>
      setResumeData((prev) => ({ ...prev, title: e.target.value }))
    }
    className="mt-1 p-2 border border-gray-300 rounded w-full"
    placeholder="Enter your resume title "
  />
</div>


              {/* SAVE BUTTON */}
              <button
                onClick={saveResume}
                className="bg-green-200 text-green-700 rounded-md px-6 py-2 mt-6 text-sm hover:ring ring-green-300"
              >
                Save Changes
              </button>
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="lg:col-span-7 max-lg:mt-6">
            <div className="relative w-full">
              <div className="absolute bottom-3 left-0 right-0 flex items-center justify-end gap-2">
                {resumeData.public && (
                  <button
                    onClick={handleShare}
                    className="flex items-center p-2 px-4 gap-2 text-xs bg-blue-200 text-blue-700 rounded-lg"
                  >
                    <Share2Icon className="size-4" /> Share
                  </button>
                )}

                <button
                  onClick={changeResumeVisibility}
                  className="flex items-center p-2 px-4 gap-2 text-xs bg-purple-200 text-purple-700 rounded-lg"
                >
                  {resumeData.public ? (
                    <EyeIcon className="size-4" />
                  ) : (
                    <EyeOffIcon className="size-4" />
                  )}
                  {resumeData.public ? "Public" : "Private"}
                </button>

                <button
                  onClick={downloadResume}
                  className="flex items-center p-2 px-4 gap-2 text-xs bg-green-200 text-green-700 rounded-lg"
                >
                  <DownloadIcon className="size-4" /> Download
                </button>
              </div>
            </div>

            <ResumePreview
              data={resumeData}
              template={resumeData.template}
              accentColor={resumeData.accent_color}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;
