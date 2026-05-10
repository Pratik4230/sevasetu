import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCreateCategory } from "../hooks/useCreateCategory";

export function CategoryForm() {
  const createMutation = useCreateCategory();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [iconUrl, setIconUrl] = useState("");

  return (
    <div className="space-y-2 rounded-md border p-3">
      <p className="text-sm font-medium">Create Category</p>
      <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
      <Input
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
      />
      <Input
        value={basePrice}
        onChange={(e) => setBasePrice(e.target.value)}
        type="number"
        placeholder="Base price (optional)"
      />
      <Input
        value={iconUrl}
        onChange={(e) => setIconUrl(e.target.value)}
        placeholder="Icon URL (optional)"
      />
      <Button
        disabled={createMutation.isPending || !name || !description}
        onClick={() =>
          createMutation.mutate(
            {
              name,
              description,
              iconUrl: iconUrl || undefined,
              basePrice: basePrice ? Number(basePrice) : undefined,
            },
            {
              onSuccess: () => {
                setName("");
                setDescription("");
                setBasePrice("");
                setIconUrl("");
              },
            }
          )
        }
      >
        {createMutation.isPending ? "Creating..." : "Create"}
      </Button>
    </div>
  );
}
