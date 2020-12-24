import Axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Form from "components/form";
import Layout from "components/layout";
import { login } from "utils/auth";

const Login = () => {
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  async function handleLogin(body, endpoint = "/api/login") {
    try {
      const res = await Axios.post(endpoint, body);
      if (res.status === 200) {
        const { jwt_token, jwt_token_expiry } = res.data;
        await login({ jwt_token, jwt_token_expiry });
        router.push("/");
      } else {
        throw new Error(await res.text());
      }
    } catch (error) {
      console.error("An unexpected error happened occurred:", error);
      if (error?.response?.data)
        return setErrorMsg(error?.response?.data.message);
      setErrorMsg(error.message);
    }
  }

  async function googleAuth(e) {
    e.preventDefault();

    if (errorMsg) setErrorMsg("");
    router.push("/api/google");
  }

  useEffect(() => {
    if (router.query.email && router.query.sub) {
      handleLogin(
        { email: router.query.email, sub: router.query.sub },
        "/api/social-login"
      );
    }
  }, [router.query]);
  async function handleSubmit(e) {
    e.preventDefault();
    if (errorMsg) setErrorMsg("");
    const body = {
      email: e.currentTarget.email.value.toLowerCase(),
      password: e.currentTarget.password.value,
    };
    await handleLogin(body);
  }

  return (
    <Layout title="Sign in">
      <Form
        isLogin
        errorMessage={errorMsg}
        onSubmit={handleSubmit}
        googleAuth={googleAuth}
      />
    </Layout>
  );
};

export default Login;
