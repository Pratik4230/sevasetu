import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
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
import {
  createBookingSchema,
  type CreateBookingInput,
} from "../schemas/create-booking.schema";
import { useCreateBooking } from "../hooks/useCreateBooking";
import { providerDiscoveryService } from "@/features/customer/providers/services/provider-discovery.service";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { PageHeader } from "@/shared/components/PageHeader";

export function CreateBookingPage() {
  const navigate = useNavigate();
  const createMutation = useCreateBooking();
  const [attachment, setAttachment] = useState<File | undefined>();
  const [city, setCity] = useState("");
  const [area, setArea] = useState("");
  const debouncedCity = useDebounce(city, 400);
  const debouncedArea = useDebounce(area, 400);

  const { data: categories = [] } = useQuery({
    queryKey: ["service-categories"],
    queryFn: providerDiscoveryService.getCategories,
  });

  const form = useForm<CreateBookingInput>({
    resolver: zodResolver(createBookingSchema),
    defaultValues: {
      providerId: "",
      serviceCategoryId: "",
      address: { street: "", city: "", area: "" },
      scheduledAt: "",
      notes: "",
    },
  });
  const selectedCategory = form.watch("serviceCategoryId");

  const { data: providersResult } = useQuery({
    queryKey: ["providers", debouncedCity, debouncedArea, selectedCategory],
    queryFn: () =>
      providerDiscoveryService.browse({
        city: debouncedCity || undefined,
        area: debouncedArea || undefined,
        categoryId: selectedCategory || undefined,
      }),
  });

  const providers = providersResult?.providers ?? [];

  const selectedProvider = useMemo(
    () => providers.find((p) => p.userId._id === form.watch("providerId")),
    [providers, form]
  );

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <PageHeader
        title="Create Booking"
        subtitle="Choose the right professional and schedule your service in minutes."
      />

      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
        <Input value={city} onChange={(e) => setCity(e.target.value)} placeholder="Filter city" />
        <Input value={area} onChange={(e) => setArea(e.target.value)} placeholder="Filter area" />
      </div>

      <Form {...form}>
        <form
          className="space-y-3 rounded-2xl border border-emerald-200/70 bg-white/85 p-5 shadow-sm"
          onSubmit={form.handleSubmit((values) =>
            createMutation.mutate(
              { data: values, file: attachment },
              { onSuccess: () => navigate("/customer/bookings") }
            )
          )}
        >
          <FormField
            control={form.control}
            name="providerId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Provider</FormLabel>
                <FormControl>
                  <select
                    className="h-8 w-full rounded-md border px-2 text-sm"
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                  >
                    <option value="">Select provider</option>
                    {providers.map((p) => (
                      <option key={p.userId._id} value={p.userId._id}>
                        {p.userId.name} - {p.city}, {p.area} ({p.avgRating?.toFixed(1) ?? "0.0"}★)
                      </option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="serviceCategoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Service Category</FormLabel>
                <FormControl>
                  <select
                    className="h-8 w-full rounded-md border px-2 text-sm"
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                  >
                    <option value="">Select category</option>
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name} {c.basePrice ? `(~₹${c.basePrice})` : ""}
                      </option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {selectedProvider && (
            <p className="text-xs text-muted-foreground">
              Selected provider offers:{" "}
              {selectedProvider.serviceCategories.map((c) => c.name).join(", ")}
            </p>
          )}

          <FormField
            control={form.control}
            name="address.street"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Street Address</FormLabel>
                <FormControl>
                  <Input placeholder="Street address" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            <FormField
              control={form.control}
              name="address.city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Booking City</FormLabel>
                  <FormControl>
                    <Input placeholder="City" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address.area"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Booking Area</FormLabel>
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
            name="scheduledAt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preferred Date & Time</FormLabel>
                <FormControl>
                  <input
                    type="datetime-local"
                    className="h-8 w-full rounded-md border px-2 text-sm"
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes (Optional)</FormLabel>
                <FormControl>
                  <textarea
                    className="min-h-24 w-full rounded-md border px-3 py-2 text-sm"
                    placeholder="Any special instructions"
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormItem>
            <FormLabel>Attachment (Optional)</FormLabel>
            <FormControl>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setAttachment(e.target.files?.[0])}
              />
            </FormControl>
          </FormItem>

          <Button type="submit" disabled={createMutation.isPending}>
            {createMutation.isPending ? "Creating..." : "Create Booking"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
