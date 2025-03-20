import React from 'react'
import JDmanage from '@/components/JDcards/JDmanage'
import RecruiterApp from '@/components/AssignComponents/Recrutiers'
import JobManagementDashboard from '@/components/AssignComponents/JobManagementDashboard'
const page = () => {
  return (
    <div>
      <JDmanage />
      <JobManagementDashboard />
    </div>
  )
}

export default page