import { Schema, model, Document} from 'mongoose';
import {ICourseDocument} from './course.model';

export interface IUserDocument extends Document {
  email: string;
  name: string;
  cart: {
    items: Array<{
      count: number;
      courseId: ICourseDocument | string;
    }>
  }
  addToCart(course: ICourseDocument): IUserDocument
  removeFromCart(id: string): IUserDocument
  clearCart(): IUserDocument
}

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  cart: {
    items: [
      {
        count: {
          type: Number,
          required: true,
          default: 1,
        },
        courseId: {
          type: Schema.Types.ObjectId,
          ref: 'Course',
          required: true,
        },
      },
    ],
  },
});

userSchema.method('addToCart', function (course: ICourseDocument) {
  const items = [...this.cart.items];

  const index = items.findIndex(item => {
    return item.courseId.toString() === course._id.toString()
  });

  if (index >= 0) {
    items[index].count = items[index].count + 1
  } else {
    items.push({
      courseId: course._id,
      count: 1
    })
  }

  this.cart = {items};

  return this.save();
});

userSchema.methods.removeFromCart = function (id: string) {
  let items = [...this.cart.items];

  const index = items.findIndex(item => {
    return item.courseId.toString() === id;
  });

  if (items[index].count > 1) {
    items[index].count = items[index].count - 1;
  } else {
    items = items.filter((item) => item.courseId.toString() !== id);
  }

  this.cart = {items};

  return this.save();
};

userSchema.methods.clearCart = function () {
  this.cart = {items: []};

  return this.save();
};

export default model<IUserDocument>('User', userSchema);
