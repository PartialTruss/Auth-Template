import type { ButtonProps } from "./types";

const Button = ({ type, text, ...props }: ButtonProps) => {
  return (
    <>
      <button
        className="bg-[#006D77] text-white px-4 py-3 w-full max-w-sm disabled:opacity-50 rounded-lg cursor-pointer"
        type={type}
        {...props}
      >
        {text}
      </button>
    </>
  );
};

export default Button;
