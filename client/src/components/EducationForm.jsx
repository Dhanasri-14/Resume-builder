
import { GraduationCap, Plus, Trash2 } from "lucide-react";
import React from "react";

const EducationForm = ({ data, onChange }) => {

  const addEducation = () => {
    const newEducation = {
      institution: "",
      degree: "",
      field: "",
      end_date: "",
      gpa: "",
      is_current: false,
      description: "",
    };
    onChange([...data, newEducation]);
  };

  const removeEducation = (index) => {
    const updated = data.filter((_, i) => i !== index);
    onChange(updated);
  };

  const updateEducation = (index, field, value) => {
    const updated = [...data];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <h3 className="text-lg font-semibold text-gray-900">Education</h3>
          <p className="text-sm text-gray-500 -mt-0.5">
            Add your education details
          </p>
        </div>

        <button
          onClick={addEducation}
          className="flex items-center gap-2 px-3 py-1 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
        >
          <Plus className="size-4" />
          Add Education
        </button>
      </div>

      {/* Empty State */}
      {data.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <GraduationCap className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No education added yet.</p>
          <p>Click "Add Education" to get started.</p>
        </div>
      ) : (
        <div className="space-y-4">

          {data.map((education, index) => (
            <div
              key={index}
              className="p-4 border border-gray-200 rounded-lg space-y-3"
            >
              
              {/* Title + Delete */}
              <div className="flex justify-between items-center">
                <h4 className="font-semibold">Education #{index + 1}</h4>
                <button
                  onClick={() => removeEducation(index)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>

              {/* Institution */}
              <input
                value={education.institution}
                onChange={(e) =>
                  updateEducation(index, "institution", e.target.value)
                }
                type="text"
                placeholder="Institution Name"
                className="px-3 py-2 text-sm rounded-lg border w-full"
              />

              {/* Degree */}
              <input
                value={education.degree}
                onChange={(e) =>
                  updateEducation(index, "degree", e.target.value)
                }
                type="text"
                placeholder="Degree (e.g., Bachelor's, Master's)"
                className="px-3 py-2 text-sm rounded-lg border w-full"
              />

              {/* Field */}
              <input
                value={education.field}
                onChange={(e) =>
                  updateEducation(index, "field", e.target.value)
                }
                type="text"
                placeholder="Field of Study"
                className="px-3 py-2 text-sm rounded-lg border w-full"
              />

              {/* Graduation / End Date */}
              <input
                value={education.end_date}
                onChange={(e) =>
                  updateEducation(index, "end_date", e.target.value)
                }
                type="month"
                disabled={education.is_current}
                className="px-3 py-2 text-sm rounded-lg border w-full disabled:bg-gray-100"
              />

              {/* GPA */}
              <input
                value={education.gpa}
                onChange={(e) =>
                  updateEducation(index, "gpa", e.target.value)
                }
                type="text"
                placeholder="GPA (optional)"
                className="px-3 py-2 text-sm rounded-lg border w-full"
              />

            </div>
          ))}

        </div>
      )}
    </div>
  );
};

export default EducationForm;

