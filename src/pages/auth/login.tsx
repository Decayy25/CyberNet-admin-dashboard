import React, { Fragment } from "react";
import { Controller } from "react-hook-form";
import { HardDrive, Lock, User, Eye, EyeOff } from "lucide-react";
import PageHead from "@/components/common/PageHead";
import useLogin from "@/hooks/useLogin";

export default function LoginPage(): React.JSX.Element {
  const {
    isVisible,
    toggleVisibility,
    control,
    handleSubmit,
    handleLogin,
    isPendingLogin,
    errors,
  } = useLogin();

  return (
    <Fragment>
      <PageHead title="Login Admin | CyberNet" />

      <div className="flex h-screen w-screen items-center justify-center bg-[#0B0F19] p-4 font-sans antialiased">
        {/* KOTAK FORM LOGIN */}
        <div className="w-full max-w-md bg-[#111827] border border-gray-800 rounded-2xl shadow-2xl p-8 space-y-6">
          {/* BRANDING LOGO */}
          <div className="flex flex-col items-center space-y-2 text-center">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center font-bold text-white shadow-xl shadow-blue-600/30">
              <HardDrive size={24} />
            </div>
            <h2 className="text-xl font-bold tracking-wider text-white pt-2">
              CyberNet
            </h2>
            <p className="text-xs text-gray-400">
              Silakan masuk untuk mengelola paket & area jangkauan wifi
            </p>
          </div>

          {/* HANDLING GLOBAL ERROR NOTIFICATION (DARI SERVER/REACT QUERY) */}
          {errors.root && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs py-3 px-4 rounded-xl text-center font-medium animate-fadeIn">
              {errors.root.message}
            </div>
          )}

          {/* FORM INPUT - Dikendalikan oleh React Hook Form */}
          <form onSubmit={handleSubmit(handleLogin)} className="space-y-4">
            {/* INPUT IDENTIFIER */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider">
                Identifier
              </label>
              <Controller
                name="identifier"
                control={control}
                render={({ field }) => (
                  <div
                    className={`flex items-center gap-3 bg-[#1F2937]/60 border px-4 py-3 rounded-xl transition-all duration-200
                      ${
                        errors.identifier
                          ? "border-red-500/50 focus-within:border-red-500"
                          : "border-gray-800 focus-within:border-blue-500"
                      }`}
                  >
                    <User size={16} className="text-gray-500" />
                    <input
                      {...field}
                      type="text"
                      placeholder="Username atau email"
                      disabled={isPendingLogin}
                      className="bg-transparent text-sm text-gray-200 focus:outline-none w-full placeholder-gray-600 disabled:text-gray-500"
                    />
                  </div>
                )}
              />
              {/* Error per-field validasi Yup */}
              {errors.identifier && (
                <span className="text-red-500 text-xs font-medium block pl-1">
                  {errors.identifier.message}
                </span>
              )}
            </div>

            {/* INPUT PASSWORD */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider">
                Password
              </label>
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <div
                    className={`flex items-center gap-3 bg-[#1F2937]/60 border px-4 py-3 rounded-xl transition-all duration-200 relative
                      ${
                        errors.password
                          ? "border-red-500/50 focus-within:border-red-500"
                          : "border-gray-800 focus-within:border-blue-500"
                      }`}
                  >
                    <Lock size={16} className="text-gray-500" />
                    <input
                      {...field}
                      type={isVisible ? "text" : "password"}
                      placeholder="••••••••"
                      autoComplete="off"
                      disabled={isPendingLogin}
                      className="bg-transparent text-sm text-gray-200 focus:outline-none w-full placeholder-gray-600 tracking-wide disabled:text-gray-500"
                    />
                    <button
                      type="button"
                      onClick={toggleVisibility}
                      tabIndex={-1}
                      disabled={isPendingLogin}
                      className="text-gray-500 hover:text-gray-400 focus:outline-none absolute right-4 transition-colors disabled:opacity-50"
                    >
                      {isVisible ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                )}
              />
              {/* Error per-field validasi Yup */}
              {errors.password && (
                <span className="text-red-500 text-xs font-medium block pl-1">
                  {errors.password.message}
                </span>
              )}
            </div>

            <button
              type="submit"
              disabled={isPendingLogin}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:text-gray-400 text-white font-medium py-3 rounded-xl shadow-lg shadow-blue-600/10 transition-all duration-200 flex items-center justify-center text-sm"
            >
              {isPendingLogin ? (
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  <span>Memverifikasi Ke Backend...</span>
                </div>
              ) : (
                "Masuk ke Dashboard"
              )}
            </button>
          </form>

          {/* FOOTER */}
          <div className="text-center pt-2">
            <span className="text-[10px] font-mono text-gray-600 tracking-wider uppercase">
              CyberNet System v1.0.0
            </span>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
