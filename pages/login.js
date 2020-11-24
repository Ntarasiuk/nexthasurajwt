import Axios from "axios";
import Router from "next/router";
import { useState } from "react";
import Form from "../components/form";
import { useUser } from "../lib/hooks";

const Login = () => {
  useUser({ redirectTo: "/", redirectIfFound: true });

  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    if (errorMsg) setErrorMsg("");

    const body = {
      email: e.currentTarget.email.value.toLowerCase(),
      password: e.currentTarget.password.value,
    };

    try {
      const res = await Axios.post("/api/login", body);
      if (res.status === 200) {
        Router.push("/");
      } else {
        throw new Error(await res.text());
      }
    } catch (error) {
      console.error("An unexpected error happened occurred:", error);
      if (error?.response?.data) return setErrorMsg(error?.response?.data);
      setErrorMsg(error.message);
    }
  }

  return <Form isLogin errorMessage={errorMsg} onSubmit={handleSubmit} />;
};

export default Login;
