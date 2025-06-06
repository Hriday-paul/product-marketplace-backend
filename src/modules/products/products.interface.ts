export interface IProduct {
    title: string;
    category: "propertie" | "car" | "boat" | "motorcycle" | "bicycle" | "job" | "book" | "furniture" | "electronic" | "cloth",
    condition: "new" | "used"
    images: string[],
    brand: string,
    price: number,
    discounted_price: number,
    stock: number,
    details: string,
    lat: number,
    long: number,
    isBoosted: boolean,
    isDeleted: boolean
}