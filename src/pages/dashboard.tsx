import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Dashboard = ({ rounds }) => {
  const [userInfo, setUserInfo] = useState({
    user_name: "",
    user_maxscore: 0
  });
  const [dropdown, setDropdown] = useState(false);

  const checkAuthenticated = async () => {
    try {
      const res = await fetch(env.BASE_URL + "/dashboard/userinfo", {
        method: "GET",
        headers: { token: localStorage.token }
      });

      const parseRes = await res.json();

      setUserInfo(parseRes);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    checkAuthenticated();
  }, [rounds == 5]);

  const logoutHandle = (e) => {
    e.preventDefault();
    localStorage.removeItem("token");
    window.location = "/";
  };

  const dropdownHandle = () => {
    setDropdown(!dropdown);
  }

  return (
    <div className='absolute top-3 right-1 transition-all duration-300 ease-in-out z-50'>
      <div className='bg-[#ffffffa3] w-[100px] h-[100px] rounded-full scale-[0.65]'>

        <div>
          <input type='checkbox' onClick={dropdownHandle} className='absolute cursor-pointer rounded-full opacity-0 w-[100px] h-[100px]' />
          <img
            className='rounded-full'
            src={`https://api.dicebear.com/6.x/personas/svg?seed=${userInfo.user_name}`}
            alt="profile"
            width="100"
            height="100"
          />
        </div>

        <div
          className={`${dropdown ? 'block' : 'hidden'
            } absolute p-4 right-0 mt-2 w-[300px] rounded-md shadow-lg bg-white`}
        >
          <div className='p-4'>
            <div className='flex justify-between items-center'>
              <p className='text-4xl font-bold'>{userInfo.user_name}</p>
              <p className="text-4xl cursor-pointer transition-all ease-in-out hover:scale-125 mb-2" onClick={dropdownHandle}>X</p>
            </div>
            <hr className='my-2' />
            <p className='text-4xl mt-10 mb-10'>Max: {userInfo.user_maxscore}</p>
            <Link to='/mode'>
              <p className='text-4xl mb-10'>Select Mode</p>
            </Link>
            <p className='text-4xl mb-10'>Profile</p>
            <p className='text-4xl mb-10'>Settings</p>
            <hr className='my-2' />
            <p
              className='text-4xl px-1 cursor-pointer text-red-400'
              onClick={logoutHandle}
            >
              Logout
            </p>
          </div>
        </div>

      </div>
    </div>

  );
};

export default Dashboard;