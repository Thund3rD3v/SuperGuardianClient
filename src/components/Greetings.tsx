import { Button, Input, Select, SelectItem, Switch } from "@nextui-org/react";
import { IAuthState, IChannel } from "../types";
import { useState } from "react";
import { errorToast, successToast } from "../toasts";
import { useSWRConfig } from "swr";
import { IsSetsEqual } from "../utils/main";

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  channelsData: any;
  auth: IAuthState;
}

function Greetings({ data, channelsData, auth }: Props) {
  const { mutate } = useSWRConfig();

  const [isLoading, setIsLoading] = useState(false);

  // Greetings Config
  const [enabled, setEnabled] = useState(data?.data?.enabled);
  const [message, setMessage] = useState(data?.data?.message);
  const [selectedChannel, setSelectedChannel] = useState(
    new Set([data?.data?.channelId])
  );

  async function handleSave() {
    setIsLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API}/greetings/edit`, {
        method: "PATCH",
        headers: {
          Authorization: auth.password,
        },
        body: JSON.stringify({
          enabled,
          message,
          channelId: Array.from(selectedChannel)[0],
        }),
      });
      const data = await res.json();
      if (data?.success) {
        successToast(data?.message);
        mutate(`${import.meta.env.VITE_API}/greetings/info`);
      } else {
        errorToast(data?.message);
      }

      setIsLoading(false);
    } catch (err) {
      console.error(err);
      errorToast("Uh oh, an error has encountered");
      setIsLoading(false);
    }
  }

  function checkIfSaved() {
    if (
      enabled != data?.data?.enabled ||
      message != data?.data?.message ||
      !IsSetsEqual(selectedChannel, new Set([data?.data?.channelId]))
    ) {
      return false;
    }

    return true;
  }

  return (
    <div className="px-4 py-6 max-h-72 border bg-zinc-800/20 border-zinc-800 shadow-lg w-full md:max-w-md max-w-none rounded-lg flex flex-col">
      <div className="flex justify-between">
        <h2 className="text-2xl font-semibold flex gap-2 items-center">
          Greetings
          {!checkIfSaved() && <span className="text-sm">(not saved)</span>}
        </h2>
        <Switch
          color="success"
          onValueChange={setEnabled}
          isSelected={enabled}
        />
      </div>
      <div className="mt-4 space-y-4 flex-grow">
        <Input label="Message" onValueChange={setMessage} value={message} />
        <Select
          label="Channel"
          onSelectionChange={setSelectedChannel}
          selectedKeys={selectedChannel}>
          {channelsData?.data?.channels
            .filter(
              (channel: IChannel) => channel.type == 0 || channel.type == 5
            )
            .map((channel: IChannel) => {
              return (
                <SelectItem
                  key={channel.id}
                  value={channel.id}
                  startContent={
                    channel.type == 5 ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="w-5 h-5">
                        <path d="M13.92 3.845a19.361 19.361 0 01-6.3 1.98C6.765 5.942 5.89 6 5 6a4 4 0 00-.504 7.969 15.974 15.974 0 001.271 3.341c.397.77 1.342 1 2.05.59l.867-.5c.726-.42.94-1.321.588-2.021-.166-.33-.315-.666-.448-1.004 1.8.358 3.511.964 5.096 1.78A17.964 17.964 0 0015 10c0-2.161-.381-4.234-1.08-6.155zM15.243 3.097A19.456 19.456 0 0116.5 10c0 2.431-.445 4.758-1.257 6.904l-.03.077a.75.75 0 001.401.537 20.902 20.902 0 001.312-5.745 1.999 1.999 0 000-3.545 20.902 20.902 0 00-1.312-5.745.75.75 0 00-1.4.537l.029.077z" />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="w-5 h-5">
                        <path
                          fillRule="evenodd"
                          d="M10 3c-4.31 0-8 3.033-8 7 0 2.024.978 3.825 2.499 5.085a3.478 3.478 0 01-.522 1.756.75.75 0 00.584 1.143 5.976 5.976 0 003.936-1.108c.487.082.99.124 1.503.124 4.31 0 8-3.033 8-7s-3.69-7-8-7zm0 8a1 1 0 100-2 1 1 0 000 2zm-2-1a1 1 0 11-2 0 1 1 0 012 0zm5 1a1 1 0 100-2 1 1 0 000 2z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )
                  }>
                  {channel.name}
                </SelectItem>
              );
            })}
        </Select>
      </div>
      <Button
        className="mt-4"
        onClick={handleSave}
        isLoading={isLoading}
        color="primary"
        fullWidth>
        Save
      </Button>
    </div>
  );
}

export default Greetings;
