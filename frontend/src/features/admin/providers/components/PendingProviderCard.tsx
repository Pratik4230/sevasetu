import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { PendingProvider } from "../services/admin-provider.service";
import { ApproveModal } from "./ApproveModal";

interface Props {
  provider: PendingProvider;
}

export function PendingProviderCard({ provider }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{provider.userId.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <p>Email: {provider.userId.email}</p>
        <p>Phone: {provider.userId.phone ?? "N/A"}</p>
        <p>
          Location: {provider.city}, {provider.area}
        </p>
        <p>Categories: {provider.serviceCategories.map((c) => c.name).join(", ") || "N/A"}</p>
        <p className="line-clamp-2 text-muted-foreground">{provider.bio}</p>
        <ApproveModal providerProfileId={provider._id} />
      </CardContent>
    </Card>
  );
}
