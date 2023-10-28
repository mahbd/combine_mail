"use client";

import { TextField } from "@radix-ui/themes";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { UseFormRegisterReturn } from "react-hook-form";
import { useState } from "react";

interface Props {
  register: UseFormRegisterReturn;
  id: string;
}

const PasswordField = ({ register, id }: Props) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <TextField.Root>
      <TextField.Input
        {...register}
        type={showPassword ? "text" : "password"}
        id={id}
      />
      <TextField.Slot
        onClick={() => {
          setShowPassword(!showPassword);
        }}
        className="cursor-pointer"
      >
        {showPassword ? <AiFillEye /> : <AiFillEyeInvisible />}
      </TextField.Slot>
    </TextField.Root>
  );
};

export default PasswordField;
