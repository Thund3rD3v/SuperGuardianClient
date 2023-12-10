/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button, Select, SelectItem, Switch } from "@nextui-org/react";
import { IAuthState, IRole } from "../types";
import { useState } from "react";
import { errorToast, successToast } from "../toasts";
import { useSWRConfig } from "swr";
import { IsSetsEqual } from "../utils/main";

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rolesData: any;
  auth: IAuthState;
}

function JoinRoles({ data, rolesData, auth }: Props) {
  const { mutate } = useSWRConfig();

  const [isLoading, setIsLoading] = useState(false);

  // Join Roles Config
  const [enabled, setEnabled] = useState(data?.data?.enabled);
  const [includeBots, setIncludeBots] = useState(data?.data?.includeBots);
  const [selectedRoles, setSelectedRoles] = useState<Set<string>>(
    new Set(
      rolesData?.data?.roles
        .filter((role: IRole) => {
          return data?.data?.roles.includes(role.id);
        })
        .map((role: IRole) => {
          return role.id;
        })
    )
  );

  async function handleSave() {
    setIsLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API}/join-roles/edit`, {
        method: "PATCH",
        headers: {
          Authorization: auth.password,
        },
        body: JSON.stringify({
          enabled,
          includeBots,
          roles: Array.from(selectedRoles),
        }),
      });
      const data = await res.json();
      if (data?.success) {
        successToast(data?.message);
        mutate(`${import.meta.env.VITE_API}/join-roles/info`);
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
      includeBots != data?.data?.includeBots ||
      !IsSetsEqual(selectedRoles, new Set(data?.data?.roles))
    ) {
      return false;
    }

    return true;
  }

  return (
    <div
      className="px-4 py-6 max-h-72 border bg-zinc-800/20 border-zinc-800 shadow-lg w-full max-w-none md:max-w-md rounded-lg"
      style={{ display: "flex", flexDirection: "column" }}>
      <div className="flex justify-between">
        <h2 className="text-2xl font-semibold flex gap-2 items-center">
          Join Roles
          {!checkIfSaved() && <span className="text-sm">(not saved)</span>}
        </h2>
        <Switch
          isSelected={enabled}
          onValueChange={setEnabled}
          color="success"
        />
      </div>
      <div className="mt-4 space-y-4 flex-grow">
        <Select
          onSelectionChange={setSelectedRoles}
          selectedKeys={selectedRoles}
          label="Roles"
          selectionMode="multiple">
          {rolesData?.data?.roles
            .filter((role: IRole) => role.position != 0)
            .map((role: IRole) => {
              return (
                <SelectItem
                  startContent={
                    role.color != 0 && (
                      <div
                        className="w-5 h-5 rounded-full"
                        style={{ background: `#${role.color.toString(16)}` }}
                      />
                    )
                  }
                  key={role.id}
                  value={role.id}>
                  {role.name}
                </SelectItem>
              );
            })}
        </Select>
        <Switch isSelected={includeBots} onValueChange={setIncludeBots}>
          Include Bots
        </Switch>
      </div>
      <Button
        onClick={handleSave}
        isLoading={isLoading}
        className="mt-4"
        color="primary"
        fullWidth>
        Save
      </Button>
    </div>
  );
}

export default JoinRoles;
