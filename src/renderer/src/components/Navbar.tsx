import { NavLink } from 'react-router-dom'
import Dropdown from 'react-bootstrap/Dropdown'
import { VscSettings } from 'react-icons/vsc'
function Navbar(): JSX.Element {
  return (
    <nav className="navbar navbar-dark navbar-expand-lg">
      <div className="container-fluid mb-2 d-flex justify-content-between align-items-center">
        <NavLink to={`/`} className={'text-decoration-none text-dark nav-brand'}>
          InkLearn-Hub
        </NavLink>
        <Dropdown>
          <Dropdown.Toggle variant="none" id="setting-dropdown" className="outline-none">
            <VscSettings />
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item>
              <NavLink to={`/profile`} className={'text-decoration-none text-dark w-100'}>
                <span className="w-100 h-100">Profile</span>
              </NavLink>
            </Dropdown.Item>
            <Dropdown.Item href="#/settings">Settings</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item href="#/help">Help</Dropdown.Item>
            <Dropdown.Item href="#/donate">Donate us</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </nav>
  )
}

export default Navbar
