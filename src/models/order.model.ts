import {Schema, model, Document} from 'mongoose';
import {ICourseDocument} from './course.model';

export interface IOrderDocument extends Document {
  userId: any;
  courses: Array<{
    count: number;
    courseId: ICourseDocument | string;
  }>
}

const orderSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  courses: [
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
  ]
});

export default model<IOrderDocument>('Order', orderSchema);
