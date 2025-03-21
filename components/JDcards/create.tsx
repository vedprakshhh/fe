import React, { useState } from 'react';

interface HRJobPostingFormProps {
  open: boolean;
  onClose: () => void;
}

const HRJobPostingForm: React.FC<HRJobPostingFormProps> = ({ open, onClose }) => {
  const [formData, setFormData] = useState({
    jobTitle: '',
    company: '',
    experienceRequired: '',
    educationRequired: '',
    postDate: '',
    jobDescription: '',
    responsibilities: '',
    qualifications: '',
    requiredSkills: '',
    preferredSkills: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Here you would typically send the data to an API
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white max-w-4xl w-full p-6 shadow-lg rounded-lg relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl"
        >
          ✕
        </button>
        <h1 className="text-2xl font-bold mb-6 text-center text-blue-700">HR Job Posting Form</h1>

        {isSubmitted && (
          <div className="mb-4 p-4 bg-green-100 text-green-700 rounded">
            Job posting submitted successfully!
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700">Job Title *</label>
              <input
                type="text"
                id="jobTitle"
                name="jobTitle"
                value={formData.jobTitle}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="company" className="block text-sm font-medium text-gray-700">Our Company *</label>
              <input
                type="text"
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="experienceRequired" className="block text-sm font-medium text-gray-700">Experience Required *</label>
              <input
                type="text"
                id="experienceRequired"
                name="experienceRequired"
                value={formData.experienceRequired}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., 2-3 years"
              />
            </div>

            <div>
              <label htmlFor="educationRequired" className="block text-sm font-medium text-gray-700">Education Required *</label>
              <input
                type="text"
                id="educationRequired"
                name="educationRequired"
                value={formData.educationRequired}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Bachelor's degree"
              />
            </div>

            <div>
              <label htmlFor="postDate" className="block text-sm font-medium text-gray-700">Posted Date *</label>
              <input
                type="date"
                id="postDate"
                name="postDate"
                value={formData.postDate}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="jobDescription" className="block text-sm font-medium text-gray-700">Job Description *</label>
              <textarea
                id="jobDescription"
                name="jobDescription"
                value={formData.jobDescription}
                onChange={handleChange}
                required
                rows={4}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              ></textarea>
            </div>

            {/* Add other fields here as in the original form */}
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => setFormData({
                jobTitle: '',
                company: '',
                experienceRequired: '',
                educationRequired: '',
                postDate: '',
                jobDescription: '',
                responsibilities: '',
                qualifications: '',
                requiredSkills: '',
                preferredSkills: ''
              })}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Clear Form
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Submit Job Posting
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HRJobPostingForm;