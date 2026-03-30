import { Entity } from "@/core/entity";
import { UniqueEntityId } from "@/core/unique-entity-id";
import { Optional } from "@/core/types/optional";
import { ProductCategory } from "../value-objects/product-category";
import { ProductSpecs } from "../value-objects/product-specs";

 export interface ProductProps{
  id?:UniqueEntityId;
  authorId: UniqueEntityId;
  name: string;
  price: number;
  stock: number;
  description: string;
  category: ProductCategory;
  specs:ProductSpecs;
  createdAt: Date;
}

export class Product extends Entity<ProductProps>{
   
   get authorId(){
      return this.props.authorId
   }

   get name(){
    return this.props.name
   }

   set name(newName: string){
      this.props.name = newName
   }

   get price(){
    return this.props.price
   }

   set price(newPrice: number){
    this.props.price = newPrice
   }

   get stock(){
      return this.props.stock
   }

   set stock(newStockNumber: number){
    this.props.stock = newStockNumber
   }

   get description(){
      return this.props.description
   }

   set description(newDescription: string){
      this.props.description = newDescription
   }
   
    get category(){
      return this.props.category
   }

   set category(newCategory:ProductCategory){
      this.props.category = newCategory
   }

   get specs(){
      return this.props.specs
   }
   
   set specs(newSpecs: ProductSpecs){
      this.props.specs = newSpecs
   }

  static create(props: Optional<ProductProps, 'createdAt'>, id?: UniqueEntityId){
     const hardware = new Product({
      ...props,
      createdAt: props.createdAt ?? new Date()
     }, id)

     return hardware
  }
}