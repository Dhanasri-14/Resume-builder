



import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useSelector, useDispatch } from 'react-redux';
import { Loader } from 'lucide-react';
import Login from './Login';
import { login, setLoading } from '../app/features/authSlice';

const Layout = () => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      dispatch(login({ token, user: JSON.parse(userData) }));
    } else {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader className="animate-spin" size={40} />
      </div>
    );
  }

  return (
    <div>
      {user ? (
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Outlet />
        </div>
      ) : (
        <Login />
      )}
    </div>
  );
};

export default Layout;


