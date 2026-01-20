import { data_to_product, ProductsType } from '@/DataType/Products';
import api from './API';

export async function getProducts(page,count): Promise<ProductsType[]> {
  const params = new URLSearchParams();
  params.append("page",page.toString());
  params.append("productCount",count.toString());
  // ?${params.toString()}
  const resp = await api.get(`/products/products?${params.toString()}`);
  const payload = resp.data;

  if (!payload?.isOkay) {
    throw new Error(payload?.error || "Failed to fetch products");
  }

  if (!Array.isArray(payload.data)) {
    throw new Error("Invalid response format: expected product array");
  }
  // console.log(payload.data);
  return payload.data.map((d: any) => data_to_product(d));
}
export async function getProductsCount() {
  const resp = await api.get("/products/count");
  const payload = resp.data;
  if(!payload.success) return  Promise.reject("Failed to fetch products count.")
  return payload.count;
}

export async function AddProductAPI(params: FormData) {
  // console.log(params);
  const resp = await api.post("/products/add-product", params);
  return resp.data;
}

export async function updateProductAPI(data: FormData, id: string) {
  console.log(data)
  const resp = await api.put(`/products/products/${id}`, data, );

  const payload = resp.data;

  if (!payload.success) {
    return Promise.reject(payload.error || "Failed To Update Product");
  }

  return payload.data;
}


export async function getProductByIdAPI(id:string){
  const resp = await api.get(`/products/products/${id}`);
  const payload = resp.data;
  if(!payload.isOkay) return Promise.reject(`Failed To Fetch Product ${id}.`);

  return payload.data;
}


export async function deleteProduct(id:string) {
  const resp = await api.delete(`/products/products/${id}`);
  const payload = resp.data;
  if(!payload.success) return Promise.reject(`Failed To Fetch Product ${id}.`);

  return payload.success;
}