import { useContext, useState } from "react";
import { Outlet, useNavigate, Link } from "react-router-dom";
import React from "react";
import logo from "../assets/logo.png";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";

import { FaSun, FaMoon } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faExpand,
  faGlobe,
  faCartShopping,
  faUtensils,
  faAngleRight,
} from "@fortawesome/free-solid-svg-icons";
import { Dropdown, Menu, Button } from "antd";
import { Layout, theme } from "antd";
import { DarkModeContext } from "./DarkModeContext.jsx";
const { Header, Sider, Content } = Layout;
import {
  faTachometerAlt,
  faCreditCard,
  faBox,
  faTable,
  faCarrot,
  faCalculator,
  faUser,
  faUsers,
  faFileLines,
  faBriefcase,
  faScrewdriverWrench,
  faGear,
  faUserCircle,
} from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/actions/user.js";

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [settings, setSettings] = useState({
    logo: "",
    favicon: "",
    appName: "",
  });
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const navigate = useNavigate();
  const [fullscreen, setFullscreen] = useState(false);

  const { user } = useSelector((state) => state.user);
  console.log(user);

  const { darkMode, toggleDarkMode } = useContext(DarkModeContext);

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  const handleFullscreen = () => {
    if (!fullscreen) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
    setFullscreen(!fullscreen);
  };

  const dispatch = useDispatch();
  const logoutHandler = () => {
    dispatch(logout());
    navigate("/");
  };

  const allMenuItems = [
    {
      key: "/",
      icon: <FontAwesomeIcon icon={faBox} />,
      label: "Dashboard",
      permission: "Dashboard",
    },
    {
      key: "sale",
      icon: <FontAwesomeIcon icon={faBox} />,
      label: "Sale",
      permission: "Sale",
      children: [
        {
          key: "pos",
          icon: <FontAwesomeIcon icon={faAngleRight} />,
          label: "POS",
        },
        {
          key: "kitchen",
          icon: <FontAwesomeIcon icon={faAngleRight} />,
          label: "Kitchen",
        },
        {
          key: "cashregister",
          icon: <FontAwesomeIcon icon={faAngleRight} />,
          label: "Cash Register",
        },
        {
          key: "orderhistory",
          icon: <FontAwesomeIcon icon={faAngleRight} />,
          label: "Order History",
        },
      ],
    },
    {
      key: "purchase",
      icon: <FontAwesomeIcon icon={faCreditCard} />,
      label: "Purchase",
      permission: "Purchase",
      children: [
        {
          key: "addpurchase",
          icon: <FontAwesomeIcon icon={faAngleRight} />,
          label: "Add Purchase",
        },
        {
          key: "purchasehistory",
          icon: <FontAwesomeIcon icon={faAngleRight} />,
          label: "Purchase History",
        },
      ],
    },
    {
      key: "table",
      icon: <FontAwesomeIcon icon={faTable} />,
      label: "Table",
      permission: "Table",
    },
    {
      key: "food",
      icon: <FontAwesomeIcon icon={faCarrot} />,
      label: "Food",
      permission: "Food",
      children: [
        {
          key: "addfooditem",
          icon: <FontAwesomeIcon icon={faAngleRight} />,
          label: "Add Food Item",
        },
        {
          key: "fooditems",
          icon: <FontAwesomeIcon icon={faAngleRight} />,
          label: "Food Items",
        },
        {
          key: "foodgroups",
          icon: <FontAwesomeIcon icon={faAngleRight} />,
          label: "Food Groups",
        },
        {
          key: "modifiers",
          icon: <FontAwesomeIcon icon={faAngleRight} />,
          label: "Modifiers",
        },
      ],
    },
    {
      key: "ingradients",
      icon: <FontAwesomeIcon icon={faCarrot} />,
      label: "Ingradients",
      permission: "Ingradients",
      children: [
        {
          key: "addingredient",
          icon: <FontAwesomeIcon icon={faAngleRight} />,
          label: "Add Ingradients",
        },
        {
          key: "ingredient",
          icon: <FontAwesomeIcon icon={faAngleRight} />,
          label: "Ingredient",
        },
      ],
    },
    {
      key: "accounting",
      icon: <FontAwesomeIcon icon={faCalculator} />,
      label: "Accounting",
      permission: "Accounting",
      children: [
        {
          key: "accounts",
          icon: <FontAwesomeIcon icon={faAngleRight} />,
          label: "Accounts",
        },

        // {
        //   key: "deposits",
        //   icon: <FontAwesomeIcon icon={faAngleRight} />,
        //   label: "Deposits",
        // },
        // {
        //   key: "transfers",
        //   icon: <FontAwesomeIcon icon={faAngleRight} />,
        //   label: "Transfers",
        // },

        {
          key: "expenses",
          icon: <FontAwesomeIcon icon={faAngleRight} />,
          label: "Expenses",
        },
        {
          key: "transactions",
          icon: <FontAwesomeIcon icon={faAngleRight} />,
          label: "Transactions",
        },
      ],
    },
    {
      key: "people",
      icon: <FontAwesomeIcon icon={faUsers} />,
      label: "People",
      permission: "People",
      children: [
        {
          key: "addcustomer",
          icon: <FontAwesomeIcon icon={faAngleRight} />,
          label: "Add Customer",
        },
        {
          key: "customers",
          icon: <FontAwesomeIcon icon={faAngleRight} />,
          label: "Customers",
        },
        {
          key: "addsupplier",
          icon: <FontAwesomeIcon icon={faAngleRight} />,
          label: "Add Supplier",
        },
        {
          key: "suppliers",
          icon: <FontAwesomeIcon icon={faAngleRight} />,
          label: "Suppliers",
        },
      ],
    },
    {
      key: "reports",
      icon: <FontAwesomeIcon icon={faFileLines} />,
      label: "Reports",
      permission: "Reports",
      children: [
        {
          key: "weekperiodreport",
          icon: <FontAwesomeIcon icon={faAngleRight} />,
          label: "Week Period Report",
        },
        {
          key: "salereport",
          icon: <FontAwesomeIcon icon={faAngleRight} />,
          label: "Sales Report",
        },
        {
          key: "itemsalereport",
          icon: <FontAwesomeIcon icon={faAngleRight} />,
          label: "Item Sale Report",
        },
        {
          key: "salesummaryreport",
          icon: <FontAwesomeIcon icon={faAngleRight} />,
          label: "Sale Summary Report",
        },
        // {
        //   key: "saledetailedreport",
        //   icon: <FontAwesomeIcon icon={faAngleRight} />,
        //   label: "Sale Detailed Report",
        // },
        {
          key: "purchasereport",
          icon: <FontAwesomeIcon icon={faAngleRight} />,
          label: "Purchase Report",
        },
        {
          key: "expensereport",
          icon: <FontAwesomeIcon icon={faAngleRight} />,
          label: "Expense Report",
        },
        {
          key: "stockalertreport",
          icon: <FontAwesomeIcon icon={faAngleRight} />,
          label: " Stock Alert Report",
        },
        {
          key: "customerduereport",
          icon: <FontAwesomeIcon icon={faAngleRight} />,
          label: "Customer Due Report",
        },
        {
          key: "supplierduereport",
          icon: <FontAwesomeIcon icon={faAngleRight} />,
          label: "Supplier Due Report",
        },
        {
          key: "attendancereport",
          icon: <FontAwesomeIcon icon={faAngleRight} />,
          label: "Attendance Report",
        },
      ],
    },
    {
      key: "hrm",
      icon: <FontAwesomeIcon icon={faBriefcase} />,
      label: "HRM",
      permission: "HRM",
      children: [
        {
          key: "department",
          icon: <FontAwesomeIcon icon={faAngleRight} />,
          label: "Department",
        },
        {
          key: "designation",
          icon: <FontAwesomeIcon icon={faAngleRight} />,
          label: "Designation",
        },
        {
          key: "officeshift",
          icon: <FontAwesomeIcon icon={faAngleRight} />,
          label: "Office Shift",
        },
        {
          key: "employee",
          icon: <FontAwesomeIcon icon={faAngleRight} />,
          label: "Employee",
        },
        {
          key: "payroll",
          icon: <FontAwesomeIcon icon={faAngleRight} />,
          label: "Pay Roll",
        },
        {
          key: "attendance",
          icon: <FontAwesomeIcon icon={faAngleRight} />,
          label: "Attendence",
        },
        {
          key: "leaverequest",
          icon: <FontAwesomeIcon icon={faAngleRight} />,
          label: "Leave Request",
        },
        {
          key: "holidays",
          icon: <FontAwesomeIcon icon={faAngleRight} />,
          label: "Holidays",
        },
      ],
    },
    {
      key: "users",
      icon: <FontAwesomeIcon icon={faUser} />,
      label: "Users",
      permission: "Users",
      children: [
        {
          key: "adduser",
          icon: <FontAwesomeIcon icon={faAngleRight} />,
          label: "Add User",
        },
        {
          key: "user",
          icon: <FontAwesomeIcon icon={faAngleRight} />,
          label: "User List",
        },
      ],
    },
    {
      key: "utilities",
      icon: <FontAwesomeIcon icon={faScrewdriverWrench} />,
      label: "Utilities",
      permission: "Utilities",
      children: [
        {
          key: "backup",
          icon: <FontAwesomeIcon icon={faAngleRight} />,
          label: "Back up",
        },
        {
          key: "auditlog",
          icon: <FontAwesomeIcon icon={faAngleRight} />,
          label: "Audit Log",
        },
      ],
    },
    {
      key: "settings",
      icon: <FontAwesomeIcon icon={faGear} />,
      label: "Settings",
      permission: "Settings",
      children: [
        {
          key: "general",
          icon: <FontAwesomeIcon icon={faAngleRight} />,
          label: "General",
        },
        {
          key: "system",
          icon: <FontAwesomeIcon icon={faAngleRight} />,
          label: "System",
        },
        {
          key: "company",
          icon: <FontAwesomeIcon icon={faAngleRight} />,
          label: "Company",
        },
        {
          key: "email",
          icon: <FontAwesomeIcon icon={faAngleRight} />,
          label: "Email",
        },
        // {
        //   key: "language",
        //   icon: <FontAwesomeIcon icon={faAngleRight} />,
        //   label: "Language",
        // },
        {
          key: "paymentmethods",
          icon: <FontAwesomeIcon icon={faAngleRight} />,
          label: "Payment Methods",
        },
        {
          key: "taxrates",
          icon: <FontAwesomeIcon icon={faAngleRight} />,
          label: "Tax Rates",
        },
        {
          key: "discounts",
          icon: <FontAwesomeIcon icon={faAngleRight} />,
          label: "Discounts",
        },
        {
          key: "charges",
          icon: <FontAwesomeIcon icon={faAngleRight} />,
          label: "Charges",
        },
        {
          key: "emailtemplates",
          icon: <FontAwesomeIcon icon={faAngleRight} />,
          label: "Email Templates",
        },
        // {
        //   key: "createpermission",
        //   icon: <FontAwesomeIcon icon={faAngleRight} />,
        //   label: "Theme",
        // },
      ],
    },
    {
      key: "myaccount",
      icon: <FontAwesomeIcon icon={faUserCircle} />,
      label: "My Account",
      permission: "My Account",
      children: [
        {
          key: "changepassword",
          icon: <FontAwesomeIcon icon={faAngleRight} />,
          label: "Change Password",
        },
        {
          key: "/",
          icon: <FontAwesomeIcon icon={faAngleRight} />,
          label: "Logout",
          onClick: logoutHandler,
        },
      ],
    },
  ];

  // Filter menu items based on user permissions
  const filterMenuItems = (items, permissions) =>
    items
      .filter((item) =>
        item.permission ? permissions.includes(item.permission) : true
      )
      .map((item) => ({
        ...item,
        children: item.children
          ? filterMenuItems(item.children, permissions)
          : undefined,
      }));

  const menuItems = user
    ? filterMenuItems(allMenuItems, user.permissions)
    : allMenuItems;

  const accountMenu = (
    <Menu>
      <Link to="/changepassword">Change Password</Link>
      <br />
      <button onClick={logoutHandler}>
        <Link>Logout</Link>
      </button>
    </Menu>
  );

  return (
    <Layout style={{ minHeight: "100vh" }} className={darkMode ? "dark" : ""}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        style={{
          overflow: "auto",
          height: "100vh",
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
          background: darkMode ? "#1f1f1f" : "white",
        }}
      >
        <div className="demo-logo-vertical flex justify-start items-center space-x-2 bg-white dark:bg-gray-800">
          <img src={logo} alt="logo" className="w-20" />
          <span
            className={`text-2xl w-25 mt-2 font-bold ${
              collapsed ? "hidden" : "block"
            } text-slate-800 dark:text-slate-200`}
            style={{
              background: "radial-gradient(circle, violet, blue)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            ARRC TECH
          </span>
        </div>
        <Menu
          theme={darkMode ? "dark" : "light"}
          mode="inline"
          defaultSelectedKeys={[""]}
          style={{ background: darkMode ? "#1f1f1f" : "white" }}
          onClick={({ key }) => {
            if (key === "logout") {
              // handle logout
            } else {
              navigate(key);
            }
          }}
          items={menuItems}
        />
      </Sider>

      <Layout
        className="site-layout"
        style={{ marginLeft: collapsed ? 80 : 200 }}
      >
        <Header
          className="flex flex-wrap justify-between items-center p-4"
          style={{
            padding: 0,
            background: colorBgContainer,
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={toggleCollapse}
            style={{
              fontSize: "16px",
              width: 56,
              height: 56,
            }}
          />
          <div className="flex items-center space-x-4">
            <Link
              className=" text-black dark:text-white outline-green-400 w-15 h-10 shadow-md rounded-md px-3 mx-auto mb-2 flex items-center"
              to="/admin/pos"
            >
              <FontAwesomeIcon icon={faCartShopping} className="mr-2" />
              POS
            </Link>
            <Button
              onClick={handleFullscreen}
              icon={
                fullscreen ? (
                  <FontAwesomeIcon icon={faExpand} />
                ) : (
                  <FontAwesomeIcon icon={faExpand} />
                )
              }
            />
            <button
              onClick={toggleDarkMode}
              className="text-gray-700 dark:text-gray-300"
            >
              {darkMode ? <FaSun /> : <FaMoon />}
            </button>

            <Dropdown overlay={accountMenu} placement="bottomRight">
              <Button
                icon={<FontAwesomeIcon icon={faUser} />}
                className="flex items-center"
              >
                <span className="ml-2">My Account</span>
              </Button>
            </Dropdown>
          </div>
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 26,
            minHeight: 900,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            marginLeft: "70px",
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
