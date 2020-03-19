import {Schema, model} from 'mongoose';

const ordersSchema = new Schema({
  items: [
    {
      totalPrice: {
        type: String,
        required: true,
      }
    }
  ]
});

export default model('Orders', ordersSchema);
