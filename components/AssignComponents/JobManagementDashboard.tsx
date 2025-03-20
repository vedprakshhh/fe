'use client'

import React, { useState, useEffect } from 'react';
import RecruiterApp from './Recrutiers'; // Import the RecruiterApp component
import JobRecruiterAssignment from './JobRecruiterAssignment'; // Import the new component
import axios from 'axios';

interface Job {
    id: number;
    title: string;
    company: string;
  }
  
  interface Recruiter {
    id: number;
    name: string;
    email: string;
    phone: string;
  }
  
  interface Assignment {
    id: number;
    job_id: number;
    recruiter_id: number;
    job_title: string;
    recruiter_name: string;
    assigned_date: string;
  }
  
  interface JobRecruiterAssignmentProps {
    onClose: () => void;
    onAssignmentComplete: () => void;
  }
  

const JobManagementDashboard: React.FC = () => {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [recruiters, setRecruiters] = useState<Recruiter[]>([]);
    const [showRecruiters, setShowRecruiters] = useState(false);
    const [showAssignmentModal, setShowAssignmentModal] = useState(false);
    const [jobAssignments, setJobAssignments] = useState<Record<number, string>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [currentAssignments, setCurrentAssignments] = useState<Assignment[]>([]);
    const [selectedJob, setSelectedJob] = useState<number | null>(null);
    const [selectedRecruiter, setSelectedRecruiter] = useState<number | null>(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);
    const API_BASE_URL = "http://localhost:8000";


  // Toggle the recruiters panel visibility
  const toggleRecruitersPanel = () => {
    setShowRecruiters(!showRecruiters);
  };

  // Open/close the assignment modal
  const toggleAssignmentModal = () => {
    setShowAssignmentModal(!showAssignmentModal);
  };

  const fetchAssignments = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/job-recruiter-assignments`);
      setCurrentAssignments(response.data);
    } catch (error) {
      console.error("Error fetching assignments:", error);
      setError('Failed to load current assignments');
    }
  };
  
  const fetchJobs = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/job-descriptions`);
      setJobs(response.data.map((job: any) => ({
        id: job.id,
        title: job.title,
        company: job.company
      })));
    } catch (error) {
      console.error("Error fetching jobs:", error);
      setError('Failed to load jobs');
    }
  };
  
  // Fetch job-recruiter assignments
  const fetchJobAssignments = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/job-recruiter-assignments`);
      
      // Transform data into a map of job_id -> recruiter_name
      const assignmentsMap: Record<number, string> = {};
      response.data.forEach((assignment: Assignment) => {
        assignmentsMap[assignment.job_id] = assignment.recruiter_name;
      });
      
      setJobAssignments(assignmentsMap);
    } catch (error) {
      console.error("Error fetching job assignments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRecruiters = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/recruiters`);
      setRecruiters(response.data);
    } catch (error) {
      console.error("Error fetching recruiters:", error);
      setError('Failed to load recruiters');
    }
  };

  // Load assignments when component mounts
  useEffect(() => {
      setIsLoading(true);
      Promise.all([fetchJobs(), fetchRecruiters(), fetchAssignments()])
        .finally(() => setIsLoading(false));
    }, []);

  // Callback for when an assignment is completed
  const handleAssignmentComplete = () => {
    fetchJobAssignments();
    fetchAssignments();
  };
  
  // Start editing an assignment
  const handleEditAssignment = (assignment: Assignment) => {
    setEditingAssignment(assignment);
    setSelectedRecruiter(assignment.recruiter_id);
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingAssignment(null);
    setSelectedRecruiter(null);
  };
  
  const deleteAssignment = async (assignmentId: number) => {
    if (!window.confirm('Are you sure you want to remove this recruiter assignment?')) {
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      await axios.delete(`${API_BASE_URL}/api/job-recruiter-assignments/${assignmentId}`);
      
      setSuccess('Assignment removed successfully!');
      setTimeout(() => setSuccess(''), 3000);
      
      // Refresh assignments
      fetchAssignments();
    } catch (error) {
      console.error("Error deleting assignment:", error);
      setError('Failed to remove assignment');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="dashboard-container min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Dashboard Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Job Management Dashboard</h1>
          <p className="text-gray-600 mt-2">Assign and manage recruiters for job openings</p>
        </div>
        
        {/* Status Messages */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}
        
        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex justify-center my-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        )}

        {/* Header buttons */}
        <div className="header-actions flex gap-4 mb-8">
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md font-medium flex items-center gap-2 transition-colors"
            onClick={toggleAssignmentModal}
          >
            <span>👥</span>
            Assign New Team
          </button>

          <button
            className={`${showRecruiters ? 'bg-indigo-100 text-indigo-700' : 'bg-white text-blue-500'} border border-blue-500 px-4 py-2 rounded-md font-medium flex items-center gap-2 transition-colors`}
            onClick={toggleRecruitersPanel}
          >
            <span>👤</span>
            Manage Recruiters
          </button>
        </div>

        {/* Main Content Area */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          {/* Conditional rendering of RecruiterApp */}
          {showRecruiters && (
            <div className="mb-8 border-b pb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Recruiter Management</h2>
              <RecruiterApp />
            </div>
          )}

          {/* Current Assignments Table */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Current Assignments</h2>
            {currentAssignments.length === 0 ? (
              <div className="bg-gray-50 p-6 text-center rounded-md">
                <p className="text-gray-600">No current assignments found.</p>
                <button 
                  onClick={toggleAssignmentModal}
                  className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md font-medium transition-colors"
                >
                  Create Your First Assignment
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border border-gray-200 px-4 py-2 text-left">Job Title</th>
                      <th className="border border-gray-200 px-4 py-2 text-left">Assigned Recruiter</th>
                      <th className="border border-gray-200 px-4 py-2 text-left">Date Assigned</th>
                      <th className="border border-gray-200 px-4 py-2 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentAssignments.map((assignment) => (
                      <tr key={assignment.id} className="hover:bg-gray-50">
                        <td className="border border-gray-200 px-4 py-2">{assignment.job_title}</td>
                        <td className="border border-gray-200 px-4 py-2">{assignment.recruiter_name}</td>
                        <td className="border border-gray-200 px-4 py-2">{new Date(assignment.assigned_date).toLocaleDateString()}</td>
                        <td className="border border-gray-200 px-4 py-2">
                          <div className="flex gap-2">
                            <button 
                              onClick={() => handleEditAssignment(assignment)}
                              className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                            >
                              Edit
                            </button>
                            <button 
                              onClick={() => deleteAssignment(assignment.id)}
                              className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
                            >
                              Remove
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Conditional rendering of JobRecruiterAssignment Modal */}
      {showAssignmentModal && (
        <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <JobRecruiterAssignment 
              onClose={toggleAssignmentModal}
              onAssignmentComplete={handleAssignmentComplete}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default JobManagementDashboard;
