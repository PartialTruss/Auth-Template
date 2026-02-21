import { useState } from "react";
import eye_off from "../../assets/Images/eye-off.svg";
import eye from "../../assets/Images/eye.svg";
import type { InputProps } from "./types";

const Input = ({ type, label, ...props }: InputProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordType = type === "password";
  const inputType = isPasswordType && showPassword ? "text" : type;

  return (
    <>
      <div className="">
        <label htmlFor="">{label}</label>
        <div className="relative">
          <input
            type={inputType}
            {...props}
            className="border-[#83C5BE]/30 border-2 p-2 mb-2 w-full max-w-sm rounded-lg"
          />
        </div>
        {isPasswordType && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute left-[35%] top-[45.5%] -translate-y-[45.5%]"
          >
            {
              <img
                src={showPassword ? eye_off : eye}
                alt=""
                className="w-4/5"
              />
            }
          </button>
        )}
      </div>
    </>
  );
};

export default Input;
