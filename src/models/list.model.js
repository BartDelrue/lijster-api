import mongoose from 'mongoose';
import User from './user.model';

const Schema = mongoose.Schema;

// Create Schema
const ListSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  items: [
    {
      name: {
        type: String,
        required: true
      },
      description: {
        type: String
      }
    }
  ],
  public: {
    type: Boolean,
    default: false
  },
  publicUsername: {
    type: String
  },
  publicName: {
    type: String
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
});

ListSchema.pre('save', async function (next) {

  if (!this.publicName) {
    this.publicName = this.get('name')
  }
  if (!this.publicUsername) {
    try {
      const user = await User.findById(this.owner)
      this.publicUsername = user.username
    } catch (e) {

    }
  }
  next()
})

export default mongoose.model('List', ListSchema);

