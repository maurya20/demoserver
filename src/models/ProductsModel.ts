import {Schema,Document} from 'mongoose';
import mongoose from 'mongoose';

interface IProduct extends Document {
  name: string;
  price: any;
  image:any;
}
const productSchema : Schema = new mongoose.Schema({
    name:{ 
      type:String,
      required: true
     },
    price:{
      type:String,
      required:true
     },
    image:{
     type:String,
     required:true
     }
});
let ProductModel = mongoose.model<IProduct>('Product',productSchema);
export {ProductModel};