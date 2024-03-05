import { Breadcrumb } from 'react-bootstrap'

function Students(): JSX.Element {
  return (
    <div className="p-2">
      <h5
        className="text-bold"
        style={{ fontSize: '19px', wordSpacing: '2px', textTransform: 'capitalize' }}
      >
        Student Management
      </h5>
      <Breadcrumb>
        <Breadcrumb.Item href="/">Dashboard</Breadcrumb.Item>
        <Breadcrumb.Item href="/student" active>
          Student
        </Breadcrumb.Item>
      </Breadcrumb>
    </div>
  )
}

export default Students
