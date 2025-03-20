'use client'
import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
interface JobDescription {
  id?: number;
  title: string;
  company: string;
  location: string;
  description: string;
  required_skills: string[];
  preferred_skills: string[];
  experience_required: string;
  education_required: string;
  job_type: string;
  salary_range?: string;
  benefits?: string[];
  application_url?: string;
  contact_email?: string;
  date_posted?: string;
  role?: string;
}

interface JobDescriptionFormProps {
  job?: JobDescription | null;
  onClose: () => void;
  onSubmitSuccess: (job: JobDescription) => void;
}

const JobDescriptionForm: React.FC<JobDescriptionFormProps> = ({ 
  job, 
  onClose,
  onSubmitSuccess
}) => {
  const isEditMode = !!job?.id;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form state for arrays (skills and benefits)
  const [requiredSkills, setRequiredSkills] = useState<string[]>(job?.required_skills || []);
  const [preferredSkills, setPreferredSkills] = useState<string[]>(job?.preferred_skills || []);
  const [benefits, setBenefits] = useState<string[]>(job?.benefits || []);
  
  // Form state for new items to be added
  const [newRequiredSkill, setNewRequiredSkill] = useState('');
  const [newPreferredSkill, setNewPreferredSkill] = useState('');
  const [newBenefit, setNewBenefit] = useState('');

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<JobDescription>({
    defaultValues: job || {
      title: '',
      company: '',
      location: '',
      description: '',
      required_skills: [],
      preferred_skills: [],
      experience_required: '',
      education_required: '',
      job_type: 'Full-time',
      salary_range: '',
      benefits: [],
      application_url: '',
      contact_email: '',
      date_posted: new Date().toISOString().split('T')[0]
    }
  });

  useEffect(() => {
    if (job) {
      reset(job);
      setRequiredSkills(job.required_skills || []);
      setPreferredSkills(job.preferred_skills || []);
      setBenefits(job.benefits || []);
    }
  }, [job, reset]);

  const onSubmit = async (data: JobDescription) => {
    setIsSubmitting(true);
    setError(null);
    
    // Merge form data with array states
    const submitData = {
      ...data,
      required_skills: requiredSkills,
      preferred_skills: preferredSkills,
      benefits: benefits.length > 0 ? benefits : undefined
    };
    
    try {
      const url = isEditMode 
        ? `/api/job-descriptions/${job?.id}`
        : '/api/job-descriptions';
      
      const method = isEditMode ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(submitData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to save job description');
      }
      
      const savedJob = await response.json();
      onSubmitSuccess(savedJob);
      onClose();
    } catch (err) {
      console.error('Error saving job description:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handlers for array items
  const addRequiredSkill = () => {
    if (newRequiredSkill.trim()) {
      setRequiredSkills([...requiredSkills, newRequiredSkill.trim()]);
      setNewRequiredSkill('');
    }
  };

  const removeRequiredSkill = (index: number) => {
    setRequiredSkills(requiredSkills.filter((_, i) => i !== index));
  };

  const addPreferredSkill = () => {
    if (newPreferredSkill.trim()) {
      setPreferredSkills([...preferredSkills, newPreferredSkill.trim()]);
      setNewPreferredSkill('');
    }
  };

  const removePreferredSkill = (index: number) => {
    setPreferredSkills(preferredSkills.filter((_, i) => i !== index));
  };

  const addBenefit = () => {
    if (newBenefit.trim()) {
      setBenefits([...benefits, newBenefit.trim()]);
      setNewBenefit('');
    }
  };

  const removeBenefit = (index: number) => {
    setBenefits(benefits.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed inset-0 bg-opacity-50 flex items-start justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl my-8">
        <div className="sticky top-0 bg-white p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-gray-800">
            {isEditMode ? 'Edit Job Description' : 'Create New Job Description'}
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            ✕
          </button>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Job Title*
              </label>
              <input
                {...register('title', { required: 'Job title is required' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
              )}
            </div>
            
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Company*
              </label>
              <input
                {...register('company', { required: 'Company is required' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.company && (
                <p className="text-red-500 text-sm mt-1">{errors.company.message}</p>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Location*
              </label>
              <input
                {...register('location', { required: 'Location is required' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.location && (
                <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>
              )}
            </div>
            
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Job Type*
              </label>
              <select
                {...register('job_type', { required: 'Job type is required' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Temporary">Temporary</option>
                <option value="Internship">Internship</option>
                <option value="Remote">Remote</option>
              </select>
              {errors.job_type && (
                <p className="text-red-500 text-sm mt-1">{errors.job_type.message}</p>
              )}
            </div>
          </div>
          
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Job Description*
            </label>
            <textarea
              {...register('description', { required: 'Job description is required' })}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Experience Required*
              </label>
              <input
                {...register('experience_required', { required: 'Experience is required' })}
                placeholder="e.g., 2+ years"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.experience_required && (
                <p className="text-red-500 text-sm mt-1">{errors.experience_required.message}</p>
              )}
            </div>
            
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Education Required*
              </label>
              <input
                {...register('education_required', { required: 'Education is required' })}
                placeholder="e.g., Bachelor's degree"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.education_required && (
                <p className="text-red-500 text-sm mt-1">{errors.education_required.message}</p>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Salary Range
              </label>
              <input
                {...register('salary_range')}
                placeholder="e.g., $60,000 - $80,000"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Date Posted
              </label>
              <input
                type="date"
                {...register('date_posted')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Application URL
              </label>
              <input
                {...register('application_url')}
                placeholder="https://..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Contact Email
              </label>
              <input
                type="email"
                {...register('contact_email')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Required Skills
            </label>
            <div className="flex">
              <input
                type="text"
                value={newRequiredSkill}
                onChange={(e) => setNewRequiredSkill(e.target.value)}
                placeholder="Add a required skill"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addRequiredSkill())}
              />
              <button
                type="button"
                onClick={addRequiredSkill}
                className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700"
              >
                Add
              </button>
            </div>
            
            {requiredSkills.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {requiredSkills.map((skill, index) => (
                  <div key={index} className="bg-gray-100 px-3 py-1 rounded-full flex items-center">
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => removeRequiredSkill(index)}
                      className="ml-2 text-gray-500 hover:text-red-500"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Preferred Skills
            </label>
            <div className="flex">
              <input
                type="text"
                value={newPreferredSkill}
                onChange={(e) => setNewPreferredSkill(e.target.value)}
                placeholder="Add a preferred skill"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addPreferredSkill())}
              />
              <button
                type="button"
                onClick={addPreferredSkill}
                className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700"
              >
                Add
              </button>
            </div>
            
            {preferredSkills.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {preferredSkills.map((skill, index) => (
                  <div key={index} className="bg-gray-100 px-3 py-1 rounded-full flex items-center">
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => removePreferredSkill(index)}
                      className="ml-2 text-gray-500 hover:text-red-500"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Benefits
            </label>
            <div className="flex">
              <input
                type="text"
                value={newBenefit}
                onChange={(e) => setNewBenefit(e.target.value)}
                placeholder="Add a benefit"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addBenefit())}
              />
              <button
                type="button"
                onClick={addBenefit}
                className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700"
              >
                Add
              </button>
            </div>
            
            {benefits.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {benefits.map((benefit, index) => (
                  <div key={index} className="bg-gray-100 px-3 py-1 rounded-full flex items-center">
                    <span>{benefit}</span>
                    <button
                      type="button"
                      onClick={() => removeBenefit(index)}
                      className="ml-2 text-gray-500 hover:text-red-500"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400"
            >
              {isSubmitting ? 'Saving...' : isEditMode ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobDescriptionForm;