
import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import ResumeBuilder from './pages/ResumeBuilder';
import Preview from './pages/Preview';
import Layout from './pages/Layout';
import Login from './pages/Login';   // ← ADD THIS
import { useDispatch } from 'react-redux';
import api from './configs/api';
import { login, setLoading } from './app/features/authSlice';
import { Toaster } from 'react-hot-toast';

const App = () => {
  const dispatch = useDispatch();

  const getUserData = async () => {
    const token = localStorage.getItem('token');

    try {
      if (token) {
        const { data } = await api.get('/api/users/data', {
          headers: { Authorization: token },
        });

        if (data.user) {
          dispatch(login({ token, user: data.user }));
        }
      } else {
        dispatch(setLoading(false));
        return;
      }

      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setLoading(false));
      console.log(error.message);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  return (
    <>
      <Toaster />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />       {/* ← FIXED */}
        <Route path="/register" element={<Login />} />    {/* ← FIXED */}

        {/* Protected Routes */}
        <Route path="/app" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="builder/:resumeId" element={<ResumeBuilder />} />
        </Route>

        {/* Public Preview Page */}
        <Route path="/view/:resumeId" element={<Preview />} />

        {/* Fallback */}
        <Route path="*" element={<Login />} />
      </Routes>
    </>
  );
};

export default App;




