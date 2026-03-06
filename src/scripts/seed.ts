import { supabase } from "../config/db";
import { productsData } from "../seed/products.data";

async function seed(): Promise<void> {
  const { data, error } = await supabase
    .from("product")
    .insert(productsData)
    .select("id");

  if (error) {
    console.error("Seed failed:", error.message);
    process.exit(1);
  }

  console.log(`Successfully inserted ${data?.length ?? 0} products`);
}

seed();
