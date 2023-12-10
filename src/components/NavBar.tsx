import useSWR from "swr/immutable";
import {
  Navbar,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  Avatar,
} from "@nextui-org/react";
import { useResetRecoilState } from "recoil";
import authState from "../atoms/auth";

function NavBar() {
  const resetAuth = useResetRecoilState(authState);
  const { data, error: infoError } = useSWR(
    `${import.meta.env.VITE_API}/info`,
    (url: string) => fetch(url).then((res) => res.json())
  );

  return (
    <Navbar maxWidth="xl" isBordered className="fixed bg-zinc-950/60 shadow-sm">
      <p className="font-bold text-lg">{data?.data?.username}</p>
      <Dropdown placement="bottom-end">
        <DropdownTrigger>
          <Avatar
            isBordered
            as="button"
            className="transition-transform"
            color={infoError ? "danger" : "success"}
            name={data?.data?.username}
            size="sm"
            src={data?.data?.avatarUrl}
          />
        </DropdownTrigger>
        <DropdownMenu aria-label="Profile Actions" variant="flat">
          <DropdownItem key="profile" className="h-14 gap-2">
            <p className="font-semibold">Logged Into</p>
            <p className="font-medium">{data?.data?.username}</p>
          </DropdownItem>
          <DropdownItem onClick={resetAuth} key="logout" color="danger">
            Log Out
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </Navbar>
  );
}

export default NavBar;
