import { Category } from "./category";

export interface Product {
    name:          string;
    enterpriseId:  string;
    description:   string;
    image:         string;
    purchasePrice: number;
    salePrice:     number;
    unitId:        string;
    categoryId:    string;
    isActive:      boolean;
    code:          string;
    stock:         number;
    createdAt:     string;
    id:            string;
    category:      Category;
}

export interface PayloadProduct {
    name:          string;
    description:   string;
    purchasePrice: number;
    salePrice:     number;
    unitId:        string;
    categoryId:    string;
}
