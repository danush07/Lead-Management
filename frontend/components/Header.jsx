import { FaSignInAlt, FaSignOutAlt, FaUser } from 'react-icons/fa'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '@/features/auth/authSlice'
import { reset } from '@/features/createUser/newSlice'
function Header() {

  const router = useRouter()
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)

  const onLogout = () => {
    dispatch(logout()).then(
      ()=>{
        dispatch(reset())
        router.push('/')
      }
    )
  }

  return (
    <header className='relative flex flex-wrap items-center justify-between px-2 py-3 bg-slate-50 mb-3"'>
      <div className='text-black-600 font-bold cursor-pointer'> 
        <Link href='/'>Lead Management</Link>
      </div>
      <ul className='flex flex-col lg:flex-row list-none lg:ml-auto items-center'>

        {user ? (<>
        <Link href='/profile'>
          
    
          <div class="relative inline-flex items-center justify-center w-10 h-10 mr-6 overflow-hidden bg-gray-200 rounded-full dark:bg-gray-600 hover:bg-gray-300 transition duration-500 ease select-none ">
              <span class="font-medium text-xl text-gray-600 dark:text-gray-300">{user.name.toUpperCase().charAt(0)}</span>
          </div>


          </Link>
          <li className='relative mr-2 flex flex-wrap items-center gap-2 border bg-gray-200 text-gray-700 rounded-md px-4 py-2 transition duration-500 ease select-none hover:bg-gray-300 focus:outline-none focus:shadow-outline'>
            <button className=' font-semibold'
             onClick={onLogout}>
              <FaSignOutAlt className='inline-flex  items-baseline'/>Logout
            </button>
          </li>
          
          </>
        ) : (
          <>
          <li>
            
          </li>
            <li>
              <button className=' bg-slate-50 text-gray-700 rounded-md px-4 py-2 transition duration-500 ease select-none hover:bg-gray-300 focus:outline-none focus:shadow-outline'>

            <Link href='/login' className='text-center'>
               <FaSignInAlt className='inline-flex mb-1 mr-1 items-baseline' />Login
            </Link>
              </button>

            </li>
            <li>
              <button className=' bg-slate-50 text-gray-700 rounded-md px-4 py-2 transition duration-500 ease select-none hover:bg-gray-300 focus:outline-none focus:shadow-outline'>

              <Link href='/register'>
                <FaUser  className='inline-flex font-semibold items-baseline mr-1 mb-1' />Register
              </Link>
              </button>
            </li>
          </>
        )}
      </ul>
    </header>
  )
}

export default Header