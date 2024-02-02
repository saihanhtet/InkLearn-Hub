import { NavLink } from 'react-router-dom'
import { FaTachometerAlt, FaBook, FaUsers } from 'react-icons/fa'
import { SiCoursera } from 'react-icons/si'
import { IoMdLogOut } from 'react-icons/io'
function Sidebar(): JSX.Element {
  return (
    <div className="card shadow-sm bg-transparent sidebar-container d-flex flex-column justify-content-between d-none d-md-flex d-lg-flex d-xl-flex">
      <ul className="list-unstyled sidebar-list">
        <li>
          <NavLink
            to="/"
            end
            className={({ isActive, isPending }) =>
              isPending ? 'pending' : isActive ? 'active' : ''
            }
          >
            <FaTachometerAlt size={20} />
            <span>Dashboard</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/subjects"
            className={({ isActive, isPending }) =>
              isPending ? 'pending' : isActive ? 'active' : ''
            }
          >
            <FaBook size={20} />
            <span>Subjects</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/students"
            className={({ isActive, isPending }) =>
              isPending ? 'pending' : isActive ? 'active' : ''
            }
          >
            <FaUsers size={20} />
            <span>Students</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/course"
            className={({ isActive, isPending }) =>
              isPending ? 'pending' : isActive ? 'active' : ''
            }
          >
            <SiCoursera size={20} />
            <span>Courses</span>
          </NavLink>
        </li>
      </ul>
      <ul className="list-unstyled sidebar-list">
        <li>
          <NavLink
            to="/logout"
            className={({ isActive, isPending }) =>
              isPending ? 'pending' : isActive ? 'active' : ''
            }
          >
            <IoMdLogOut size={20} />
            <span>Logout</span>
          </NavLink>
        </li>
      </ul>
    </div>
  )
}

export default Sidebar
