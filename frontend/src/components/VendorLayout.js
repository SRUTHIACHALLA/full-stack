import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const VendorLayout = () => {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default VendorLayout;
