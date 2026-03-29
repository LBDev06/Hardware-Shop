import { Entity } from "@/core/entity";
import { UniqueEntityId } from "@/core/unique-entity-id";
import { Optional } from "@/core/types/optional";
import { ProductCategory } from "../value-objects/product-category";
import { ProductSpecs } from "../value-objects/product-specs";

 export interface ProductProps{
  id?:UniqueEntityId;
  name: string;
  price: number;
  stock: number;
  description: string;
  category: ProductCategory;
  specs:ProductSpecs;
  createdAt: Date;
}

export class Product extends Entity<ProductProps>{

  static create(props: Optional<ProductProps, 'createdAt'>, id?: UniqueEntityId){
     const hardware = new Product({
      ...props,
      createdAt: props.createdAt ?? new Date()
     }, id)

     return hardware
  }
}