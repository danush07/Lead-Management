import React, { useState } from 'react';
import Header from '@/components/Header';
import { toast } from 'react-toastify';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createUser,getUsers,deleteUsers } from '../features/createUser/newSlice';
import { reset } from '@/features/createUser/newSlice';
import axios from 'axios';
import moment from "moment";
import { useRouter } from 'next/navigation';
import { logout } from '@/features/auth/authSlice'

export default function Dashboard() {
  const router = useRouter()
  const dispatch = useDispatch();
  const [searchInput, setsearchInput] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [bname, setBName] = useState('');
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [source, setSource] = useState('');
  const [products, setProducts] = useState('');
  const [selectedUserType, setSelectedUserType] = useState(''); 
  const [selectedProduct, setSelectedProduct] = useState(''); 
  const [selectedSource, setSelectedSource] = useState('');
  const [bnameError, setBNameError] = useState('');
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [typeError, setTypeError] = useState('');
  const [productError, setproductError] = useState('');
  const [sourceError, setsourceError] = useState('');
  const users = useSelector((state) => state.users.users);
  const user = useSelector((state)=>state.auth.user)
  const LoggedIn = useSelector((state)=>state.auth.user)
  const {isError,message,userCreate} = useSelector((state) => state.users)
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editedUser, setEditedUser] = useState(null);


  useEffect(() => {
  if(!user){
  router.push('/')
    } else if (message === 'Not Authorized') {
  dispatch(logout()).then(()=>{router.push('/')}
  )}else{
      dispatch(getUsers(user.token))}
  },[dispatch,isError, message,user]
  );

  useEffect(()=>{
  if(isError){
    toast.error(message)
  }

  if(userCreate){
    toast.success('Created Successfully')
    closeModal()
   
  }
    dispatch(reset())
  }, [isError,message,dispatch,userCreate]
  ) 
 
  const validateEmail = (value) => {
      const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if(!value){
        setEmailError('Email is Required')
    }
    else if (!emailPattern.test(value)) {
      setEmailError('Please enter a valid email address.');
    } else {
      setEmailError('');
    }
  };
  const validatePhone = (value) => {
    if(!value){
        setPhoneError('Phone Number is Required')
    }
    else if (!/^[6-9]\d{9}$/.test(value)) {
      setPhoneError('Please enter a valid Phone number');
    }
    else {
      // phonecheck(phone)
      setPhoneError('');
    }
  };
  const validateBName = (value) => {
    if (!value) {
      setBNameError('Business name is required');
    }   else {
      setBNameError('');
    }
  };
  const validateName = (value) => {
    if (!value) {
      setNameError('Name is required');
    } else if (/\d/.test(value)) {
      setNameError('Name must not contain numbers');
    } else if (!/^[a-zA-Z ]{3,20}$/.test(value.trim())) {
      setNameError('Name should be atleast 3-20 characters & Should Not Contain Symbols');
    } else {
      setNameError('');
    }
  };
  const validateType = (value) => {
    if (!value) {
      setTypeError('Please select the User type');
     } else {
      setTypeError('');
    }
  };
  const validateSource = (value) => {
    if (!value) {
      setsourceError('Please select the Source');
     } else {
      setsourceError('');
    }
  };
  const validateProduct = (value) => {
    if (!value) {
      setproductError('Please select a Product');
     } else {
      setproductError('');
    }
  };
  const openModal = () => {
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
    setBName('')
    setName('')
    setEmail('')
    setPhone('')
    setProducts('')
    setSource('')
    setType('')
    setBNameError('')
    setNameError('')
    setEmailError('')
    setPhoneError('')
    setproductError('')
    setsourceError('')
    setTypeError('')
  };
  const openEditModal = (userid,bname,username,usertype,userphone,useremail,usersource,userproducts) => {
    // console.log('open model',userid,username,usertype,userphone,useremail,usersource,userproducts)
    setEditModalVisible(true);
    setEditedUser(userid);
    setBName(bname)
    setName(username)
    setType(usertype)
    setPhone(userphone)
    setEmail(useremail)
    setProducts(userproducts)
    setSource(usersource)
  };
  // console.log('after setting the user id',editedUser)
  const closeEditModal = () => {
    setEditedUser(null);
    setEditModalVisible(false);
    setBName('')
    setName('')
    setEmail('')
    setPhone('')
    setProducts('')
    setSource('')
    setType('')
    setBNameError('')
    setNameError('')
    setEmailError('')
    setPhoneError('')
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    validateBName(bname)
    validateName(name);
    validateEmail(email);
    validatePhone(phone);
    validateProduct(products);
    validateType(type);
    validateSource(source);
    if (!bname || !name || !email || !phone || !source || !products || !type) {
      toast.error('Please fill all the fields');
      return;
    }
    if (!bnameError && !nameError && !emailError && !phoneError && !typeError && !productError && !sourceError) {
      
      const newUser = {
        bname,
        name,
        email,
        type,
        products,
        phone,
        source,
      };
      try{
          await dispatch(createUser(newUser, user.token))
          await dispatch(getUsers( user.token))
      }catch(e){
        console.log(e)
      }

    } 
  }
  const handleUserUpdate = async (e) => {
    e.preventDefault();
  
    if (!bnameError &&!nameError && !emailError && !phoneError) {
      if(bname || name || email || source || phone || type || products ){
        const updatedUser = {
          _id: editedUser,
          bname,
          name,
          email,
          type,
          products,
          phone,
          source,
        };
    
        try {
          await axios.put(`http://localhost:5000/api/users/${editedUser}`, updatedUser, {
            headers: {
              'Authorization': `Bearer ${user.token}`,
            },
          });
          toast.success('User data updated successfully');
          
         
          closeEditModal();
          dispatch(getUsers(user.token));
    
        } catch (error) {
          // console.log(error);
          toast.error(error.response.data.message);
        }
      }
      else{
        toast.error('Please Update Atleast one Field to Update')
      }
      }
      
  };

  let filteredUsers = users && users.length > 0 ? users.filter((user) => {
// console.log(user)
      if (user.bname.toLowerCase().includes(searchInput.toLowerCase())
         || user.name.toLowerCase().includes(searchInput.toLowerCase())
         || user.phone.includes(searchInput) 
         || user.email.toLowerCase().includes(searchInput.toLowerCase()) 
         || searchInput =='')
       {
        if (selectedUserType != '' && user.type != selectedUserType) 
        {
          return false;
        }
        if (selectedProduct != ''&& user.products != selectedProduct) {
          return false;
        }
        if (selectedSource != '' && user.source != selectedSource) {
          return false;
        }
      
        return true;
      }
    })
  : [];

