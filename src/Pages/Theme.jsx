import React from 'react';
import { Dropdown, Form, Button } from 'react-bootstrap';
import { FaSearch, FaBell, FaUser } from 'react-icons/fa';

const CreatePermission = () => {
  return (
    <div className="main-wrapper">
      <header className="header">
        <div className="header-left active">
          <a href="index.php" className="logo">
            <img src="assets/img/arrc.png" alt="" />
          </a>
          <a href="index.php" className="logo-small">
            <img src="assets/img/logo-small.png" alt="" />
          </a>
          <a id="toggle_btn" href="javascript:void(0);"></a>
        </div>

        <a id="mobile_btn" className="mobile_btn" href="#sidebar">
          <span className="bar-icon">
            <span></span>
            <span></span>
            <span></span>
          </span>
        </a>

        <ul className="nav user-menu">
          <li className="nav-item">
            <Form className="top-nav-search">
              <Form.Control type="text" placeholder="Search Here ..." />
              <Button className="btn" id="searchdiv">
                <FaSearch />
              </Button>
            </Form>
          </li>

          <li className="nav-item dropdown">
            <Dropdown>
              <Dropdown.Toggle variant="link">
                <FaBell /> <span className="badge rounded-pill">4</span>
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Header>Notifications</Dropdown.Header>
                <Dropdown.Item href="activities.html">Notification 1</Dropdown.Item>
                <Dropdown.Item href="activities.html">Notification 2</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </li>

          <li className="nav-item dropdown">
            <Dropdown>
              <Dropdown.Toggle variant="link">
                <FaUser />
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item href="profile.php">My Profile</Dropdown.Item>
                <Dropdown.Item href="generalsettings.php">Settings</Dropdown.Item>
                <Dropdown.Item href="signin.php">Logout</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </li>
        </ul>
      </header>

      <div className="sidebar" id="sidebar">
        <div className="sidebar-inner slimscroll">
          <div id="sidebar-menu" className="sidebar-menu">
            <ul>
              <li>
                <a href="index.php"><img src="assets/img/icons/dashboard.svg" alt="" /> Dashboard</a>
              </li>
              {/* Add more menu items as needed */}
            </ul>
          </div>
        </div>
      </div>

      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <div className="page-title">
              <h4>Create Permission</h4>
              <h6>Manage Create Permissions</h6>
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Role</Form.Label>
                  <Form.Control type="text" />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Role Description</Form.Label>
                  <Form.Control type="text" />
                </Form.Group>
                <Form.Check type="checkbox" id="select-all" label="Select All" />
                <div className="mb-3">
                  <h4>Users Management</h4>
                  <Form.Check type="checkbox" label="View" />
                  <Form.Check type="checkbox" label="Create" />
                  <Form.Check type="checkbox" label="Edit" />
                  <Form.Check type="checkbox" label="Delete" />
                </div>
                <Button variant="primary">Save</Button>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePermission;
