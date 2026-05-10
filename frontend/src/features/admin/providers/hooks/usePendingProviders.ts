import { useQuery } from "@tanstack/react-query";
import { adminProviderService } from "../services/admin-provider.service";

export const usePendingProviders = () =>
  useQuery({
    queryKey: ["admin-pending-providers"],
    queryFn: adminProviderService.getPending,
  });
