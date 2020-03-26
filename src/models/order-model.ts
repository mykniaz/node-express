import {Schema, model, Document} from 'mongoose';
import {ICourseModel} from './course-model';

export interface IOrderModel extends Document {
  userId: any;
  courses: Array<{
    count: number;
    courseId: ICourseModel | string;
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

export default model<IOrderModel>('Order', orderSchema);
