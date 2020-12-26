export interface ProductModelServer{
    id: number;
    name: string;
    category: string;
    description: string;
    short_desc: string;
    price: number;
    quantity: number;
    image: string;
    images: string;
}

export interface ProductsServerResponse{
    count: number;
    products: ProductModelServer[];
}