import React from 'react';

interface JobDescription {
  id: number;
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
  upload_date?: string;
  role?: string;
}

interface JobDetailsCardProps {
  job: JobDescription | null;
  onClose: () => void;
}

const JobDetailsCard: React.FC<JobDetailsCardProps> = ({ job, onClose }) => {
  if (!job) return null;

  return (
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-gray-800">{job.title}</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            ✕
          </button>
        </div>
        
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-xl font-medium text-gray-800">{job.company}</h3>
              <p className="text-gray-600">{job.location}</p>
            </div>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
              {job.role || job.job_type}
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-gray-700"><span className="font-medium">Experience Required:</span> {job.experience_required}</p>
              <p className="text-gray-700"><span className="font-medium">Education Required:</span> {job.education_required}</p>
              {job.salary_range && (
                <p className="text-gray-700"><span className="font-medium">Salary Range:</span> {job.salary_range}</p>
              )}
            </div>
            <div>
              <p className="text-gray-700">
                <span className="font-medium">Posted:</span> {job.date_posted || 'N/A'}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Uploaded:</span> {job.upload_date || 'N/A'}
              </p>
              {job.contact_email && (
                <p className="text-gray-700"><span className="font-medium">Contact:</span> {job.contact_email}</p>
              )}
            </div>
          </div>
          
          <div className="mb-6">
            <h4 className="text-lg font-medium text-gray-800 mb-2">Job Description</h4>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <p className="text-gray-700 whitespace-pre-line">{job.description}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h4 className="text-lg font-medium text-gray-800 mb-2">Required Skills</h4>
              {job.required_skills && job.required_skills.length > 0 ? (
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <ul className="list-disc list-inside space-y-1">
                    {job.required_skills.map((skill, index) => (
                      <li key={index} className="text-gray-700">{skill}</li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="text-gray-500">No required skills specified</p>
              )}
            </div>
            
            <div>
              <h4 className="text-lg font-medium text-gray-800 mb-2">Preferred Skills</h4>
              {job.preferred_skills && job.preferred_skills.length > 0 ? (
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <ul className="list-disc list-inside space-y-1">
                    {job.preferred_skills.map((skill, index) => (
                      <li key={index} className="text-gray-700">{skill}</li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="text-gray-500">No preferred skills specified</p>
              )}
            </div>
          </div>
          
          {job.benefits && job.benefits.length > 0 && (
            <div className="mb-6">
              <h4 className="text-lg font-medium text-gray-800 mb-2">Benefits</h4>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <ul className="list-disc list-inside space-y-1">
                  {job.benefits.map((benefit, index) => (
                    <li key={index} className="text-gray-700">{benefit}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          
          {job.application_url && (
            <div className="mt-6">
              <a 
                href={job.application_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
              >
                Apply Now
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobDetailsCard;