import { PendingProviderCard } from "../components/PendingProviderCard";
import { usePendingProviders } from "../hooks/usePendingProviders";
import { PageHeader } from "@/shared/components/PageHeader";

export function PendingProvidersPage() {
  const { data, isLoading } = usePendingProviders();

  return (
    <div className="mx-auto max-w-5xl space-y-4">
      <PageHeader
        title="Pending Providers"
        subtitle="Review and approve professionals to maintain service quality."
      />
      {isLoading && <p className="text-sm text-muted-foreground">Loading...</p>}
      {!isLoading && data?.providers.length === 0 && (
        <p className="text-sm text-muted-foreground">No pending providers.</p>
      )}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {data?.providers.map((provider) => (
          <PendingProviderCard key={provider._id} provider={provider} />
        ))}
      </div>
    </div>
  );
}
