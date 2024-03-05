import { get, getDetails } from '@renderer/utils/client'
import { useState, useEffect } from 'react'
import { Breadcrumb } from 'react-bootstrap'

import { BarChart } from '@mui/x-charts/BarChart'
import { PieChart } from '@mui/x-charts'

interface analysisData {
  total_students: number
  total_users: number
  total_courses: number
  total_cohorts: number
  cohorts_student_count: {
    cohort_name: string
    course_name: string
    student_count: number
  }[]
}

function Dashboard(): JSX.Element {
  const [username, setUsername] = useState('')
  const [analysisData, setAnalysisData] = useState<analysisData>({
    total_students: 0,
    total_users: 0,
    total_courses: 0,
    total_cohorts: 0,
    cohorts_student_count: []
  })

  const fetchData = async (): Promise<void> => {
    try {
      const userDetails = await getDetails()
      if (userDetails) {
        setUsername(userDetails.username)
      }
      const { success, response } = await get('api/analysis')
      if (success) {
        console.log(response.data.data)
        setAnalysisData(response.data.data)
        console.log(analysisData)
      }
    } catch (err) {
      console.log('Error occurred while getting credentials:', err)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div className="p-2">
      <h5
        className="text-bold"
        style={{ fontSize: '19px', wordSpacing: '2px', textTransform: 'capitalize' }}
      >
        Welcome back, {username}!
      </h5>
      <Breadcrumb className="mt-1">
        <Breadcrumb.Item href="/" active>
          Dashboard
        </Breadcrumb.Item>
      </Breadcrumb>
      <hr />
      <div className="status-cards w-100">
        <div className="card">
          <h5 className="text-bold w-100 text-start">Students</h5>
          <b className="text-muted w-100 text-end">{analysisData.total_students}</b>
        </div>
        <div className="card">
          <h5 className="text-bold w-100 text-start">Income</h5>
          <b className="text-muted w-100 text-end">3</b>
        </div>
        <div className="card">
          <h5 className="text-bold w-100 text-start">Completed</h5>
          <b className="text-muted w-100 text-end">9</b>
        </div>
        <div className="card">
          <h5 className="text-bold w-100 text-start">Drop</h5>
          <b className="text-muted w-100 text-end">0</b>
        </div>
      </div>
      <hr />
      <div className="d-flex flex-wrap align-items-center justify-content-between">
        <BarChart
          series={[
            {
              data:
                Array.isArray(analysisData.cohorts_student_count) &&
                analysisData.cohorts_student_count.length > 1
                  ? analysisData.cohorts_student_count.map((cohort) => cohort.student_count)
                  : [0, 0, 0, 0]
            }
          ]}
          width={500}
          height={290}
          xAxis={[
            {
              data: Array.isArray(analysisData.cohorts_student_count)
                ? analysisData.cohorts_student_count.map((cohort) => cohort.course_name)
                : [null, null, null, null],
              scaleType: 'band'
            }
          ]}
          margin={{ top: 10, bottom: 30, left: 40, right: 10 }}
        />
        <PieChart
          series={[
            {
              data: Array.isArray(analysisData.cohorts_student_count)
                ? analysisData.cohorts_student_count.map((cohort, index) => ({
                    id: index,
                    value: (cohort.student_count / analysisData.total_students) * 100,
                    label: `${cohort.course_name}`
                  }))
                : []
            }
          ]}
          width={300}
          height={200}
        />
      </div>
    </div>
  )
}

export default Dashboard
