import HCaptcha from "@hcaptcha/react-hcaptcha";
import { Avatar, Progress } from "@nextui-org/react";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import useSWR from "swr/immutable";
import { errorToast } from "./toasts";

export default function Verify() {
  const {
    data,
    error: infoError,
    isLoading,
  } = useSWR(`${import.meta.env.VITE_API}/info`, (url: string) =>
    fetch(url).then((res) => res.json())
  );
  const [verified, setVerified] = useState(false);
  const [message, setMessage] = useState("");

  const [searchParams] = useSearchParams();

  const id = searchParams.get("id");

  async function handleVerification(verificationToken: string) {
    try {
      const res = await fetch(`${import.meta.env.VITE_API}/verify`, {
        method: "POST",
        body: JSON.stringify({
          id,
          verificationToken,
        }),
      });
      const data = await res.json();
      if (data?.success) {
        setVerified(true);
        setMessage(data?.message);
      } else {
        errorToast(data?.message);
      }
    } catch (err) {
      console.error(err);
      errorToast("Uh oh, an error has encountered");
    }
  }

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

        {verified ? (
          <p
            className="text-center font-medium"
            dangerouslySetInnerHTML={{ __html: message }}
          />
        ) : (
          <div>
            <HCaptcha
              theme="dark"
              sitekey={import.meta.env.VITE_HCAPTCHA_KEY}
              onVerify={(token) => handleVerification(token)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
