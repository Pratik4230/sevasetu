import { Button } from "@/components/ui/button";
import type { User } from "@/shared/types/user.types";
import { useDeactivateUser } from "../hooks/useDeactivateUser";

interface Props {
  users: User[];
}

export function UserTable({ users }: Props) {
  const deactivateMutation = useDeactivateUser();

  return (
    <div className="rounded-md border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left">
            <th className="p-2">Name</th>
            <th className="p-2">Email</th>
            <th className="p-2">Role</th>
            <th className="p-2">Active</th>
            <th className="p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id} className="border-b">
              <td className="p-2">{u.name}</td>
              <td className="p-2">{u.email}</td>
              <td className="p-2">{u.role}</td>
              <td className="p-2">{u.isActive ? "Yes" : "No"}</td>
              <td className="p-2">
                <Button
                  size="sm"
                  variant="destructive"
                  disabled={!u.isActive || deactivateMutation.isPending}
                  onClick={() => deactivateMutation.mutate(u._id)}
                >
                  Deactivate
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
