// Create this as a separate component in your project
// Add this right before your export default function or in a separate file

interface JobDetailsCardProps {
    job: JobDescription | null;
    onClose: () => void;
  }
  
  const JobDetailsCard: React.FC<JobDetailsCardProps> = ({ job, onClose }) => {
    if (!job) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">{job.title}</h2>
              <button 
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="mb-4">
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <Briefcase className="w-5 h-5" />
                <span>{job.company}</span>
                {job.location && (
                  <>
                    <span className="mx-2">•</span>
                    <span>{job.location}</span>
                  </>
                )}
              </div>
              
              {job.job_type && (
                <div className="mb-2">
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    {job.job_type}
                  </span>
                  {job.salary_range && (
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded ml-2">
                      {job.salary_range}
                    </span>
                  )}
                </div>
              )}
            </div>
            
            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <div className="text-gray-700 whitespace-pre-line">
                {job.description}
              </div>
            </div>
            
            {job.required_skills && job.required_skills.length > 0 && (
              <div className="border-t border-gray-200 mt-4 pt-4">
                <h3 className="text-lg font-semibold mb-2">Required Skills</h3>
                <ul className="list-disc pl-5 text-gray-700">
                  {job.required_skills.map((skill, index) => (
                    <li key={index}>{skill}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {job.preferred_skills && job.preferred_skills.length > 0 && (
              <div className="border-t border-gray-200 mt-4 pt-4">
                <h3 className="text-lg font-semibold mb-2">Preferred Skills</h3>
                <ul className="list-disc pl-5 text-gray-700">
                  {job.preferred_skills.map((skill, index) => (
                    <li key={index}>{skill}</li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="border-t border-gray-200 mt-4 pt-4">
              <h3 className="text-lg font-semibold mb-2">Requirements</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="font-medium text-gray-700">Experience:</p>
                  <p className="text-gray-600">{job.experience_required}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700">Education:</p>
                  <p className="text-gray-600">{job.education_required}</p>
                </div>
              </div>
            </div>
            
            {job.benefits && job.benefits.length > 0 && (
              <div className="border-t border-gray-200 mt-4 pt-4">
                <h3 className="text-lg font-semibold mb-2">Benefits</h3>
                <ul className="list-disc pl-5 text-gray-700">
                  {job.benefits.map((benefit, index) => (
                    <li key={index}>{benefit}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {job.application_url && (
              <div className="border-t border-gray-200 mt-4 pt-4">
                <h3 className="text-lg font-semibold mb-2">How to Apply</h3>
                <a 
                  href={job.application_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 transition"
                >
                  Application Link
                </a>
              </div>
            )}
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={onClose}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };