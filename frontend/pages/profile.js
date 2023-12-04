import React from 'react';
import * as cookie from 'cookie';
import axios from 'axios';
import Link from 'next/link';
import Header from '@/components/Header';

function Profile({ users }) {
  return (
    <>
    <Header/>
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full p-6 bg-white rounded shadow">
        <div className="text-2xl font-semibold mb-4 text-center">Profile</div>
        <div className="mb-2">
          <span className="font-semibold">Logged in as:</span> {users.name}
        </div>
        <div className="mb-2">
          <span className="font-semibold">Email Id:</span> {users.email}
        </div>
        <div className="mb-2">
          <span className="font-semibold">Employee Id:</span> {users.empId}
        </div>
        <div className="mb-2">
          <span className="font-semibold">Location:</span> {users.location}
        </div>
        <div>
          <span className="font-semibold">Phone Number:</span> {users.phone}
        </div>
      <Link href='/' className='flex mt-12 items-center justify-center'>
      <button className='bg-blue-500 px-2 rounded text-white font-semibold py-2.5'>Back to Home Page</button>
      </Link>
      </div>
    </div>
    </>
  );
}

export default Profile;

export async function getServerSideProps(context) {
  const { req } = context;
  const cookies = cookie.parse(req.headers.cookie);
  const user = JSON.parse(cookies.user);
  const token = user.token;

  try {
    const response = await axios.get('http://localhost:5000/api/users/me', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const users = response.data;

    return { props: { users } };
  } catch (error) {
    console.error('Error fetching user data:', error);
    return { props: { users: '' } }; 
  }
}
