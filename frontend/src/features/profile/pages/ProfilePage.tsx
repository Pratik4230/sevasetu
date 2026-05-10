import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { profileService } from "../services/profile.service";
import { useAuthStore } from "@/shared/stores/auth.store";
import { PageHeader } from "@/shared/components/PageHeader";

export function ProfilePage() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const token = useAuthStore((s) => s.token);
  const { data: user, isLoading } = useQuery({
    queryKey: ["me"],
    queryFn: profileService.getMe,
  });

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [avatar, setAvatar] = useState<File | undefined>();

  const updateMutation = useMutation({
    mutationFn: () => profileService.updateMe({ name: name || undefined, phone: phone || undefined, avatar }),
    onSuccess: (updated) => {
      if (token) setAuth(updated, token);
      setName("");
      setPhone("");
      setAvatar(undefined);
      toast.success("Profile updated");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message ?? "Failed to update profile");
    },
  });

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading profile...</p>;
  if (!user) return <p className="text-sm text-red-600">Unable to load profile.</p>;

  return (
    <div className="space-y-4">
      <PageHeader
        title="My Profile"
        subtitle="Maintain your personal details and brand identity."
      />
      <Card className="border-emerald-200/80 bg-white/90 shadow-sm">
        <CardHeader>
          <CardTitle className="text-emerald-900">Account Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">Role: {user.role}</p>
          <p className="text-sm text-muted-foreground">Email: {user.email}</p>
          <Input
            placeholder={`Name (${user.name})`}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            placeholder={`Phone (${user.phone ?? "not set"})`}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <input type="file" accept="image/*" onChange={(e) => setAvatar(e.target.files?.[0])} />
          <Button disabled={updateMutation.isPending} onClick={() => updateMutation.mutate()}>
            {updateMutation.isPending ? "Saving..." : "Update Profile"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
