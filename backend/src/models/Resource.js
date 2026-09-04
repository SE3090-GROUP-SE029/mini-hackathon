const mongoose = require('mongoose');
const {
  SUBJECTS,
  EDUCATION_LEVELS,
  RESOURCE_TYPES,
  LANGUAGES,
} = require('../constants/resourceEnums');

const resourceSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: 180,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: 2000,
    },
    subject: {
      type: String,
      required: true,
      enum: SUBJECTS,
    },
    educationLevel: {
      type: String,
      required: true,
      enum: EDUCATION_LEVELS,
    },
    author: {
      type: String,
      trim: true,
      default: '',
    },
    provider: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      enum: RESOURCE_TYPES,
    },
    language: {
      type: String,
      required: true,
      enum: LANGUAGES,
    },
    tags: {
      type: [String],
      default: [],
    },
    uploadDate: {
      type: Date,
      required: true,
    },
    externalLink: {
      type: String,
      trim: true,
      default: '',
    },
    fileStorage: {
      type: String,
      enum: ['gridfs', 'disk', ''],
      default: '',
    },
    fileId: {
      type: String,
      default: '',
    },
    fileName: {
      type: String,
      default: '',
    },
    fileSize: {
      type: Number,
      default: 0,
    },
    fileMimeType: {
      type: String,
      default: '',
    },
    filePath: {
      type: String,
      default: '',
    },
    fileUrl: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

resourceSchema.index({ title: 'text', description: 'text', subject: 'text' });
resourceSchema.index({ subject: 1, educationLevel: 1, language: 1, type: 1 });

resourceSchema.set('toJSON', {
  transform(_doc, ret) {
    const formatted = { ...ret };
    formatted.uploadDate = ret.uploadDate
      ? new Date(ret.uploadDate).toISOString().slice(0, 10)
      : ret.uploadDate;
    delete formatted._id;
    delete formatted.createdAt;
    delete formatted.updatedAt;
    return formatted;
  },
});

module.exports = mongoose.model('Resource', resourceSchema);
