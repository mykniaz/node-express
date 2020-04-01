import { Schema, model, Document} from 'mongoose';
import {ICourseDocument} from './course.model';

export type RegisterData = {
  name: string
  email: string,
  password: string,
}

type UserCart = {
  items: Array<{
    count: number;
    courseId: ICourseDocument | string;
  }>
}

interface IUser {
  email: string;
  name: string;
  password?: string;
  cart: UserCart
}

interface IUserMethods {
  register(registerData: RegisterData): IUserDocument;
  addToCart(course: ICourseDocument): IUserDocument;
  removeFromCart(id: string): IUserDocument;
  clearCart(): IUserDocument;
}

export interface IUserDocument extends IUser, IUserMethods, Document {}

const userSchema: Schema<IUserMethods> = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
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

userSchema.method('register', function (registerData: RegisterData) {
  const {name, email, password} = registerData;

  this.name = name;
  this.email = email;
  this.password = password;
  this.cart = {items: []};

  return this.save()
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

userSchema.method('removeFromCart', function (id: string) {
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
});

userSchema.method('clearCart',function () {
  this.cart = {items: []};

  return this.save();
});

export default model<IUserDocument>('User', userSchema);
