import {Schema, model} from 'mongoose';

const orderSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'Users',
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

export default model('Order', orderSchema);
