import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'

const cmp_name = 'ARB'

const LoginDataPage = () => {
  const navi = useNavigate()
  const [loginData, setLoginData] = useState({
    id: "",
    password: ""
  })

  const handleChange = (e) => {
    console.log(e.target.name, e.target.value)

    setLoginData(prev => ({
    ...prev,
    [e.target.name]: e.target.value
  }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    console.log('Login data:', loginData)

    navi("dashboard")
  }

  return (
    <div className='min-h-screen grid place-items-center bg-blue-100'>
      <div className='min-h-[50%] flex flex-col justify-center
                      w-[90%] sm:w-[70%] md:w-[50%] lg:w-[30%]
                     bg-white p-4 rounded-2xl shadow-2xl border border-gray-100'>
        
        <h1 className='text-2xl md:text-3xl font-bold text-center p-2 mb-4 text-blue-500'>Welcome to Company {cmp_name}</h1>

        <h3 className='text-xl md:text-2xl font-semibold text-center'>Login</h3>

        <form className='p-4' onSubmit={handleSubmit}>  
          <div className='flex flex-col justify-between'>

            <label htmlFor='id' className='mb-0'>Email/ID</label>
            <Input 
              inpType={"text"}
              inpName={"id"}
              inpValue={loginData.id}
              inpPlaceholder={"Enter email/id"}
              isReq={true}
              rColor={"blue"}
              onChange={handleChange}
            />

            <label htmlFor='password' className='mt-1'>Password</label>
            <Input 
              inpType={"text"}
              inpName={"password"}
              inpValue={loginData.password}
              inpPlaceholder={"Enter your password"}
              isReq={true}
              rColor={"blue"}
              onChange={handleChange}
            />

          </div>

          <Button btnName={"Login"} btnColor={"blue"} btnWidth={"w-full"}/>

        </form>
      </div>
    </div>
  )
}

export default LoginDataPage
