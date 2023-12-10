import useSWR from "swr/immutable";
import Greetings from "./Greetings";
import NavBar from "./NavBar";
import { useRecoilValue } from "recoil";
import authState from "../atoms/auth";
import { Progress, Tab, Tabs } from "@nextui-org/react";
import JoinRoles from "./JoinRoles";
import Embed from "./EmbedSender";
import { useState } from "react";
import Levels from "./Levels";
import Leaderboard from "./Leaderboard";

const embed = false;

function Dashboard() {
  const auth = useRecoilValue(authState);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [tab, setTab] = useState<any>("dashboard");

  // Other Data
  const { data: channelsData, isLoading: isChannelsLoading } = useSWR(
    `${import.meta.env.VITE_API}/info/channels`,
    (url: string) =>
      fetch(url, {
        headers: {
          Authorization: auth.password, // Corrected header name
        },
      }).then((res) => res.json())
  );

  const { data: rolesData, isLoading: isRolesLoading } = useSWR(
    `${import.meta.env.VITE_API}/info/roles`,
    (url: string) =>
      fetch(url, {
        headers: {
          Authorization: auth.password,
        },
      }).then((res) => res.json())
  );

  // Main Settings
  const { data: greetingsData, isLoading: isGreetingsLoading } = useSWR(
    `${import.meta.env.VITE_API}/greetings/info`,
    (url: string) =>
      fetch(url, {
        headers: {
          Authorization: auth.password,
        },
      }).then((res) => res.json())
  );

  const { data: joinRolesData, isLoading: isJoinRolesLoading } = useSWR(
    `${import.meta.env.VITE_API}/join-roles/info`,
    (url: string) =>
      fetch(url, {
        headers: {
          Authorization: auth.password,
        },
      }).then((res) => res.json())
  );

  const { data: levelsData, isLoading: isLevelsLoading } = useSWR(
    `${import.meta.env.VITE_API}/levels/info`,
    (url: string) =>
      fetch(url, {
        headers: {
          Authorization: auth.password,
        },
      }).then((res) => res.json())
  );

  // Make Sure All Data Is Loaded
  if (
    isChannelsLoading ||
    isRolesLoading ||
    isGreetingsLoading ||
    isJoinRolesLoading ||
    isLevelsLoading
  ) {
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
    <>
      <NavBar />
      <div
        className={`pt-32 px-12 flex flex-col gap-2 ${
          tab != embed && "items-center"
        } sm:items-stretch`}>
        <div className="text-center sm:text-left">
          <Tabs
            selectedKey={tab}
            onSelectionChange={setTab}
            aria-label="Options">
            <Tab
              key="dashboard"
              title={
                <div className="flex items-center space-x-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-5 h-5">
                    <path d="M14.916 2.404a.75.75 0 01-.32 1.012l-.596.31V17a1 1 0 01-1 1h-2.26a.75.75 0 01-.75-.75v-3.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.5a.75.75 0 01-.75.75h-3.5a.75.75 0 010-1.5H2V9.957a.75.75 0 01-.596-1.372L2 8.275V5.75a.75.75 0 011.5 0v1.745l10.404-5.41a.75.75 0 011.012.32zM15.861 8.57a.75.75 0 01.736-.025l1.999 1.04A.75.75 0 0118 10.957V16.5h.25a.75.75 0 110 1.5h-2a.75.75 0 01-.75-.75V9.21a.75.75 0 01.361-.64z" />
                  </svg>

                  <span>Dashboard</span>
                </div>
              }>
              <div className="flex w-full items-center flex-col md:items-stretch md:flex-row gap-4">
                <Greetings
                  data={greetingsData}
                  channelsData={channelsData}
                  auth={auth}
                />
                <JoinRoles
                  data={joinRolesData}
                  rolesData={rolesData}
                  auth={auth}
                />
                <Levels
                  data={levelsData}
                  channelsData={channelsData}
                  auth={auth}
                />
              </div>
            </Tab>
            <Tab
              key="embed"
              title={
                <div className="flex items-center space-x-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-5 h-5">
                    <path
                      fillRule="evenodd"
                      d="M4.25 2A2.25 2.25 0 002 4.25v11.5A2.25 2.25 0 004.25 18h11.5A2.25 2.25 0 0018 15.75V4.25A2.25 2.25 0 0015.75 2H4.25zm4.03 6.28a.75.75 0 00-1.06-1.06L4.97 9.47a.75.75 0 000 1.06l2.25 2.25a.75.75 0 001.06-1.06L6.56 10l1.72-1.72zm4.5-1.06a.75.75 0 10-1.06 1.06L13.44 10l-1.72 1.72a.75.75 0 101.06 1.06l2.25-2.25a.75.75 0 000-1.06l-2.25-2.25z"
                      clipRule="evenodd"
                    />
                  </svg>

                  <span>Embed</span>
                </div>
              }>
              <Embed auth={auth} channelsData={channelsData} />
            </Tab>
            <Tab
              key="leaderboard"
              title={
                <div className="flex items-center space-x-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-5 h-5">
                    <path
                      fillRule="evenodd"
                      d="M10 1c-1.828 0-3.623.149-5.371.435a.75.75 0 00-.629.74v.387c-.827.157-1.642.345-2.445.564a.75.75 0 00-.552.698 5 5 0 004.503 5.152 6 6 0 002.946 1.822A6.451 6.451 0 017.768 13H7.5A1.5 1.5 0 006 14.5V17h-.75C4.56 17 4 17.56 4 18.25c0 .414.336.75.75.75h10.5a.75.75 0 00.75-.75c0-.69-.56-1.25-1.25-1.25H14v-2.5a1.5 1.5 0 00-1.5-1.5h-.268a6.453 6.453 0 01-.684-2.202 6 6 0 002.946-1.822 5 5 0 004.503-5.152.75.75 0 00-.552-.698A31.804 31.804 0 0016 2.562v-.387a.75.75 0 00-.629-.74A33.227 33.227 0 0010 1zM2.525 4.422C3.012 4.3 3.504 4.19 4 4.09V5c0 .74.134 1.448.38 2.103a3.503 3.503 0 01-1.855-2.68zm14.95 0a3.503 3.503 0 01-1.854 2.68C15.866 6.449 16 5.74 16 5v-.91c.496.099.988.21 1.475.332z"
                      clipRule="evenodd"
                    />
                  </svg>

                  <span>Leaderboard</span>
                </div>
              }>
              <Leaderboard />
            </Tab>
          </Tabs>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
