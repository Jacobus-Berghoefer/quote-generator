import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcrypt';

// Interface defining the User document properties
interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  savedQuotes: Schema.Types.ObjectId[];
  // Method to check password during login
  isCorrectPassword(password: string): Promise<boolean>;
}

// Create the User schema
const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+@.+\..+/, 'Must use a valid email address'],
    },
    password: {
      type: String,
      required: true,
      minlength: [8, 'Password must be at least 8 characters long'],
    },
    savedQuotes: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Quote',
      },
    ],
  },
  {
    // Add virtual properties when converting to JSON
    toJSON: {
      virtuals: true,
    },
    // Add timestamps for createdAt and updatedAt
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (this.isNew || this.isModified('password')) {
    // Define salt rounds for bcrypt
    const saltRounds = 10;
    
    // Hash the password
    this.password = await bcrypt.hash(this.password, saltRounds);
  }
  
  next();
});

// Method to compare incoming password with hashed password
userSchema.methods.isCorrectPassword = async function (password: string): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

// Create and export the User model
export const User = model<IUser>('User', userSchema);