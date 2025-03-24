// InterviewFeedbackForm.tsx
"use client";
import React, { useState } from 'react';
import axios from 'axios';
// First run: npm install axios @types/axiosimport { FaStar, FaPaperPlane } from 'react-icons/fa';

interface FeedbackFormData {
  candidateName: string;
  position: string;
  technicalSkills: string;
  communicationSkills: string;
  overallRating: number;
}

const InterviewFeedbackForm: React.FC = () => {
  const [formData, setFormData] = useState<FeedbackFormData>({
    candidateName: '',
    position: '',
    technicalSkills: '',
    communicationSkills: '',
    overallRating: 0,
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitStatus, setSubmitStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRatingChange = (rating: number) => {
    setFormData((prev) => ({
      ...prev,
      overallRating: rating,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await axios.post('http://localhost:8000/api/feedback', formData);
      setSubmitStatus({
        success: true,
        message: 'Feedback submitted successfully!',
      });
      
      // Reset form after successful submission
      setFormData({
        candidateName: '',
        position: '',
        technicalSkills: '',
        communicationSkills: '',
        overallRating: 0,
      });
    } catch (error) {
      setSubmitStatus({
        success: false,
        message: 'Error submitting feedback. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-start border-b-2 border-blue-600 pb-4 mb-6">
        <h1 className="text-2xl font-bold text-blue-600">Interview Feedback Form</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="col-span-1">
            <label className="block text-gray-700 font-semibold mb-2">
              Job Description
            </label>
            <input
              type="text"
              name="candidateName"
              value={formData.candidateName}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="col-span-1">
            <label className="block text-gray-700 font-semibold mb-2">
              Resume
            </label>
            <input
              type="text"
              name="position"
              value={formData.position}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">
            Hiring Manager Feedback
          </label>
          <textarea
            name="technicalSkills"
            value={formData.technicalSkills}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-32"
            required
          ></textarea>
        </div>

        <div className="mb-8">
          <p className="block text-gray-700 font-semibold mb-2">Overall Rating</p>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                type="button"
                onClick={() => handleRatingChange(rating)}
                className="text-2xl focus:outline-none"
              >

                <span
                  className={
                    rating <= formData.overallRating
                      ? 'text-yellow-400'
                      : 'text-gray-300'
                  }

                >
                  ★
                </span>
              </button>
            ))}
          </div>
        </div>

        {submitStatus && (
          <div 
            className={`p-4 mb-6 rounded-md ${
              submitStatus.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}
          >
            {submitStatus.message}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center justify-center bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
        >

          {isSubmitting ? 'Submitting...' : 'Submit Feedback'}        </button>
      </form>
    </div>
  );};

export default InterviewFeedbackForm;