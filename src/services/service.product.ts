import { supabase } from "../config/db";
import {
  cacheDelKeys,
  cacheDelPattern,
  cacheGetJson,
  cacheSetJson,
} from "../config/redis";

export type Product = {
  id: number;
  name: string | null;
  price: number | null;
  description: string | null;
};

const CACHE_PREFIX = "cache:product";
const CACHE_TTL_SEC = 300;

const cacheKeys = {
  item: (id: number) => `${CACHE_PREFIX}:item:${id}`,
  list: () => `${CACHE_PREFIX}:list`,
};

async function invalidateProductListCache(): Promise<void> {
  await cacheDelKeys(cacheKeys.list());
}

async function invalidateProductItemCache(id: number): Promise<void> {
  await cacheDelKeys(cacheKeys.item(id));
}

async function invalidateAllProductCache(): Promise<void> {
  await cacheDelPattern(`${CACHE_PREFIX}:item:*`);
  await cacheDelKeys(cacheKeys.list());
}

export const resetProducts = async (): Promise<void> => {
  await supabase.from("product").delete().gte("id", 0);
  await invalidateAllProductCache();
};

export const createProduct = async (
  name: string,
  price: number,
  description?: string | null
): Promise<Product> => {
  const { data, error } = await supabase
    .from("product")
    .insert({ name, price, description: description ?? null })
    .select()
    .single();
  if (error) throw error;
  const product = data as Product;
  await invalidateProductListCache();
  return product;
};

export const getProduct = async (id: number): Promise<Product | undefined> => {
  const cached = await cacheGetJson<Product>(cacheKeys.item(id));
  if (cached) return cached;

  const { data, error } = await supabase
    .from("product")
    .select("*")
    .eq("id", id)
    .single();
  if (error) {
    if (error.code === "PGRST116") return undefined;
    throw error;
  }
  const product = data as Product;
  await cacheSetJson(cacheKeys.item(id), product, CACHE_TTL_SEC);
  return product;
};

export const getAllProducts = async (): Promise<Product[]> => {
  const cached = await cacheGetJson<Product[]>(cacheKeys.list());
  if (cached) return cached;

  const { data, error } = await supabase.from("product").select("*");
  if (error) throw error;
  const products = (data ?? []) as Product[];
  await cacheSetJson(cacheKeys.list(), products, CACHE_TTL_SEC);
  return products;
};

export const updateProduct = async (
  id: number,
  name?: string,
  price?: number,
  description?: string | null
): Promise<Product | undefined> => {
  const updates: Partial<{ name: string; price: number; description: string | null }> =
    {};
  if (name !== undefined) updates.name = name;
  if (price !== undefined) updates.price = price;
  if (description !== undefined) updates.description = description;
  if (Object.keys(updates).length === 0) {
    return getProduct(id);
  }
  const { data, error } = await supabase
    .from("product")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  if (error) {
    if (error.code === "PGRST116") return undefined;
    throw error;
  }
  const product = data as Product;
  await invalidateProductItemCache(id);
  await invalidateProductListCache();
  return product;
};

export const deleteProduct = async (id: number): Promise<boolean> => {
  const { data, error } = await supabase
    .from("product")
    .delete()
    .eq("id", id)
    .select("id");
  if (error) throw error;
  const deleted = (data?.length ?? 0) > 0;
  if (deleted) {
    await invalidateProductItemCache(id);
    await invalidateProductListCache();
  }
  return deleted;
};

export const getAverageProductPrice = async (): Promise<number> => {
  const allProducts = await getAllProducts();
  const withPrice = allProducts.filter((p) => p.price != null);
  if (withPrice.length === 0) return 0;
  return (
    withPrice.reduce((acc, curr) => acc + (curr.price ?? 0), 0) /
    withPrice.length
  );
};
