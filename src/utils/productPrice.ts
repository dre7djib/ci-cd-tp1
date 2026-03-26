/** Plafond métier (évite valeurs aberrantes / débordements côté stockage). */
export const MAX_PRODUCT_PRICE = 1_000_000_000;

export function isValidProductPrice(price: number): boolean {
  return (
    Number.isFinite(price) && price >= 0 && price <= MAX_PRODUCT_PRICE
  );
}
