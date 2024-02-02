import { Breadcrumb } from 'react-bootstrap'

function Subjects(): JSX.Element {
  return (
    <div className="p-2">
      <h5
        className="text-bold"
        style={{ fontSize: '19px', wordSpacing: '2px', textTransform: 'capitalize' }}
      >
        Subject Management
      </h5>
      <Breadcrumb>
        <Breadcrumb.Item href="/">Dashboard</Breadcrumb.Item>
        <Breadcrumb.Item href="/subject" active>
          Subject
        </Breadcrumb.Item>
      </Breadcrumb>
    </div>
  )
}

export default Subjects
