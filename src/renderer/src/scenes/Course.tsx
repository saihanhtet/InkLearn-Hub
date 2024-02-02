import { get, getDetails, post } from '@renderer/client'
import { useState, useEffect, FormEvent } from 'react'
import { Breadcrumb } from 'react-bootstrap'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'

function Course(): JSX.Element {
  const [coursesData, setCoursesData] = useState([])
  const [courseName, setCourseName] = useState('')
  const [coursePrice, setCoursePrice] = useState('')
  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)
  const [isAdmin, setIsAdmin] = useState(false)

  const fetchData = async () => {
    try {
      const userDetails = await getDetails()
      if (userDetails) {
        setIsAdmin(userDetails.is_superuser)
      }
      const { success, response } = await get('/api/course')
      if (success) {
        setCoursesData(response.data.courses)
        const currentHash = window.location.hash
        console.log(currentHash)
      }
    } catch (err) {
      console.log('Error occurred while getting credentials:', err)
    }
  }
  useEffect(() => {
    fetchData()
  }, [])

  async function handleAdd(e: FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault()
    if (courseName === '') {
      console.log('need course details')
    }
    try {
      const { success } = await post('/api/course', {
        course_name: courseName,
        price: coursePrice
      })
      if (success) {
        setShow(false)
        setCourseName('')
        fetchData()
      }
    } catch (err) {
      console.log('Error occurred while adding course:', err)
    }
  }

  return (
    <div className="p-2">
      <div className="d-flex gap-3 p-0 m-0">
        <div className="w-100">
          <h5
            className="text-bold"
            style={{ fontSize: '19px', wordSpacing: '2px', textTransform: 'capitalize' }}
          >
            Course Management
          </h5>
          <Breadcrumb>
            <Breadcrumb.Item href="/" active>
              Course
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <div className="d-flex justify-content-center align-items-center gap-2">
          {isAdmin ? (
            <>
              <button type="button" className="btn btn-sm btn-primary" onClick={handleShow}>
                Add
              </button>
              <button type="button" className="btn btn-sm btn-secondary">
                View
              </button>
            </>
          ) : (
            <></>
          )}
        </div>
      </div>
      <hr />

      <div className="status-cards w-100">
        {coursesData.length === 0 ? (
          <b className="text-muted">No courses available.</b>
        ) : (
          <div className="status-cards w-100 border-0">
            {coursesData.map((course, index) => (
              <div
                className="card d-flex justify-content-center align-items-center"
                key={index}
                style={{ height: '60px', margin: '0', padding: '0' }}
              >
                <h5 className="text-bold text-start">{course.course_name}</h5>
              </div>
            ))}
          </div>
        )}
      </div>
      <hr />

      <Modal show={show} onHide={handleClose}>
        <Form onSubmit={(e) => handleAdd(e)}>
          <Modal.Header closeButton>
            <Modal.Title>Course Add Form</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3" controlId="formBasicCourse">
              <Form.Label className="text-bold">Course Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter course name"
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
              />
              <Form.Text className="text-muted">
                The course name should be at least 3 characters.
              </Form.Text>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicCoursePrice">
              <Form.Label className="text-bold">Course Price</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter course price"
                value={coursePrice}
                onChange={(e) => setCoursePrice(e.target.value)}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" type="submit">
              Save
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  )
}

export default Course