//  const handleSort = () => {
//   filteredUsers.sort((a, b) => a.bname.localeCompare(b.bname)).reverse()
//
//  };
//  handleSort()
//


return (
    <>
 {LoggedIn && (
    <>
    <Header />
    <div className="h-screen scroll-smooth items-center">
      <form className="flex ml-10 mt-12 justify-around items-center ">
          <div>
            <div className="flex  items-center">
        <div class="relative">
        <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg class="w-4 h-4 text-gray-500 mt-1 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
            </svg>
        </div>
        <input  
        value={searchInput}
        autoComplete='off'
        onChange={(e) => setsearchInput(e.target.value)} 
        type="search"
        id="default-search" 
        className="block p-3 mt-1 pl-10 text-sm text-gray-900 border border-gray-300 w-60 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500  dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
        placeholder="Search Business Name..." />
       
    </div>
    <div className='ml-2 flex text-center mb-6 gap-4'>
      <div>
          <div htmlFor="userType" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
           User Type
         </div>
         <select
           name="userType"
           id="userType"
           value={selectedUserType}
           onChange={(e) => setSelectedUserType(e.target.value)}
           className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white">
           <option value="">All</option>
           <option value="Lead">Lead</option>
           <option value="Prospect">Prospect</option>
           <option value="Client">Client</option>
           <option value="On Hold">On Hold</option>
         </select>
      </div>
      <div>
         <div htmlFor="products" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
           Products
         </div>
         <select
           name="products"
           id="products"
           value={selectedProduct}
           onChange={(e) => setSelectedProduct(e.target.value)}
           className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white">
           <option value="">All</option>
           <option value="Taxbandits">Taxbandits</option>
           <option value="Taxbandits API">Taxbandits API</option>
           <option value="Tax 990">Tax 990</option>
           <option value="Express Extension">Express Extension</option>
           <option value="Express 1099">Express 1099</option>
        </select>
        </div>
        <div>
          <div htmlFor="source" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Source
          </div>
          <select
            name="source"
            id="source"
            value={selectedSource}
            onChange={(e) => setSelectedSource(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white">
            <option value="">All</option>
            <option value="Website">Website</option>
            <option value="Direct">Direct</option>
            <option value="Advertisement">Advertisement</option>
            <option value="Social Media">Social Media</option>
            <option value="Others">Others</option>
          </select>
          </div>
          </div>
            <button
              onClick={openModal}
              className="block text-white ml-12 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover-bg-blue-700 dark:focus-ring-blue-800"
              type="button">
              Add User
            </button>
            </div>
          </div>
            {/*<div className='flex'>
              <p className=' text-blue-500 font-medium'>
                Total no of users : {filteredUsers.length}
              </p>
            </div>*/}
        </form>
  
    <table className="w-full  table-fixed items-center mt-2 border border-black ">
          <thead className='border  border-black '>
            
            <tr className='bg-blue-500 text-white'>
           
              <th className="px-6 py-3 text-left text-xs font-medium  uppercase  border border-black">
              Business name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium  uppercase  border border-black">
                Contact name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase  border border-black">
                User Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium  uppercase  border border-black">
                Phone Number
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium  uppercase  border border-black">
              Contact Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium  uppercase  border border-black">
                Source
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium  uppercase  border border-black">
                Products
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium  uppercase  border border-black">
               Created At
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium  uppercase  border border-black">
               Last Updated
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium  uppercase  border border-black'>
                Options
              </th>
            </tr>
          </thead>
          <tbody className='text-sm '>
          {(filteredUsers) && filteredUsers.length > 0 ? ((filteredUsers).reverse().map((user,index) => (
            <tr key={index} className='hover:bg-gray-100 odd:bg-white even:bg-slate-100 transition duration-300  ease-in-out'>
    {/*{console.log(user)}*/}
          <td className="px-6 py-4 break-words border border-black">
            {user.bname}
          </td>
          <td className="px-6 py-4 break-words border border-black">
            {user.name}
          </td>
          <td className="px-6 py-4 break-words  border border-black">
            {user.type}
          </td>
          <td className="px-6 py-4  break-words border border-black">
            {user.phone}
          </td>
          <td className="px-6 py-4 break-words  border  border-black">
            {user.email}
          </td>
          <td className="px-6 py-4 break-words  border border-black">
            {user.source}
          </td>
          <td className="px-6 py-4 break-words  border border-black">
            {user.products}
          </td>
          <td className="px-6 py-4 break-words  border border-black">
            {moment(user.createdAt).format('lll')} 
           
          </td>
          <td className="px-6 py-4 break-words  border border-black">
            {moment(user.updatedAt).format('lll')}
          
          </td>
          <td className='px-4 py-6 flex  gap-2'>
            <button  onClick={()=>openEditModal(user._id,user.bname,user.name,user.type,user.phone,user.email,user.source,user.products)} className=' bg-blue-500 text-white font-medium px-2 py-2 rounded'>Edit</button>
            <button  onClick={() => handleDelete(user._id)}  className='bg-red-500 text-white  font-medium  py-1 px-1.5 rounded'>Delete</button>
          </td>
        </tr>))
         ) : (
         <tr>
        <td colSpan="10" className="px-6 py-4  border font-medium text-red-500 border-black">
          No users found , try changing the filters
        </td>
      </tr>
    )}
    </tbody>
    </table>

    </div>
    </>
    )}
    {showModal && 
        <div id="modal"  className="fixed top-0 right-0 z-50 w-full h-full p-4 overflow-x-hidden overflow-y-auto md:inset-0">
         
          <div className="flex justify-end items-center h-full">
         
            <div className="w-full max-w-md">
              <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                <button
                  type="button"
                  onClick={closeModal}
                  className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover-bg-gray-600 dark:hover-text-white"
                >
                  <svg
                    className="w-3 h-3"
                    aria-hidden="true"
                    fill="none"
                    viewBox="0 0 14 14"
                  >
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
                <div className="px-6 py-6 lg:px-8">
                <h3 className="mb-4 text-xl font-medium text-gray-900 dark:text-white">Add User</h3>
                <span className=' text-xs  font-normal text-gray-700 absolute ml-60'><span className='text-red-500 '>*</span> Marked Fields Are Mandatory</span>
                <form className="space-y-6">
               
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <div
                    htmlFor="Business name"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                   Business name<span className="text-red-600 p-2">*</span>
                  </div>
                  <input
                    type="text"
                    id="Business name"
                    placeholder='Enter The Business Name'
                    value={bname}
                    maxLength={20}
                    onChange={(e) => setBName(e.target.value)}
                    autoComplete='off'
                    onBlur={() => validateBName(bname)}
                    onFocus={()=>setBNameError('')}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                  />
                 
                    <p className="text-red-500 text-sm">{bnameError}</p>
                  
                </div>
      
              </div>
              <div className='grid grid-cols-2  gap-4'>
              <div>
                  <div
                    htmlFor="username"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                   Contact Name<span className="text-red-600 p-2">*</span>
                  </div>
                  <input
                    type="text"
                    id="username"
                    value={name}
                    placeholder='Enter the Contact Name'
                    maxLength={20}
                    onChange={(e) => setName(e.target.value)}
                    autoComplete='off'
                    onBlur={() => validateName(name)}
                    onFocus={()=>setNameError('')}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                  />
                 
                    <p className="text-red-500 text-sm">{nameError}</p>
                  
                </div>
                <div>
                  <div
                    htmlFor="userType"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    User Type <span className="text-red-600 p-2">*</span>
                  </div>
                  <select
                    name="userType"
                    id="userType"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    onBlur={()=>validateType(type)}
                    onFocus={()=>setTypeError('')}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                    
                  >

                     <option value="">Select</option>
                    <option value="Lead">Lead</option>
                    <option value="Prospect">Prospect</option>
                    <option value="Client">Client</option>
                    <option value="On Hold">On Hold</option>
                  </select>
                  <p className="text-red-500 text-sm">{typeError}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
            <div>
                <div
                      htmlFor="phone"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Phone Number <span className="text-red-600 p-1">*</span>
                    </div>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-gray-900 dark:text-white">+91</span>
                      <input
                        type="text"
                        id="phone"
                        maxLength={10}
                      
                        autoComplete='off'
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        onBlur={() => validatePhone(phone)}
                        onFocus={()=>setPhoneError('')}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pl-12 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      />
                    </div>
                   
                      <p className="text-red-500 text-sm">{phoneError}</p>
                 
                  </div>
                  <div>
                    <div
                      htmlFor="email"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                     Contact Email <span className="text-red-600 p-1">*</span>
                    </div>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      placeholder='Enter the Email'
                      autoComplete='off'
                      maxLength={30}
                      onChange={(e) => setEmail(e.target.value)}
                      onBlur={() => validateEmail(email)}
                      onFocus={()=>setEmailError('')}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                    />
               
                      <p className="text-red-500 text-sm">{emailError}</p>
                   
                  </div>
                </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div
                    htmlFor="source"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Source <span className="text-red-600 p-2">*</span>
                  </div>
                  <select
                    name="source"
                    id="source"
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    onBlur={()=>validateSource(source)}
                    onFocus={()=>setsourceError('')}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                  
                  >
                     <option value="">Select</option>
                    <option value="Website">Website</option>
                    <option value="Direct">Direct</option>
                    <option value="Advertisement">Advertisement</option>
                    <option value="Social Media">Social Media</option>
                    <option value="Others">Others</option>
                  </select>
                  <p className="text-red-500 text-sm">{sourceError}</p>
                </div>
                <div>
                  <div
                    htmlFor="products"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Products <span className="text-red-600 p-2">*</span>
                  </div>
                  <select
                    name="products"
                    id="products"
                    value={products}
                    onChange={(e) => setProducts(e.target.value)}
                    onBlur={()=>validateProduct(products)}
                    onFocus={()=>setproductError('')}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                    
                  >
                     <option value="">Select</option>
                    <option value="Taxbandits">Taxbandits</option>
                    <option value="Taxbandits API">Taxbandits API</option>
                    <option value="Tax 990">Tax 990</option>
                    <option value="Express Extension">Express Extension</option>
                    <option value="Express 1099">Express 1099</option>
                  </select>
                  <p className="text-red-500 text-sm">{productError}</p>
                </div>
              </div>
              <button
                onClick={handleSubmit}
                // disabled={isError}
                type='click'
                className="w-full text-white bg-blue-700 hover:bg-green-500 focus:ring-4 focus:outline-none focus-ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark-bg-blue-600 dark-hover-bg-blue-700 dark-focus-ring-blue-800"
              >
                Submit
              </button>
            </form>
            
            </div>

            </div>
            </div>
          </div>
        </div>
    }
    {editModalVisible  && 
        <div id="edit-modal" className="fixed top-0 right-0 z-50 w-full h-full p-4 overflow-x-hidden overflow-y-auto md:inset-0">
          <div className="flex justify-end items-center h-full">
            <div className="w-full max-w-md">
              <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover-bg-gray-600 dark:hover-text-white"
                >
                  <svg
                    className="w-3 h-3"
                    aria-hidden="true"
                    fill="none"
                    viewBox="0 0 14 14"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                    />
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
                <div className="px-6 py-6 lg:px-8">
                  <h3 className="mb-4 text-xl font-medium text-gray-900 dark:text-white">
                    Edit User
                  </h3>
                  <form className="space-y-6">
                  <div className="grid grid-cols-1 gap-4">
                <div>
                  <div
                    htmlFor="username"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Business name
                  </div>
                  <input
                    type="text"
                    id="username"
                    placeholder='Enter the Business Name'
                    value={bname}
                    maxLength={20}
                    onChange={(e) => setBName(e.target.value)}
                    onBlur={() => validateBName(bname)}
                    onFocus={()=>setBNameError('')}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                  />
                 
                    <p className="text-red-500 text-sm">{bnameError}</p>
                  
                </div>
                </div>
               <div className='grid grid-cols-2 gap-4'>
               <div>
                  <div
                    htmlFor="username"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                   Contact Name
                  </div>
                  <input
                    type="text"
                    id="username"
                    value={name}
                    placeholder='Enter the Contact Name'
                    maxLength={20}
                    onChange={(e) => setName(e.target.value)}
                    onBlur={() => validateName(name)}
                    onFocus={()=>setNameError('')}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                  />
                 
                    <p className="text-red-500 text-sm">{nameError}</p>
                  
                </div>
                <div>
                  <div
                    htmlFor="userType"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    User Type
                  </div>
                  <select
                    name="userType"
                    id="userType"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    // onBlur={()=>{validateTypeEdit(type)}}
                    // onFocus={()=>setTypeErrorEdit('')}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                  >
                    <option value="Lead">Lead</option>
                    <option value="Prospect">Prospect</option>
                    <option value="Client">Client</option>
                    <option value="On Hold">On Hold</option>
                  </select>
                  {/* <p className="text-red-500 text-sm">{typeErrorEdit}</p> */}
                </div>
               </div>
              <div className="grid grid-cols-2 gap-4">
            <div>
                <div
                      htmlFor="phone"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Phone Number 
                    </div>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-gray-900 dark:text-white">+91</span>
                      <input
                        type="text"
                        id="phone"
                        maxLength={10}
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        onBlur={() => validatePhone(phone)}
                        onFocus={()=>setPhoneError('')}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pl-12 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      />
                    </div>
                   
                      <p className="text-red-500 text-sm">{phoneError}</p>
                 
                  </div>
                  <div>
                    <div
                      htmlFor="email"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                    Contact  Email 
                    </div>
                    <input
                      type="email"
                      id="email"
                      placeholder='Enter the Email'
                      maxLength={50}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onBlur={() => validateEmail(email)}
                      onFocus={()=>setEmailError('')}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                    />
               
                      <p className="text-red-500 text-sm">{emailError}</p>
                   
                  </div>
                </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div
                    htmlFor="source"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Source
                  </div>
                  <select
                    name="source"
                    id="source"
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    // onBlur={()=>validateSourceEdit(source)}
                    // onFocus={()=>setsourceErrorEdit('')}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                  >
                    <option value="Website">Website</option>
                    <option value="Direct">Direct</option>
                    <option value="Advertisement">Advertisement</option>
                    <option value="Social Media">Social Media</option>
                    <option value="Others">Others</option>
                  </select>
                  {/* <p className="text-red-500 text-sm">{sourceErrorEdit}</p> */}
                </div>
                <div>
                  <div
                    htmlFor="products"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Products
                  </div>
                  <select
                    name="products"
                    id="products"
                    value={products}
                    onChange={(e) => setProducts(e.target.value)}
                    // onBlur={()=>validateProductEdit(products)}
                    // onFocus={()=>setproductErrorEdit('')}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                  >
                    <option value="Taxbandits">Taxbandits</option>
                    <option value="Taxbandits API">Taxbandits API</option>
                    <option value="Tax 990">Tax 990</option>
                    <option value="Express Extension">Express Extension</option>
                    <option value="Express 1099">Express 1099</option>
                  </select>
                  {/* <p className="text-red-500 text-sm">{productErrorEdit}</p> */}
                </div>
              </div>
                    
              <button
                    onClick={handleUserUpdate} 
                    type="button"
                    className="w-full text-white bg-blue-700 hover:bg-green-500 focus:ring-4 focus:outline-none focus-ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark-bg-blue-600 dark-hover-bg-blue-700 dark-focus-ring-blue-800"
                  >
                    Update
                  </button>

                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
    </>
  );
}
