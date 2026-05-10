import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { providerDiscoveryService } from "@/features/customer/providers/services/provider-discovery.service";
import {
  useProviderProfile,
  useUpsertProviderProfile,
} from "../hooks/useProviderProfile";
import { useToggleAvailability } from "../hooks/useToggleAvailability";
import {
  providerProfileSchema,
  type ProviderProfileInput,
} from "../schemas/profile.schema";
import { PageHeader } from "@/shared/components/PageHeader";

export function MyProfilePage() {
  const { data: profile } = useProviderProfile();
  const { data: categories = [] } = useQuery({
    queryKey: ["service-categories"],
    queryFn: providerDiscoveryService.getCategories,
  });
  const upsertMutation = useUpsertProviderProfile();
  const toggleMutation = useToggleAvailability();

  const createMode = !profile;
  const form = useForm<ProviderProfileInput>({
    resolver: zodResolver(providerProfileSchema),
    defaultValues: {
      bio: "",
      city: "",
      area: "",
      experienceYears: 0,
      serviceCategories: [],
    },
  });

  useEffect(() => {
    if (profile) {
      form.reset({
        bio: profile.bio,
        city: profile.city,
        area: profile.area,
        experienceYears: profile.experienceYears ?? 0,
        serviceCategories: profile.serviceCategories?.map((c) => c._id) ?? [],
      });
    }
  }, [profile, form]);

  return (
    <div className="space-y-4">
      <PageHeader
        title="Provider Profile"
        subtitle="Showcase your expertise and keep availability up to date."
      />
      <Card className="border-emerald-200/80 bg-white/90 shadow-sm">
        <CardHeader>
          <CardTitle className="text-emerald-900">Professional Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {profile && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-3 text-sm">
              <p>Approval: <span className="font-medium capitalize">{profile.approvalStatus}</span></p>
              <p>Availability: <span className="font-medium">{profile.isAvailable ? "Available" : "Unavailable"}</span></p>
              <Button
                size="sm"
                className="mt-2"
                disabled={toggleMutation.isPending}
                onClick={() => toggleMutation.mutate()}
              >
                Toggle Availability
              </Button>
            </div>
          )}
          <Form {...form}>
            <form
              className="space-y-3"
              onSubmit={form.handleSubmit((values) => {
                const payload = providerProfileSchema.parse(values);
                upsertMutation.mutate({ ...payload, createMode });
              })}
            >
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Professional Bio</FormLabel>
                  <FormControl>
                    <textarea
                      className="min-h-24 w-full rounded-md border px-3 py-2 text-sm"
                      placeholder="Tell customers about your experience and skills"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input placeholder="City" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="area"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Area</FormLabel>
                    <FormControl>
                      <Input placeholder="Area" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="experienceYears"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Years of Experience</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      value={typeof field.value === "number" ? field.value : 0}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="serviceCategories"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service Categories</FormLabel>
                  <div className="flex flex-wrap gap-2 rounded-md border p-3">
                    {categories.map((c) => {
                      const selected = field.value.includes(c._id);
                      return (
                        <Button
                          key={c._id}
                          type="button"
                          size="sm"
                          variant={selected ? "default" : "outline"}
                          onClick={() => {
                            if (selected) {
                              field.onChange(field.value.filter((id) => id !== c._id));
                            } else {
                              field.onChange([...field.value, c._id]);
                            }
                          }}
                        >
                          {c.name}
                        </Button>
                      );
                    })}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

              <Button type="submit" disabled={upsertMutation.isPending}>
                {upsertMutation.isPending
                  ? "Saving..."
                  : createMode
                    ? "Create Profile"
                    : "Update Profile"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
