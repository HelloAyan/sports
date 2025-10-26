import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function useSportsData<T>(endpoint: string, refreshInterval = 60000) {
  const { data, error, isValidating } = useSWR<T>(endpoint, fetcher, {
    refreshInterval,
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
  })

  return {
    data,
    isLoading: !error && !data,
    isError: error,
    isValidating,
  }
}
