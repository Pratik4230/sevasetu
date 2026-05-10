import { useQuery } from "@tanstack/react-query";
import { providerDiscoveryService } from "../services/provider-discovery.service";

export const useProviders = (params?: {
  city?: string;
  area?: string;
  categoryId?: string;
}) =>
  useQuery({
    queryKey: ["providers", params],
    queryFn: () => providerDiscoveryService.browse(params),
  });
