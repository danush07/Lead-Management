import axios from 'axios';

const USERS_API_URL = 'http://localhost:5000/api/users/createUser';

const createUser = async (newUser, token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await axios.post(USERS_API_URL, newUser, config);
    console.log('response from new service ',response.data);
    return response.data;
  } catch (error) {
    console.error('Axios request error:', error);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
      console.error('Response headers:', error.response.headers);
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error setting up the request:', error.message);
    }
    throw error;
  }
};

const GET_USERS_API_URL = 'http://localhost:5000/api/users/newUsers'

const getUsers = async (token) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
  
      const response = await axios.get(GET_USERS_API_URL, config);
      return response.data;
    } catch (error) {
      console.error('Axios request error:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
      } else if (error.request) {
        console.error('No response received:', error.request);
      } else {
        console.error('Error setting up the request:', error.message);
      }
      throw error;
    }
  };
const DELETE_USERS_API = 'http://localhost:5000/api/users/'

const deleteUsers = async (userId,token) =>{
  try{
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    await axios.delete(`${DELETE_USERS_API}${userId}`,config)
  } catch (error) {
    console.error('Axios request error:', error);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
      console.error('Response headers:', error.response.headers);
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error setting up the request:', error.message);
    }
    throw error;
  }
}

const UPDATE_USER_API_URL = 'http://localhost:5000/api/users/'
const updateSingleUser = async (userId, updatedUserData, token) => {
  try {
    if (!userId) {
      throw new Error('Missing userId');
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await axios.put(`${UPDATE_USER_API_URL}${userId}`, updatedUserData, config);
    console.log('Response from update service:', response.data);
    return response.data;
  } catch (error) {
    console.error('Axios request error:', error);
    throw error;
  }
};


const userService = {
  createUser,
  getUsers,
  deleteUsers,
  updateSingleUser
};

export default userService;
