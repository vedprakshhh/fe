import React from 'react'
import JDmanage from '@/components/JDcards/JDmanage'
import JobManagementDashboard from '@/components/AssignComponents/JobManagementDashboard'
import Test from '@/components/FeedBack/add'

const page = () => {
  return (
    <div>
      <JDmanage />
      <JobManagementDashboard />
      <Test />
    </div>
  )
}

export default page