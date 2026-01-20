import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const MAX_FILES = 5;
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const productSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  price: z.number().min(0, "Price must be positive"),
  quantity: z.number().int().min(0, "Quantity must be non-negative"),
  type: z.string().min(1, "Type is required"),
  category: z.string().optional(),
  description: z.string().optional(),
  discount: z.number().int().min(0).max(100).optional(),
  availability: z.boolean(),
  Weight: z.number().min(0).optional(),
  image: z
    .array(z.instanceof(File))
    .max(3, "You can upload up to 3 images")
    .refine(
      (files) => files.every((file) => ACCEPTED_IMAGE_TYPES.includes(file.type)),
      "Only JPG, JPEG, PNG, or WebP images are allowed"
    )
    .refine(
      (files) => files.every((file) => file.size <= MAX_FILE_SIZE),
      "Each image must be below 5MB"
    ),
  benefits: z.array(z.string()).optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ImagePreview {
  url: string;
  file?: File;
  existingUrl?: string; // For existing images from server
}

interface ProductFormProps {
  initialData?: Partial<ProductFormData> & { existingImages?: string[] };
  onSubmit: (data: ProductFormData & { benefits:[string]; toDelete: string[] }) => void;
  isLoading?: boolean;
}

export function ProductForm({ initialData, onSubmit, isLoading }: ProductFormProps) {
  const [benefits, setBenefits] = useState<string[]>(
    initialData?.benefits
  );
  const [benefitInput, setBenefitInput] = useState("");
  const [imagePreviews, setImagePreviews] = useState<ImagePreview[]>([]);
  const [toDelete, setToDelete] = useState<string[]>([]);

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: initialData?.name || "",
      price: initialData?.price || 0,
      quantity: initialData?.quantity || 0,
      type: initialData?.type || "",
      category: initialData?.category || "",
      description: initialData?.description || "",
      discount: initialData?.discount || 0,
      availability: initialData?.availability ?? true,
      Weight: Number(initialData?.Weight)||0,
      benefits: initialData?.benefits ||[],
      image: [],
    },
  });

  // Initialize existing images
  useEffect(() => {
    if (initialData?.existingImages && initialData.existingImages.length > 0) {
      const existingPreviews = initialData.existingImages.map((url) => ({
        url,
        existingUrl: url,
      }));
      setImagePreviews(existingPreviews);
    }
  }, [initialData?.existingImages]);

  const addBenefit = () => {
    if (benefitInput.trim()) {
      setBenefits([...benefits, benefitInput.trim()]);
      setBenefitInput("");
    }
  };

  const removeBenefit = (index: number) => {
    setBenefits(benefits.filter((_, i) => i !== index));
  };

  const handleImageChange = (files: File[]) => {
    const availableSlots = MAX_FILES - imagePreviews.length;
    const limitedFiles = files.slice(0, availableSlots);

    const newPreviews = limitedFiles.map((file) => ({
      url: URL.createObjectURL(file),
      file,
    }));

    // Add new previews to existing ones
    setImagePreviews([...imagePreviews, ...newPreviews]);
    
    // Update form with all new files (existing + newly added)
    const allNewFiles = [
      ...imagePreviews.filter((p) => p.file).map((p) => p.file as File),
      ...limitedFiles
    ];
    form.setValue("image", allNewFiles);
  };

  const removeImage = (index: number) => {
    const imageToRemove = imagePreviews[index];

    // If it's an existing image, add to delete list
    if (imageToRemove.existingUrl) {
      setToDelete([...toDelete, imageToRemove.existingUrl]);
    } else {
      // Revoke object URL to prevent memory leaks
      URL.revokeObjectURL(imageToRemove.url);
    }

    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setImagePreviews(newPreviews);

    // Update form with only new files
    const newFiles = newPreviews
      .filter((p) => p.file)
      .map((p) => p.file as File);
    form.setValue("image", newFiles);
  };

  const handleSubmit = (data: ProductFormData) => {
    // Validate that we have at least one image (existing or new)
    if (imagePreviews.length === 0) {
      form.setError("image", {
        type: "manual",
        message: "At least one image is required"
      });
      return;
    }

    onSubmit({
      ...data,
      benefits: benefits,
      toDelete,
    });
  };

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      imagePreviews.forEach((preview) => {
        if (!preview.existingUrl) {
          URL.revokeObjectURL(preview.url);
        }
      });
    };
  }, []);

  return (
    <Form {...form}>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>General Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Ruby Gemstone" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price (₹) *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="Weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Weight</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Product Images (max 3, max size 5MB each)
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      multiple
                      disabled={imagePreviews.length >= MAX_FILES}
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        handleImageChange(files);
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    {imagePreviews.length}/{MAX_FILES} images uploaded
                  </FormDescription>

                  {/* Image Previews */}
                  {imagePreviews.length > 0 && (
                    <div className="mt-4 grid grid-cols-3 gap-4">
                      {imagePreviews.map((preview, idx) => (
                        <div
                          key={idx}
                          className="relative group aspect-square rounded-lg overflow-hidden border-2 border-border bg-muted"
                        >
                          <img
                            src={preview.url}
                            alt={`Preview ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(idx)}
                            className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/90"
                          >
                            <X className="h-4 w-4" />
                          </button>
                          {preview.existingUrl && (
                            <div className="absolute bottom-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                              Existing
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Classification</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type *</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Gemstone, Yantra" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Precious Stones" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the product..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <FormLabel>Benefits</FormLabel>
              <FormDescription>
                Add benefits one at a time. They will be stored as a comma-separated list.
              </FormDescription>
              <div className="flex gap-2">
                <Input
                  placeholder="Add a benefit..."
                  value={benefitInput}
                  onChange={(e) => setBenefitInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addBenefit())}
                />
                <Button type="button" onClick={addBenefit} variant="secondary">
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {benefits?.map((benefit, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-1 bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm"
                  >
                    {benefit}
                    <button
                      type="button"
                      onClick={() => removeBenefit(index)}
                      className="hover:bg-secondary-foreground/10 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Inventory & Meta</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="discount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Discount (%)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0"
                      min="0"
                      max="100"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="availability"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border border-border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Availability</FormLabel>
                    <FormDescription>
                      Is this product currently in stock?
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => window.history.back()}>
            Cancel
          </Button>
          <Button 
            type="button" 
            disabled={isLoading} 
            className="bg-gradient-saffron"
            onClick={form.handleSubmit(handleSubmit)}
          >
            {isLoading ? "Saving..." : "Save Product"}
          </Button>
        </div>
      </div>
    </Form>
  );
}