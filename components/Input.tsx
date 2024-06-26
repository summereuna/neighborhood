import type { UseFormRegisterReturn } from "react-hook-form";

interface InputProps {
  label: string;
  name: string;
  kind?: "text" | "email" | "phone" | "price" | "token";
  placeholder?: string;
  required: boolean;
  register: UseFormRegisterReturn;
  //[key: string]: any; //input에 원하는 prop 전달하고 싶을 때 사용하려고 일단 남겨둠: 타입 명시 등
}

export default function Input({
  label,
  name,
  kind,
  placeholder,
  required,
  // ...rest //여기서 나머지 prop들 포착해서 input에 넣어줌
  register, //react-hook-form register 프롭으로 보낸거 받기
}: InputProps) {
  return (
    <div className="space-y-1">
      <label
        htmlFor={name}
        className="block text-sm font-semibold text-gray-700"
      >
        {label}
      </label>

      {kind == "text" ? (
        <div className="relative rounded-md shadow-sm flex items-center">
          <input
            {...register}
            // {...rest} // 따라서 다른 props도 추가적으로 넣을수 있음
            id={name}
            type="text"
            placeholder={placeholder}
            required={required}
            className="appearance-none w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-lime-500 focus:border-lime-500"
          />
        </div>
      ) : null}

      {kind == "email" ? (
        <div className="relative rounded-md shadow-sm flex items-center">
          <input
            {...register}
            // {...rest}
            id={name}
            type="email"
            placeholder={placeholder}
            required={required}
            className="appearance-none w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-lime-500 focus:border-lime-500"
          />
        </div>
      ) : null}

      {kind === "price" ? (
        <div className="relative rounded-md shadow-sm flex items-center">
          <div className="absolute left-0 pl-3 flex items-center justify-center">
            <span className="text-gray-500 text-sm pointer-events-none">₩</span>
          </div>
          <input
            {...register}
            // {...rest}
            id={name}
            type="number"
            placeholder={placeholder}
            required={required}
            className="pl-7 appearance-none w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-lime-500 focus:border-lime-500"
          />
          <div className="absolute right-0 pr-3 flex items-center pointer-events-none">
            <span className="text-gray-500">원</span>
          </div>
        </div>
      ) : null}

      {kind === "phone" ? (
        <div className="flex rounded-md shadow-sm">
          <span className="flex items-center justify-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 select-none text-sm">
            +82
          </span>
          <input
            {...register}
            // {...rest}
            id={name}
            type="number"
            required={required}
            className="w-full appearance-none px-3 py-2 border border-gray-300 rounded-r-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-lime-600 focus:border-lime-600"
          />
        </div>
      ) : null}

      {kind == "token" ? (
        <div className="relative rounded-md shadow-sm flex items-center">
          <input
            {...register}
            // {...rest}
            id={name}
            type="number"
            placeholder={placeholder}
            required={required}
            className="appearance-none w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-lime-500 focus:border-lime-500"
          />
        </div>
      ) : null}
    </div>
  );
}
