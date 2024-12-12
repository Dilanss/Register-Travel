import { useState } from "react"
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa"

const Passwordinput = ({ value, onChange, placeholder}) => {

    const [isShowPassword, setIsShowPassword] = useState(false)

    const toggleShowPassword = () => {
        setIsShowPassword(!isShowPassword)
    }

    return (
        <div className='flex items-center bg-cyan-600/5 px-5 rounded mb-3'>
            <input  
                value={value}
                onChange={onChange}
                placeholder={placeholder || "Password"}
                type={isShowPassword ? "text" : "password"}
                className='w-full text-sm bg-transparent py-3 mr-3 rounded outline-none'
            />


            {isShowPassword ? (
                <FaRegEye 
                    className='text-primary cursor-pointer'
                    size={22}
                    onClick={() => toggleShowPassword()}
                />
            ) : (
                <FaRegEyeSlash 
                    className='text-slate-400 cursor-pointer'
                    size={22}
                    onClick={() => toggleShowPassword()}
                />
            )}
        </div>
    )
}

export default Passwordinput;