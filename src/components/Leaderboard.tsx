import {
  Pagination,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  User,
} from "@nextui-org/react";
import authState from "../atoms/auth";
import { useRecoilValue } from "recoil";
import useSWR from "swr";
import { ILeaderboardMember } from "../types";
import { useMemo, useState } from "react";

function Leaderboard() {
  const auth = useRecoilValue(authState);

  const [page, setPage] = useState(1);

  const { data: leaderboardData, isLoading: isLeaderboardLoading } = useSWR(
    `${import.meta.env.VITE_API}/info/leaderboard/${page}`,
    (url: string) =>
      fetch(url, {
        headers: {
          Authorization: auth.password,
        },
      }).then((res) => res.json())
  );

  const rowsPerPage = 8;

  const pages = useMemo(() => {
    return leaderboardData?.data?.count
      ? Math.ceil(leaderboardData?.data?.count / rowsPerPage)
      : 0;
  }, [leaderboardData?.data?.count, rowsPerPage]);

  return (
    <div className="mt-2">
      <h2 className="text-3xl font-semibold">Leaderboard</h2>

      <Table
        isStriped
        className="mt-6"
        bottomContent={
          pages > 0 ? (
            <div className="flex w-full justify-center">
              <Pagination
                isCompact
                showControls
                showShadow
                color="primary"
                page={page}
                total={pages}
                onChange={(page) => setPage(page)}
              />
            </div>
          ) : null
        }
        aria-label="Leaderboard Table">
        <TableHeader>
          <TableColumn>USER</TableColumn>
          <TableColumn>LEVEL</TableColumn>
          <TableColumn>XP</TableColumn>
          <TableColumn>MAX-XP</TableColumn>
        </TableHeader>
        <TableBody
          items={leaderboardData?.results ?? []}
          isLoading={isLeaderboardLoading}
          loadingContent={<Spinner />}>
          {leaderboardData?.data?.members?.map((member: ILeaderboardMember) => {
            return (
              <TableRow key={member.id}>
                <TableCell>
                  <User
                    name={member.username}
                    avatarProps={{
                      src: member.avatar,
                    }}
                  />
                  <TableCell>{member.username}</TableCell>
                </TableCell>
                <TableCell>{member.level}</TableCell>
                <TableCell>{member.xp}</TableCell>
                <TableCell>{member.maxXp}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

export default Leaderboard;
