import { useQuery } from "@tanstack/react-query";
import { fetchHistory, fetchSources } from "@/services/bff";

export function useSourcesQuery() {
  return useQuery({
    queryKey: ["sources"],
    queryFn: fetchSources,
  });
}

export function useHistoryQuery() {
  return useQuery({
    queryKey: ["history"],
    queryFn: fetchHistory,
  });
}
