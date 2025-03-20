import React, { useState, useEffect } from 'react';
import axios from 'axios';
//@ts-ignore
import { JobDescription } from '@/components/JDcards'; // Adjust the import path as needed
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

interface JobDetailsCardProps {
  job: JobDescription | null;
  onClose: () => void;
}

const JobSkills: React.FC<JobDetailsCardProps> = ({ job, onClose }) => {
  if (!job) return null;
  
  // API base URL - you might want to store this in an environment variable
  const API_BASE_URL = "http://localhost:8000";
  
  // Initialize state to store input values for required and preferred skills
  const [requiredSkillInputs, setRequiredSkillInputs] = useState<{[key: string]: number}>(
    job.required_skills?.reduce((acc, skill) => ({...acc, [skill]: 0}), {}) || {}
  );
  
  const [preferredSkillInputs, setPreferredSkillInputs] = useState<{[key: string]: number}>(
    job.preferred_skills?.reduce((acc, skill) => ({...acc, [skill]: 0}), {}) || {}
  );
  
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  // Fetch existing skill ratings when component loads
  useEffect(() => {
    if (job.id) {
      fetchExistingRatings();
    }
  }, [job.id]);
  
  // Fetch existing ratings if any
  const fetchExistingRatings = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/job-skills/ratings/${job.id}`);
      
      if (response.status === 200 && response.data) {
        setRequiredSkillInputs(response.data.required_skills || {});
        setPreferredSkillInputs(response.data.preferred_skills || {});
      }
    } catch (error) {
      // No existing ratings or error fetching them - we'll just use the default values
      console.log("No existing ratings found or error fetching them");
    }
  };
  
  // Handle input change for required skills
  const handleRequiredSkillChange = (skill: string, value: number) => {
    setRequiredSkillInputs(prev => ({...prev, [skill]: value}));
  };
  
  // Handle input change for preferred skills
  const handlePreferredSkillChange = (skill: string, value: number) => {
    setPreferredSkillInputs(prev => ({...prev, [skill]: value}));
  };
  
  // Handle save button click
  const handleSave = async () => {
    if (!job.id) return;
    
    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(false);
    
    try {
      const response = await axios.post(`${API_BASE_URL}/api/job-skills/ratings`, {
        job_id: job.id,
        required_skills: requiredSkillInputs,
        preferred_skills: preferredSkillInputs
      });
      
      if (response.status === 200) {
        setSaveSuccess(true);
        setTimeout(() => {
          onClose();
        }, 1500);
      }
    } catch (error) {
      console.error("Error saving skill ratings:", error);
      setSaveError("Failed to save skill ratings. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // Generate random colors for chart segments
  const generateColors = (count: number) => {
    const colors = [];
    for (let i = 0; i < count; i++) {
      const r = Math.floor(Math.random() * 200) + 55; // Avoid too dark colors
      const g = Math.floor(Math.random() * 200) + 55;
      const b = Math.floor(Math.random() * 200) + 55;
      colors.push(`rgba(${r}, ${g}, ${b}, 0.7)`);
    }
    return colors;
  };

  // Prepare data for required skills pie chart
  const requiredSkillsChartData = {
    labels: Object.keys(requiredSkillInputs),
    datasets: [
      {
        data: Object.values(requiredSkillInputs),
        backgroundColor: generateColors(Object.keys(requiredSkillInputs).length),
        borderWidth: 1,
      },
    ],
  };

  // Prepare data for preferred skills pie chart
  const preferredSkillsChartData = {
    labels: Object.keys(preferredSkillInputs),
    datasets: [
      {
        data: Object.values(preferredSkillInputs),
        backgroundColor: generateColors(Object.keys(preferredSkillInputs).length),
        borderWidth: 1,
      },
    ],
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          boxWidth: 15,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${value}/10 (${percentage}%)`;
          }
        }
      }
    }
  };
  
  return (
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
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
          
          {/* Success message */}
          {saveSuccess && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              Skill ratings saved successfully!
            </div>
          )}
          
          {/* Error message */}
          {saveError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {saveError}
            </div>
          )}
            
          {job.required_skills && job.required_skills.length > 0 && (
            <div className="border-t border-gray-200 mt-4 pt-4">
              <h3 className="text-lg font-semibold mb-2">Required Skills</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <ul className="text-gray-700">
                    {job.required_skills.map((skill, index) => (
                      <li key={index} className="flex items-center justify-between mb-2">
                        <span className="mr-4">{skill}</span>
                        <input
                          type="number"
                          min="0"
                          max="10"
                          value={requiredSkillInputs[skill] || 0}
                          onChange={(e) => handleRequiredSkillChange(skill, Math.min(10, Math.max(0, parseInt(e.target.value) || 0)))}
                          className="border border-gray-300 rounded px-3 py-1 w-20 text-center"
                        />
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="h-64">
                  {Object.values(requiredSkillInputs).some(value => value > 0) ? (
                    <Pie data={requiredSkillsChartData} options={chartOptions} />
                  ) : (
                    <div className="flex h-full items-center justify-center text-gray-500">
                      Add ratings to see the chart
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {job.preferred_skills && job.preferred_skills.length > 0 && (
            <div className="border-t border-gray-200 mt-4 pt-4">
              <h3 className="text-lg font-semibold mb-2">Preferred Skills</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <ul className="text-gray-700">
                    {job.preferred_skills.map((skill, index) => (
                      <li key={index} className="flex items-center justify-between mb-2">
                        <span className="mr-4">{skill}</span>
                        <input
                          type="number"
                          min="0"
                          max="10"
                          value={preferredSkillInputs[skill] || 0}
                          onChange={(e) => handlePreferredSkillChange(skill, Math.min(10, Math.max(0, parseInt(e.target.value) || 0)))}
                          className="border border-gray-300 rounded px-3 py-1 w-20 text-center"
                        />
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="h-64">
                  {Object.values(preferredSkillInputs).some(value => value > 0) ? (
                    <Pie data={preferredSkillsChartData} options={chartOptions} />
                  ) : (
                    <div className="flex h-full items-center justify-center text-gray-500">
                      Add ratings to see the chart
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          
          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded transition"
              disabled={isSaving}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
              disabled={isSaving}
            >
              {isSaving ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </span>
              ) : "Save Skill Ratings"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobSkills;
