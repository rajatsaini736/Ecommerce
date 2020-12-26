export interface CategoryServerModel{
    id: number;
    title: string;
    description: string;
}

export interface CategoryServerResponse{
    count: number;
    categories: CategoryServerModel[];
}