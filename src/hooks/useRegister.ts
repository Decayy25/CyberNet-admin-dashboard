import { useState } from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ILogin } from "@/types/Auth";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/router";
import axios from "axios";

const registerSchema = yup.object().shape({
  identifier: yup
    .string()
    .required("Username harus diisi")
    .min(3, "Username minimal 3 karakter"),
  password: yup
    .string()
    .required("Password harus diisi")
    .min(6, "Password minimal 6 karakter"),
  confirmPassword: yup
    .string()
    .required("Konfirmasi password harus diisi")
    .oneOf([yup.ref("password")], "Password tidak cocok"),
});

const useRegister = () => {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const [isVisibleConfirm, setIsVisibleConfirm] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);
  const toggleVisibilityConfirm = () => setIsVisibleConfirm(!isVisibleConfirm);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm<ILogin & { confirmPassword: string }>({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      identifier: "",
      password: "",
      confirmPassword: "",
    },
  });

  const registerService = async (payload: ILogin) => {
    try {
      const response = await axios.post("/api/auth/register", payload);

      if (!response.data.success) {
        throw new Error(
          response.data.errors?.[0] ||
            response.data.message ||
            "Registrasi gagal",
        );
      }

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data) {
        throw new Error(
          error.response.data.errors?.[0] ||
            error.response.data.message ||
            "Registrasi gagal",
        );
      }
      throw error;
    }
  };

  const { mutate: mutateRegister, isPending: isPendingRegister } = useMutation({
    mutationFn: registerService,
    onError(error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Registrasi gagal, silakan coba lagi.";
      setError("root", {
        type: "manual",
        message: errorMessage,
      });
    },
    onSuccess: () => {
      reset();
      // Redirect ke login dengan message sukses
      router.push("/auth/login?registered=true");
    },
  });

  const handleRegister = (data: ILogin & { confirmPassword: string }) => {
    const { confirmPassword, ...payload } = data;
    mutateRegister(payload);
  };

  return {
    isVisible,
    toggleVisibility,
    isVisibleConfirm,
    toggleVisibilityConfirm,
    control,
    handleSubmit,
    handleRegister,
    isPendingRegister,
    errors,
  };
};

export default useRegister;
