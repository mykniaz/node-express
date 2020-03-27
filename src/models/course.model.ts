import {Schema, model, Document} from 'mongoose';
import {IUserDocument} from './user.model';

export interface ICourseDocument extends Document {
  title: string,
  price: number,
  img: string,
  userId: IUserDocument | string,
}

const courseSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  img: {
    type: String,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }
});

courseSchema.method('toClient', function () {
  const course = this.toObject();

  course.id = course._id;
  delete course._id;

  return course;
});

export default model<ICourseDocument>('Course', courseSchema);
