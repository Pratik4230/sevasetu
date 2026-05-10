import { useQuery } from "@tanstack/react-query";
import { adminUserService } from "../services/admin-user.service";

export const useAllUsers = () =>
  useQuery({
    queryKey: ["admin-users"],
    queryFn: adminUserService.getAll,
  });
