import { UserTable } from "../components/UserTable";
import { useAllUsers } from "../hooks/useAllUsers";
import { PageHeader } from "@/shared/components/PageHeader";

export function UsersPage() {
  const { data, isLoading } = useAllUsers();

  return (
    <div className="mx-auto max-w-5xl space-y-4">
      <PageHeader
        title="Users"
        subtitle="Monitor account health, roles, and security posture."
      />
      {isLoading && <p className="text-sm text-muted-foreground">Loading users...</p>}
      {!isLoading && data?.users.length === 0 && (
        <p className="text-sm text-muted-foreground">No users found.</p>
      )}
      {!!data?.users.length && <UserTable users={data.users} />}
    </div>
  );
}
