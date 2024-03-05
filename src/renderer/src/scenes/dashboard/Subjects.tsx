import { getDetails, get, post } from '@renderer/utils/client'
import { SubjectTable } from '@renderer/components/Table'
import { FormEvent, useEffect, useState } from 'react'
import { Breadcrumb, Button, Form, Modal } from 'react-bootstrap'
import { Autocomplete, TextField } from '@mui/material'

interface Subject {
  id: number
  subject_name: string
  book_name: string
  price: number
  course: number
  course_name: string
}

interface Course {
  id: number
  course_name: string
}

function Subjects(): JSX.Element {
  const [subjectData, setSubjectData] = useState<Subject[]>([])
  const [subjectName, setSubjectName] = useState<string>('')
  const [bookName, setBookName] = useState<string>('')
  const [subjPrice, setSubjPrice] = useState<number>(0)
  const [courseId, setCourseId] = useState<number>(0)
  const [searchTerm, setSearchTerm] = useState('')
  const [options, setOptions] = useState<Course[]>([])

  const [show, setShow] = useState(false)
  const handleClose = (): void => setShow(false)
  const handleShow = (): void => setShow(true)

  const [isAdmin, setIsAdmin] = useState(false)

  const fetchData = async (): Promise<void> => {
    try {
      const userDetails = await getDetails()
      if (userDetails) {
        setIsAdmin(userDetails.is_superuser)
      }
      const { success: success1, response: response1 } = await get('/api/subject')
      if (success1) {
        setSubjectData(response1.data.subjects)
      }
      const { success: success2, response: response2 } = await get('/api/course')
      if (success2) {
        setOptions(response2.data.courses)
      }
    } catch (err) {
      console.log('Error occurred while getting credentials:', err)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = parseFloat(e.target.value)
    setSubjPrice(value)
  }

  async function handleAdd(e: FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault()
    if (subjectName === '' || bookName === '' || courseId === 0) {
      console.log('need subject details')
    }
    try {
      const { success } = await post('/api/subject', {
        subject_name: subjectName,
        book_name: bookName,
        price: subjPrice,
        course: courseId
      })
      if (success) {
        setShow(false)
        setSubjectName('')
        setBookName('')
        setSubjPrice(0)
        setCourseId(0)
        fetchData()
      }
    } catch (err) {
      console.log('Error occurred while adding subject:', err)
    }
  }

  const editFunction = (id: number): void => {
    // Implement your edit functionality here
    console.log(`Editing subject with ID ${id}`)
  }

  const deleteFunction = (id: number): void => {
    // Implement your delete functionality here
    console.log(`Deleting subject with ID ${id}`)
  }

  return (
    <div className="p-2">
      <div className="d-flex gap-3 p-0 m-0">
        <div className="w-100">
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
      <div className="scrollable-widget height-fixed">
        <SubjectTable data={subjectData} onEdit={editFunction} onDelete={deleteFunction} />
      </div>

      <Modal show={show} onHide={handleClose}>
        <Form onSubmit={(e) => handleAdd(e)}>
          <Modal.Header closeButton>
            <Modal.Title>Subject Add Form</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3" controlId="formBasicSubject">
              <Form.Label className="text-bold">Subject Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter subject name"
                value={subjectName}
                onChange={(e) => setSubjectName(e.target.value)}
              />
              <Form.Text className="text-muted">
                The subject name should be at least 3 characters.
              </Form.Text>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicCoursePrice">
              <Form.Label className="text-bold">Subject Price</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter subject price"
                value={subjPrice}
                onChange={handlePriceChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicSubject">
              <Form.Label className="text-bold">Book Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter book title"
                value={bookName}
                onChange={(e) => setBookName(e.target.value)}
              />
            </Form.Group>
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={options}
              sx={{ width: '100%' }}
              value={options.find((course) => course.id === courseId) || null}
              onChange={(event: any, newValue: Course | null) => {
                if (newValue) {
                  setCourseId(newValue.id)
                }
              }}
              renderInput={(params) => <TextField {...params} label="Courses" />}
              getOptionLabel={(course: Course) => course.course_name}
            />
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

export default Subjects
