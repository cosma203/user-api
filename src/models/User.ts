import { Schema, model, Document, Model } from 'mongoose';

interface UserAttrs {
  email: string;
  givenName: string;
  familyName: string;
}

interface UserDoc extends Document {
  email: string;
  givenName: string;
  familyName: string;
}

interface UserModel extends Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    givenName: {
      type: String,
      required: true,
    },
    familyName: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

UserSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

const User = model<UserDoc, UserModel>('User', UserSchema);

export { User };
