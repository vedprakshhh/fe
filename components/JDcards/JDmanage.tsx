"use client";

import { useState, useEffect } from "react";
import { Upload, Search, Bell, Settings, PlusCircle, FileText, Users, LayoutDashboard, Briefcase, List, Edit, Eye, CheckSquare } from "lucide-react";
import axios from "axios";
import JobDetailsCard from "@/components/JDcards/JDINFO";
import JobSkills from "@/components/JDcards/JobSkills";

// Define types based on your backend
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
  created_at?: string;
  role?: string;
  upload_date?: string;
}

// Simplified job interface for table display
interface JobDisplay {
  id: number;
  role: string;
  company: string;
  date: string;
  status: string;
}

export default function JDDashboard() {
  const [jobs, setJobs] = useState<JobDisplay[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const itemsPerPage: number = 5; // You can adjust this as needed
  const [showJobSkills, setShowJobSkills] = useState<boolean>(false);

  // API base URL - you might want to store this in an environment variable
  const API_BASE_URL = "http://localhost:8000";

  // Fetch job descriptions from the API
  const fetchJobs = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/job-descriptions`);
      
      // Transform API data to display format
      const jobsForDisplay = response.data.map((job: JobDescription) => ({
        id: job.id,
        role: job.title,
        company: job.company,
        date: job.date_posted || new Date(job.created_at || Date.now()).toLocaleDateString(),
        status: "Active" // You might want to add a status field to your backend
      }));
      
      setJobs(jobsForDisplay);
      setTotalRecords(jobsForDisplay.length); // Set total records count
    } catch (err) {
      console.error("Error fetching jobs:", err);
      setError("Failed to load job descriptions. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  // Add these pagination handler functions
  const handlePrevious = (): void => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  const handleNext = (): void => {
    if (currentPage * itemsPerPage < totalRecords) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Load job descriptions on component mount
  useEffect(() => {
    fetchJobs();
  }, []);

  // Handle file upload
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      
      setLoading(true);
      setError(null);
      
      try {
        // Create form data for file upload
        const formData = new FormData();
        formData.append("file", file);
        
        // Send file to the backend for analysis
        const response = await axios.post(
          `${API_BASE_URL}/api/job-descriptions/analyze`, 
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        
        // Refresh job list after successful upload
        fetchJobs();
      } catch (err) {
        console.error("Error uploading file:", err);
        setError("Failed to upload and analyze job description. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };
  
  const handleSetJobSkills = (jobId: number): void => {
    // Modify this function to not show job details
    setLoading(true);
    setError(null);
    
    axios.get(`${API_BASE_URL}/api/job-descriptions/${jobId}`)
      .then(response => {
        if (response.status === 200) {
          setSelectedJob(response.data);
          setShowJobSkills(true);
          setShowJobDetails(false); // Ensure job details remain closed
        }
      })
      .catch(err => {
        console.error('Error fetching job:', err);
        setError("Failed to load job skills. Please try again.");
      })
      .finally(() => {
        setLoading(false);
      });
  };
  
  
  // Navigate to job edit page
  const handleEditJob = (jobId: number) => {
    // In a real app, you would use Next.js router to navigate
    window.location.href = `/job/${jobId}/edit`;
  };
  const fetchJobById = async (id: number): Promise<void> => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/job-descriptions/${id}`);
      if (response.status === 200) {
        setSelectedJob(response.data);
        setShowJobDetails(true);
      }
    } catch (err) {
      console.error('Error fetching job:', err);
      setError("Failed to load job details. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  // Close job details modal
  const closeJobDetails = (): void => {
    setShowJobDetails(false);
    setSelectedJob(null);
  };
  
  // Update the handleViewJob function to use fetchJobById
  const handleViewJob = (jobId: number): void => {
    fetchJobById(jobId);
  };

  // Create a new job
  const handleCreateJob = () => {
    // In a real app, you would use Next.js router to navigate
    window.location.href = "/job/new";
  };
  const indexOfLastJob: number = currentPage * itemsPerPage;
  const indexOfFirstJob: number = indexOfLastJob - itemsPerPage;
  const currentJobs: JobDisplay[] = jobs.slice(indexOfFirstJob, indexOfLastJob);
  const [selectedJob, setSelectedJob] = useState<JobDescription | null>(null);
  const [showJobDetails, setShowJobDetails] = useState<boolean>(false);
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex">
      {/* Main Content */}
      <div className="ml-24 flex-1 p-6">
        {/* Header */}
        <header className="bg-white shadow p-4 flex items-center justify-between sticky top-0 z-50">
          <h1 className="text-2xl font-bold text-blue-700 tracking-wide">Fasthire99</h1>
          <div className="flex items-center gap-6">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search candidates, jobs..."
                className="border border-gray-300 pl-10 pr-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none w-72 text-sm"
              />
            </div>
            <Bell className="w-6 h-6 text-gray-500 cursor-pointer hover:text-blue-600 transition" />
            <Settings className="w-6 h-6 text-gray-500 cursor-pointer hover:text-blue-600 transition" />
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-purple-600 text-white flex items-center justify-center rounded-full text-sm font-semibold">HM</div>
              <span className="text-md font-medium">Hiring Manager</span>
            </div>
          </div>
        </header>

        {/* JD Dashboard */}
        <div className="bg-white p-6 rounded-lg shadow-md mt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800">JD Dashboard</h2>
            <div className="flex items-center gap-3">
              <button 
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                //@ts-ignore
                onClick={() => fetchJobById(job.id)}
              >
                <PlusCircle className="w-5 h-5 text-white" /> Create
              </button>
              {/* Upload JD Button */}
              <label className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition cursor-pointer">
                <Upload className="w-5 h-5 text-white" />
                Upload JD
                <input type="file" className="hidden" onChange={handleFileUpload} accept=".pdf,.docx,.doc" />
              </label>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-4">
              {error}
            </div>
          )}

          {/* Loading indicator */}
          {loading && (
            <div className="mt-6 text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
              <p className="mt-2 text-gray-600">Loading...</p>
            </div>
          )}

          {/* Job List */}
          <div className="mt-6">
            {!loading && jobs.length === 0 ? (
              <div className="border-t mt-4 pt-8 flex flex-col items-center justify-center h-64 text-center">
                <Upload className="w-12 h-12 text-gray-400" />
                <p className="text-gray-700 font-medium text-lg mt-2">No JDs Uploaded</p>
                <p className="text-sm text-gray-500">Click "Upload JD" to generate job details</p>
              </div>
            ) : (
              <>
                <table className="w-full mt-4 border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                  <thead className="bg-gray-100 text-gray-700">
                    <tr>
                      <th className="p-3 text-left">Check</th>
                      <th className="p-3 text-left">Role</th>
                      <th className="p-3 text-left">Company</th>
                      <th className="p-3 text-left">Job ID</th>
                      <th className="p-3 text-left">Upload Date</th>
                      <th className="p-3 text-left">Status</th>
                      <th className="p-3 text-left">View/Edit</th>
                      <th className="p-3 text-left">Threshold</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentJobs.map((job) => (
                      <tr key={job.id} className="border-t border-gray-200 hover:bg-gray-50 transition">
                        <td className="p-3"><input type="checkbox" /></td>
                        <td className="p-3 font-medium">{job.role}</td>
                        <td className="p-3 text-gray-600">{job.company}</td>
                        <td className="p-3 text-gray-600">{job.id}</td>
                        <td className="p-3 text-gray-600">{job.date}</td>
                        <td
                          className={`p-3 font-semibold ${
                            job.status === "Active" ? "text-green-600" : job.status === "Pending" ? "text-yellow-600" : "text-gray-600"
                          }`}
                        >
                          {job.status}
                        </td>
                        <td className="p-3 flex gap-2">
                          <button 
                            className="bg-gray-100 text-gray-700 px-3 py-1 rounded-lg hover:bg-gray-200 transition flex items-center gap-1"
                            onClick={() => handleViewJob(job.id)}
                          >
                            <Eye className="w-4 h-4" /> View
                          </button>
                          <button 
                            className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition flex items-center gap-1"
                            onClick={() => handleEditJob(job.id)}
                          >
                            <Edit className="w-4 h-4" /> Edit
                          </button>
                        </td>
                        <td className="p-3">
                        <button 
                          className="bg-orange-100 text-gray-700 px-3 py-1 rounded-lg hover:bg-gray-200 transition flex items-center gap-1"
                          onClick={() => handleSetJobSkills(job.id)}
                        >
                          <CheckSquare className="w-4 h-4" /> set
                        </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                {/* Pagination Controls */}
                <div className="flex justify-between items-center mt-4">
                  <div className="flex items-center justify-center w-full">
                    <button 
                      onClick={handlePrevious}
                      disabled={currentPage === 1}
                      className={`px-3 py-1 border rounded mr-2 ${currentPage === 1 ? 'bg-gray-100 text-gray-400' : 'bg-white hover:bg-gray-100'}`}
                    >
                      &lt; Previous
                    </button>
                    <span className="mx-2">Page {currentPage} of {Math.ceil(totalRecords / itemsPerPage) || 1}</span>
                    <button 
                      onClick={handleNext}
                      disabled={currentPage * itemsPerPage >= totalRecords}
                      className={`px-3 py-1 border rounded ml-2 ${currentPage * itemsPerPage >= totalRecords ? 'bg-gray-100 text-gray-400' : 'bg-white hover:bg-gray-100'}`}
                    >
                      Next &gt;
                    </button>
                  </div>
                </div>
                {/* Job Details Modal */}
                {showJobDetails && selectedJob && (
                  <JobDetailsCard job={selectedJob} onClose={closeJobDetails} />
                )}
                {showJobSkills && selectedJob && (
                  <JobSkills job={selectedJob} onClose={() => setShowJobSkills(false)} />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}