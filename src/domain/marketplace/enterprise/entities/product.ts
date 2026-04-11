import { UniqueEntityId } from "@/core/unique-entity-id";
import { Optional } from "@/core/types/optional";
import { ProductCategory } from "../value-objects/product-category";
import { ProductSpecs, SpecInput } from "../value-objects/product-specs";
import { AggregateRoot } from "@/core/entities/aggregate-root";
import { ProductAttachmentList } from "../entities/product-attachment-list"
import { ProductAttachment } from "./product-attachment";

export interface ProductProps {
   id?: UniqueEntityId;
   authorId: UniqueEntityId;
   name: string;
   attachments: ProductAttachmentList
   price: number;
   stock: number;
   description: string;
   category: ProductCategory;
   specs: ProductSpecs;
   createdAt: Date;
}

export class Product extends AggregateRoot<ProductProps> {

   get authorId() {
      return this.props.authorId
   }

   get name() {
      return this.props.name
   }

   set name(newName: string) {
      this.props.name = newName
   }

   get price() {
      return this.props.price
   }

   set price(newPrice: number) {
      this.props.price = newPrice
   }

   get stock() {
      return this.props.stock
   }

   set stock(newStockNumber: number) {
      this.props.stock = newStockNumber
   }

   get description() {
      return this.props.description
   }

   set description(newDescription: string) {
      this.props.description = newDescription
   }

   get category() {
      return this.props.category
   }

   get specs() {
      return this.props.specs
   }

   get attachments() {
      return this.props.attachments
   }

   set attachments(newAttachments: ProductAttachmentList) {
      this.props.attachments = newAttachments
   }

   updateCategoryAndSpecs(specs?: SpecInput, category?: string) {
      if (category) {
         this.props.category = ProductCategory.create(category)
      }

      if (specs) {
         this.props.specs = ProductSpecs.create(specs, this.props.category.value)
      }
   }

   updateAttachments(currentAttachments: ProductAttachment[], attachmentsIds: string[], productId: UniqueEntityId) {
      const productAttachmentsList = new ProductAttachmentList(currentAttachments)

      const productAttachments = attachmentsIds.map((attachmentId) => {
         return ProductAttachment.create({
            attachmentId: new UniqueEntityId(attachmentId),
            productId: productId
         })
      })

      productAttachmentsList.update(productAttachments)
      this.props.attachments = productAttachmentsList
   }

   get createdAt() {
      return this.props.createdAt
   }

   static create(props: Optional<ProductProps, 'createdAt' | 'attachments'>, id?: UniqueEntityId) {
      const hardware = new Product({
         ...props,
         createdAt: props.createdAt ?? new Date(),
         attachments: props.attachments ?? new ProductAttachmentList()
      }, id)

      return hardware
   }
}