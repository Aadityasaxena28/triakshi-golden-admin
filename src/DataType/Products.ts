export interface ProductsType {
  id: string;
  name: string;
  price: number;
  quantity: number;
  discount: number;
  images: string[];
  image: string;
  availability: boolean;
  description: string;
  category: string;
  rating: number;
  type: string;
  benefits: string[];
}


export function data_to_product(data: any): Products {
  return {
    id: data._id,
    name: data.name,
    price: Number(data.price),
    quantity: Number(data.quantity),
    discount: Number(data.discount) || 0,
    images: Array.isArray(data.images) ? data.images : [],
    image: data.image || "",
    availability: data.availability ?? true,
    description: (data.description ?? "").trim(),
    category: (data.category ?? "general").trim(),
    rating: Number(data.rating) ?? 5,
    type: (data.type ?? "precious:moti").trim(),
    benefits: Array.isArray(data.benefits) ? data.benefits : [],
  };
}
