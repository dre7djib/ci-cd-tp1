import { supabase } from "../config/db";

export type Product = {
  id: number;
  name: string | null;
  price: number | null;
};

export const resetProducts = async (): Promise<void> => {
  await supabase.from("product").delete().gte("id", 0);
};

export const createProduct = async (
  name: string,
  price: number
): Promise<Product> => {
  const { data, error } = await supabase
    .from("product")
    .insert({ name, price })
    .select()
    .single();
  if (error) throw error;
  return data as Product;
};

export const getProduct = async (id: number): Promise<Product | undefined> => {
  const { data, error } = await supabase
    .from("product")
    .select("*")
    .eq("id", id)
    .single();
  if (error) {
    if (error.code === "PGRST116") return undefined;
    throw error;
  }
  return data as Product;
};

export const getAllProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase.from("product").select("*");
  if (error) throw error;
  return (data ?? []) as Product[];
};

export const updateProduct = async (
  id: number,
  name?: string,
  price?: number
): Promise<Product | undefined> => {
  const updates: Partial<{ name: string; price: number }> = {};
  if (name !== undefined) updates.name = name;
  if (price !== undefined) updates.price = price;
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
  return data as Product;
};

export const deleteProduct = async (id: number): Promise<boolean> => {
  const { data, error } = await supabase
    .from("product")
    .delete()
    .eq("id", id)
    .select("id");
  if (error) throw error;
  return (data?.length ?? 0) > 0;
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
