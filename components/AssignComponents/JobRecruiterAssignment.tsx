'use client'

import React, { useState, useEffect } from 'react';
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

const JobRecruiterAssignment: React.FC<JobRecruiterAssignmentProps> = ({ onClose, onAssignmentComplete }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [recruiters, setRecruiters] = useState<Recruiter[]>([]);
  const [selectedJob, setSelectedJob] = useState<number | null>(null);
  const [selectedRecruiter, setSelectedRecruiter] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [currentAssignments, setCurrentAssignments] = useState<Assignment[]>([]);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);

  const API_BASE_URL = "http://localhost:8000";

  // Fetch jobs from the API
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

  // Fetch recruiters from the API
  const fetchRecruiters = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/recruiters`);
      setRecruiters(response.data);
    } catch (error) {
      console.error("Error fetching recruiters:", error);
      setError('Failed to load recruiters');
    }
  };

  // Fetch current assignments
  const fetchAssignments = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/job-recruiter-assignments`);
      setCurrentAssignments(response.data);
    } catch (error) {
      console.error("Error fetching assignments:", error);
      setError('Failed to load current assignments');
    }
  };

  // Load data on component mount
  useEffect(() => {
    setIsLoading(true);
    Promise.all([fetchJobs(), fetchRecruiters(), fetchAssignments()])
      .finally(() => setIsLoading(false));
  }, []);

  // Create a new assignment
  const createAssignment = async () => {
    if (!selectedJob || !selectedRecruiter) {
      setError('Please select both a job and a recruiter');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      await axios.post(`${API_BASE_URL}/api/job-recruiter-assignments`, {
        job_id: selectedJob,
        recruiter_id: selectedRecruiter
      });
      
      setSuccess('Recruiter successfully assigned to job!');
      setTimeout(() => setSuccess(''), 3000);
      
      // Reset form and refresh assignments
      setSelectedJob(null);
      setSelectedRecruiter(null);
      fetchAssignments();
      if (onAssignmentComplete) onAssignmentComplete();
    } catch (error) {
      console.error("Error creating assignment:", error);
      setError('Failed to create assignment');
    } finally {
      setIsLoading(false);
    }
  };

  // Update an existing assignment
  const updateAssignment = async () => {
    if (!editingAssignment || !selectedRecruiter) {
      setError('Please select a recruiter');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      await axios.put(`${API_BASE_URL}/api/job-recruiter-assignments/${editingAssignment.id}`, {
        job_id: editingAssignment.job_id,
        recruiter_id: selectedRecruiter
      });
      
      setSuccess('Assignment updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
      
      // Reset form and refresh assignments
      setEditingAssignment(null);
      setSelectedRecruiter(null);
      fetchAssignments();
      if (onAssignmentComplete) onAssignmentComplete();
    } catch (error) {
      console.error("Error updating assignment:", error);
      setError('Failed to update assignment');
    } finally {
      setIsLoading(false);
    }
  };

  // Delete an assignment
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

  return (
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {editingAssignment ? 'Edit Recruiter Assignment' : 'Assign Recruiter to Job'}
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">{error}</div>}
        {success && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg">{success}</div>}
        {isLoading && <div className="mb-4 p-3 text-center">Loading...</div>}
        
        <div className="mb-6">
          {editingAssignment ? (
            <div className="mb-4">
              <p className="text-gray-700 font-medium mb-2">Editing assignment for:</p>
              <div className="p-3 bg-blue-50 rounded-lg mb-4">
                <p className="font-semibold">{editingAssignment.job_title}</p>
                <p className="text-sm text-gray-600">Currently assigned to: {editingAssignment.recruiter_name}</p>
              </div>
            </div>
          ) : (
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2" htmlFor="jobSelect">
                Select Job
              </label>
              <select
                id="jobSelect"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedJob || ''}
                onChange={(e) => setSelectedJob(Number(e.target.value))}
              >
                <option value="">-- Select a Job --</option>
                {jobs.map((job) => (
                  <option key={job.id} value={job.id}>
                    {job.title} - {job.company}
                  </option>
                ))}
              </select>
            </div>
          )}
          
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="recruiterSelect">
              {editingAssignment ? 'Reassign to Recruiter' : 'Select Recruiter'}
            </label>
            <select
              id="recruiterSelect"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedRecruiter || ''}
              onChange={(e) => setSelectedRecruiter(Number(e.target.value))}
            >
              <option value="">-- Select a Recruiter --</option>
              {recruiters.map((recruiter) => (
                <option key={recruiter.id} value={recruiter.id}>
                  {recruiter.name} - {recruiter.email}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex justify-end gap-3">
            {editingAssignment ? (
              <>
                <button 
                  onClick={handleCancelEdit}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button 
                  onClick={updateAssignment}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  disabled={isLoading || !selectedRecruiter}
                >
                  Update Assignment
                </button>
              </>
            ) : (
              <button 
                onClick={createAssignment}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                disabled={isLoading || !selectedJob || !selectedRecruiter}
              >
                Assign Recruiter
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobRecruiterAssignment;