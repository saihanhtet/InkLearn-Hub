import Table from 'react-bootstrap/Table'
import { FaEdit, FaTrashAlt } from 'react-icons/fa'

interface CourseData {
  id: number
  course_name: string
}
interface SubjectData {
  id: number
  subject_name: string
  book_name: string
  price: number
  course: number
  course_name: string
}

interface TableProps<T> {
  data: T[]
  onEdit: (id: number) => void
  onDelete: (id: number) => void
}

export const CourseTable = <T extends CourseData>({
  data,
  onEdit,
  onDelete
}: TableProps<T>): JSX.Element => {
  const headers = [
    { key: 'id', label: 'ID' },
    { key: 'course_name', label: 'Course Name' }
  ]

  return (
    <Table striped>
      <thead
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 1
        }}
      >
        <tr>
          {headers.map((row) => (
            <th key={row.key}>{row.label}</th>
          ))}
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr key={item.id}>
            {Object.keys(item).map((key) => (
              <td key={key}>{item[key]}</td>
            ))}
            <td>
              <FaEdit
                size={20}
                onClick={() => onEdit(item.id)}
                name="edit"
                style={{ cursor: 'pointer', marginRight: 20 }}
              />
              <FaTrashAlt
                size={20}
                onClick={() => onDelete(item.id)}
                name="delete"
                style={{ cursor: 'pointer' }}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  )
}

export const SubjectTable = <T extends SubjectData>({
  data,
  onEdit,
  onDelete
}: TableProps<T>): JSX.Element => {
  const headers = [
    { key: 'id', label: 'ID' },
    { key: 'subject_name', label: 'Subject Name' },
    { key: 'book_name', label: 'Book Name' },
    { key: 'price', label: 'Price' },
    { key: 'course', label: 'Course' }
  ]

  return (
    <Table striped>
      <thead
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 1
        }}
      >
        <tr>
          {headers.map((row) => (
            <th key={row.key}>{row.label}</th>
          ))}
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr key={item.id}>
            {Object.keys(item).map((key) => (
              <td key={key}>{item[key]}</td>
            ))}
            <td>
              <FaEdit
                size={20}
                onClick={() => onEdit(item.id)}
                name="edit"
                style={{ cursor: 'pointer', marginRight: 20 }}
              />
              <FaTrashAlt
                size={20}
                onClick={() => onDelete(item.id)}
                name="delete"
                style={{ cursor: 'pointer' }}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  )
}
