import { useSetRecoilState } from "recoil";
import useSWR from "swr/immutable";
import { Avatar, Button, Input, Progress } from "@nextui-org/react";
import { useEffect, useState } from "react";
import authState from "../atoms/auth";
import { errorToast } from "../toasts";

function Login() {
  const setAuth = useSetRecoilState(authState);

  const {
    data,
    error: infoError,
    isLoading,
  } = useSWR(`${import.meta.env.VITE_API}/info`, (url: string) =>
    fetch(url).then((res) => res.json())
  );
  const [isVisible, setIsVisible] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [password, setPassword] = useState("");

  const toggleVisibility = () => setIsVisible(!isVisible);

  async function handleLogin(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();

    setDisabled(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API}/login`, {
        method: "POST",
        body: JSON.stringify({ password: password }),
      });
      const data = await res.json();
      if (data.success) {
        setAuth({
          password,
          valid: true,
        });
        return;
      }
      errorToast(data.message);
      setDisabled(false);
    } catch (err) {
      errorToast("Uh oh, an error has encountered");
      setDisabled(false);
    }
  }

  useEffect(() => {
    if (infoError) {
      errorToast("Uh oh, an error has encountered");
    }
  }, [infoError]);

  if (isLoading) {
    return (
      <Progress
        size="sm"
        isIndeterminate
        aria-label="Loading..."
        className="max-w-md absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
      />
    );
  }

  return (
    <div className="flex w-screen h-screen justify-center items-center">
      <div className="w-full max-w-xs space-y-6">
        <div className="space-y-2">
          <Avatar
            showFallback
            isBordered
            color={infoError ? "danger" : "success"}
            src={data?.data?.avatarUrl}
            className="w-32 h-32 text-large mx-auto"
          />
          <h1 className="text-xl font-bold text-center">
            {data?.data?.username}
          </h1>
        </div>

        <form onSubmit={handleLogin} className="space-y-2">
          <Input
            disabled={disabled}
            label="Password"
            value={password}
            onValueChange={setPassword}
            endContent={
              <button
                className="focus:outline-none"
                type="button"
                onClick={toggleVisibility}>
                {isVisible ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-5 h-5 text-2xl text-default-400 pointer-events-none">
                    <path
                      fillRule="evenodd"
                      d="M3.28 2.22a.75.75 0 00-1.06 1.06l14.5 14.5a.75.75 0 101.06-1.06l-1.745-1.745a10.029 10.029 0 003.3-4.38 1.651 1.651 0 000-1.185A10.004 10.004 0 009.999 3a9.956 9.956 0 00-4.744 1.194L3.28 2.22zM7.752 6.69l1.092 1.092a2.5 2.5 0 013.374 3.373l1.091 1.092a4 4 0 00-5.557-5.557z"
                      clipRule="evenodd"
                    />
                    <path d="M10.748 13.93l2.523 2.523a9.987 9.987 0 01-3.27.547c-4.258 0-7.894-2.66-9.337-6.41a1.651 1.651 0 010-1.186A10.007 10.007 0 012.839 6.02L6.07 9.252a4 4 0 004.678 4.678z" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-5 h-5 text-2xl text-default-400 pointer-events-none">
                    <path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
                    <path
                      fillRule="evenodd"
                      d="M.664 10.59a1.651 1.651 0 010-1.186A10.004 10.004 0 0110 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0110 17c-4.257 0-7.893-2.66-9.336-6.41zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>
            }
            type={isVisible ? "text" : "password"}
          />
          <Button
            isLoading={disabled}
            type="submit"
            fullWidth
            color="primary"
            variant="shadow">
            Login
          </Button>
        </form>
      </div>
    </div>
  );
}

export default Login;
