import React from 'react'
import { useState } from 'react';
import { FaSun, FaMoon, FaGlobe, FaUserCircle, FaBars, FaHome, FaStore, FaDesktop, FaCashRegister, FaList } from 'react-icons/fa';
import logo from '../assets/logo.png'
import { Dropdown, Menu, Button } from 'antd';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faExpand,  faGlobe, faUtensils,faUser } from '@fortawesome/free-solid-svg-icons';

const Navbar = () => {
    const [darkMode, setDarkMode] = useState(false);
    const [fullscreen, setFullscreen] = useState(false);

    // const handleFullscreen = () => {
    //     if (!fullscreen) {
    //       document.documentElement.requestFullscreen();
    //     } else {
    //       document.exitFullscreen();
    //     }
    //     setFullscreen(!fullscreen);
    //   };
    //   const languageMenu = (
    //     <Menu>
    //       <Menu.Item key="english">English</Menu.Item>
    //       <Menu.Item key="spanish">Spanish</Menu.Item>
    //       <Menu.Item key="french">French</Menu.Item>
    //     </Menu>
    //   );
    //   const accountMenu = (
    //     <Menu>
    //       <Menu.Item key="profile">Profile</Menu.Item>
    //       <Menu.Item key="setting">Settings</Menu.Item>
    //       <Menu.Item key="logouts">Logout</Menu.Item>
    //     </Menu>
    //   );
    
    // const toggleDarkMode = () => {
    //     setDarkMode(!darkMode);
    //     document.documentElement.classList.toggle('dark');
    // };

    return (
    <>
          {/* <nav className="flex items-center justify-between p-4 bg-gray-100 dark:bg-gray-800"> */}
             {/* Left Section: Logo and Company Name */}
           {/* <div className="flex items-center">
               <img src={logo} alt="Logo" className="h-12 mr-3" />
        //         <span className="text-lg font-semibold text-gray-900 dark:text-white">ARRC TECH</span>
        //     </div> */}

            {/* Middle Section: Navigation Items */}
                     <nav className="flex items-center justify-center p-4 bg-gray-100 dark:bg-gray-800">

            <ul className="hidden md:flex space-x-6 text-gray-700 dark:text-gray-300">
                <Link className="hover:text-gray-900 dark:hover:text-white cursor-pointer" to='/admin'>
                    <FaHome /> Dashboard
                </Link>
                <Link className="hover:text-gray-900 dark:hover:text-white cursor-pointer" to='/admin/pos'>
                    <FaStore /> POS
                </Link>
                <Link className="hover:text-gray-900 dark:hover:text-white cursor-pointer" to='/admin/kitchen'>
                    <FaDesktop /> Kitchen
                </Link>
                <Link className="hover:text-gray-900 dark:hover:text-white cursor-pointer" to='/admin/cashregister'>
                    <FaCashRegister /> Register
                </Link>
                <Link className="hover:text-gray-900 dark:hover:text-white cursor-pointer" to='/admin/orderhistory'>
                    <FaList /> Order History
                </Link>
            </ul>

            {/* Right Section: Full screen, Light/Dark mode, Language, My Account */}
           
         </nav>
        </>
    );
};

export default Navbar;
