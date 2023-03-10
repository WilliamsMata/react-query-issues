import { useInfiniteQuery } from "@tanstack/react-query";
import { State, Issue } from "../interfaces";
import { sleep } from "../../helpers";
import { githubApi } from "../../api/githubApi";

interface Props {
  state?: State;
  labels: string[];
  page?: number;
}

interface QueryProps {
  queryKey: (string | Props)[];
  pageParam?: number;
}

const getIssues = async ({
  queryKey,
  pageParam = 1,
}: QueryProps): Promise<Issue[]> => {
  const [, , args] = queryKey;
  const { state, labels } = args as Props;

  // await sleep(2);

  //* Parámetros de la petición
  const params = new URLSearchParams();
  if (state) params.append("state", state);
  if (labels.length > 0) {
    const labelString = labels.join(",");
    params.append("labels", labelString);
  }
  params.append("page", pageParam.toString());
  params.append("per_page", "5");

  const { data } = await githubApi.get<Issue[]>("/issues", { params });
  return data;
};

export const useIssuesInfinite = ({ state, labels }: Props) => {
  const issuesQuery = useInfiniteQuery(
    ["issues", "infinite", { state, labels }],
    (data) => getIssues(data),
    {
      getNextPageParam: (lastPage, pages) => {
        if (lastPage.length < 5) return;

        return pages.length + 1;
      },
    }
  );

  return {
    issuesQuery,
  };
};
