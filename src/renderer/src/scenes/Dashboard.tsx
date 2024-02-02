import { getDetails } from '@renderer/client'
import { useState, useEffect } from 'react'
import { Breadcrumb } from 'react-bootstrap'

function Dashboard(): JSX.Element {
  const [username, setUsername] = useState('')
  useEffect(() => {
    const fetchData = async () => {
      const userDetails = await getDetails()
      if (userDetails) {
        setUsername(userDetails.username)
      }
    }
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
          <b className="text-muted w-100 text-end">5</b>
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
    </div>
  )
}

export default Dashboard
