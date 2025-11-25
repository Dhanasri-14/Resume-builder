
import {
  FilePenLineIcon,
  LoaderCircleIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
  UploadCloud,
  UploadCloudIcon,
  XIcon
} from "lucide-react";

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import api from "../configs/api";
import pdfToText from "react-pdftotext";

const Dashboard = () => {
  const { user, token } = useSelector((state) => state.auth);

  const colors = ["#9333ea", "#d97706", "#dc2626", "#0284c7", "#16a34a"];

  const [allResumes, setAllResumes] = useState([]);
  const [showCreateResume, setShowCreateResume] = useState(false);
  const [showUploadResume, setShowUploadResume] = useState(false);
  const [title, setTitle] = useState("");
  const [resume, setResume] = useState(null);
  const [editResumeId, setEditResumeId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  // Load all resumes
  const loadAllResumes = async () => {
    try {
      const { data } = await api.get("/api/users/resumes", {
        headers: {
          Authorization: `Bearer ${token}` // FIXED
        }
      });
      setAllResumes(data.resumes);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  // CREATE RESUME
  const createResume = async (event) => {
    event.preventDefault();

    try {
      const { data } = await api.post(
        "/api/resumes/create",
        { title },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setAllResumes([...allResumes, data.resume]);
      setTitle("");
      setShowCreateResume(false);
      navigate(`/app/builder/${data.resume._id}`);
      toast.success("Resume created successfully");
    } catch (error) {
      console.error("API ERROR:", error?.response?.data || error.message);
      toast.error(error?.response?.data?.message || "Failed to create resume");
    }
  };

  // UPLOAD RESUME
  const uploadResume = async (event) => {
    event.preventDefault();

    if (!resume) {
      toast.error("Please select a file");
      return;
    }

    setIsLoading(true);

    try {
      const resumeText = await pdfToText(resume);

      const { data } = await api.post(
        "/api/ai/upload-resume",
        { title, resumeText },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setTitle("");
      setResume(null);
      setShowUploadResume(false);
      navigate(`/app/builder/${data.resumeId}`);
      toast.success("Resume uploaded successfully");
    } catch (error) {
      console.error("UPLOAD ERROR:", error?.response?.data || error.message);
      toast.error(error?.response?.data?.message || "Failed to upload resume");
    }

    setIsLoading(false);
  };

  // EDIT TITLE
  const editTitle = async (event) => {
    event.preventDefault();

    try {
      const { data } = await api.put(
        `/api/resumes/update`,
        { resumeId: editResumeId, resumeData: { title } },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      const updatedList = allResumes.map((res) =>
        res._id === editResumeId ? { ...res, title } : res
      );

      setAllResumes(updatedList);
      setEditResumeId("");
      setTitle("");
      toast.success("Title updated");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  // DELETE RESUME  **FIXED MISSING BRACKETS**
  const deleteResume = async (resumeId) => {
    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this resume?"
      );

      if (!confirmDelete) return;

      const { data } = await api.delete(
        `/api/resumes/delete/${resumeId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setAllResumes(allResumes.filter((res) => res._id !== resumeId));
      toast.success(data.message);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    loadAllResumes();
  }, []);

  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome */}
        <p className="text-2xl font-medium mb-6 bg-gradient-to-r from-slate-600 to-slate-700 bg-clip-text text-transparent sm:hidden">
          Welcome, {user?.name}.
        </p>

        {/* ACTION BUTTONS */}
        <div className="flex gap-4">
          <button
            onClick={() => setShowCreateResume(true)}
            className="w-full bg-white sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 text-slate-600 border border-dashed border-slate-300 group hover:border-purple-500 hover:shadow-lg transition-all duration-300 cursor-pointer"
          >
            <PlusIcon className="size-11 transition-all duration-300 p-2.5 bg-gradient-to-br from-indigo-300 to-indigo-500 text-white rounded-full" />
            <p className="text-sm group-hover:text-indigo-600 transition-all duration-300">
              Create Resume
            </p>
          </button>

          <button
            onClick={() => setShowUploadResume(true)}
            className="w-full bg-white sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 text-slate-600 border border-dashed border-slate-300 group hover:border-indigo-500 hover:shadow-lg transition-all duration-300 cursor-pointer"
          >
            <UploadCloudIcon className="size-11 transition-all duration-300 p-2.5 bg-gradient-to-br from-purple-300 to-purple-500 text-white rounded-full" />
            <p className="text-sm group-hover:text-purple-600 transition-all duration-300">
              Upload Existing
            </p>
          </button>
        </div>

        <hr className="border-slate-300 my-6 sm:w-[305px]" />

        {/* LIST OF RESUMES */}
        <div className="grid grid-cols-2 sm:flex flex-wrap gap-4">
          {allResumes.map((resume, index) => {
            const baseColor = colors[index % colors.length];

            return (
              <button
                key={resume._id}
                onClick={() => navigate(`/app/builder/${resume._id}`)}
                className="relative w-full sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 border group hover:shadow-lg transition-all duration-300 cursor-pointer"
                style={{
                  background: `linear-gradient(135deg, ${baseColor}10, ${baseColor}40)`
                }}
              >
                <FilePenLineIcon
                  className="size-7 group-hover:scale-105 transition-all"
                  style={{ color: baseColor }}
                />

                <p
                  className="text-sm group-hover:scale-105 transition-all px-2 text-center"
                  style={{ color: baseColor }}
                >
                  {resume.title}
                </p>

                <p
                  className="absolute bottom-1 text-[11px] px-2"
                  style={{ color: baseColor + "90" }}
                >
                  Updated on {new Date(resume.updatedAt).toLocaleDateString()}
                </p>

                {/* ICONS */}
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute top-1 right-1 group-hover:flex items-center hidden"
                >
                  <TrashIcon
                    onClick={() => deleteResume(resume._id)}
                    className="size-7 p-1.5 hover:bg-white/50 rounded text-slate-700 transition-colors"
                  />

                  <PencilIcon
                    onClick={() => {
                      setEditResumeId(resume._id);
                      setTitle(resume.title);
                    }}
                    className="size-7 p-1.5 hover:bg-white/50 rounded text-slate-700 transition-colors"
                  />
                </div>
              </button>
            );
          })}
        </div>

        {/* =====================
            CREATE MODAL
        ====================== */}
        {showCreateResume && (
          <div
            onClick={() => setShowCreateResume(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur z-10 flex items-center justify-center"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative bg-slate-50 border shadow-md rounded-lg w-full max-w-sm p-6"
            >
              <h2 className="text-xl font-bold mb-4">Create a Resume</h2>

              <form onSubmit={createResume}>
                <input
                  onChange={(e) => setTitle(e.target.value)}
                  value={title}
                  type="text"
                  placeholder="Enter resume title"
                  className="w-full px-4 py-2 mb-4 border rounded focus:ring focus:ring-green-600"
                  required
                />

                <button className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">
                  Create Resume
                </button>
              </form>

              <XIcon
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer"
                onClick={() => {
                  setShowCreateResume(false);
                  setTitle("");
                }}
              />
            </div>
          </div>
        )}

        {/* =====================
            UPLOAD MODAL
        ====================== */}
        {showUploadResume && (
          <div
            onClick={() => setShowUploadResume(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur z-10 flex items-center justify-center"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative bg-white border shadow-lg rounded-xl w-full max-w-sm p-6"
            >
              <h2 className="text-xl font-bold mb-4">
                {isLoading ? (
                  <LoaderCircleIcon className="animate-spin size-4 text-white" />
                ) : (
                  "Upload Resume"
                )}
              </h2>

              <form onSubmit={uploadResume}>
                <input
                  type="text"
                  placeholder="Enter resume title"
                  className="w-full px-4 py-2 mb-4 border rounded"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />

                <label htmlFor="resume-file">
                  <div className="flex flex-col items-center justify-center gap-2 border border-dashed rounded-md p-6 cursor-pointer hover:border-green-500">
                    {resume ? (
                      <p className="text-green-700">{resume.name}</p>
                    ) : (
                      <>
                        <UploadCloud className="size-14" />
                        <p>Upload PDF</p>
                      </>
                    )}
                  </div>
                </label>

                <input
                  id="resume-file"
                  type="file"
                  hidden
                  accept=".pdf"
                  onChange={(e) => setResume(e.target.files[0])}
                />

                <button  className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 mt-4">
                  Upload Resume
                </button>
              </form>

              <XIcon
                className="absolute top-4 right-4 cursor-pointer text-slate-400 hover:text-slate-600"
                onClick={() => {
                  setShowUploadResume(false);
                  setTitle("");
                }}
              />
            </div>
          </div>
        )}

        {/* =====================
            EDIT TITLE MODAL
        ====================== */}
        {editResumeId && (
          <div
            onClick={() => setEditResumeId("")}
            className="fixed inset-0 bg-black/70 backdrop-blur z-10 flex items-center justify-center"
          >
            <form
              onClick={(e) => e.stopPropagation()}
              onSubmit={editTitle}
              className="relative bg-white border shadow-lg rounded-xl w-full max-w-sm p-6"
            >
              <h2 className="text-xl font-bold mb-4">Edit Resume Title</h2>

              <input
                type="text"
                className="w-full px-4 py-2 mb-4 border rounded"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />

              <button className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700">
                Update
              </button>

              <XIcon
                className="absolute top-4 right-4 cursor-pointer text-slate-400 hover:text-slate-600"
                onClick={() => {
                  setEditResumeId("");
                  setTitle("");
                }}
              />
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;




