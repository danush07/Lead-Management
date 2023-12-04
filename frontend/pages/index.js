import React from 'react';
import Header from '@/components/Header';
import Link from 'next/link';
import {useSelector} from 'react-redux'

function HomePage() {
  const {user} = useSelector((state) => state.auth)

  return (
    <>
      <Header />
      <div className="h-screen flex flex-col items-center justify-center bg-gray-100">
        <h1 className="text-5xl text-center text-gray-900 font-bold">
          Welcome to Lead Management System
        </h1>
        {user ? (
          <>
          <p className='font-semibold mt-4'>
            Welcome <span className='text-blue-500'>{user.name}</span>! Click the Button to View the List of Users
          </p>

          <Link href="/dashboard" className='mt-8 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg text-center text-sm transition duration-300'>
            View Users
          </Link>
          </>
        ) : (
          <p className='font-semibold mt-4'>
            Please <Link href='/login' className='text-blue-600'>Login</Link> or <Link href='/register' className='text-blue-600'>Register</Link> to View the List of Users 
          </p>
        )}
      </div>
    </>
  );
}

export default HomePage;
