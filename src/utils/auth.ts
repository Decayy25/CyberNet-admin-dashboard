import Router from "next/router";


export const handleUnauthorized = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");

    Router.push("/auth/login").catch(() => {
        window.location.href = "/auth/login";
    });
  }
};
