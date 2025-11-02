
// function to format price to currency PEN
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN',
  }).format(price);
};