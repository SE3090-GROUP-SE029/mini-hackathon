const mongoose = require('mongoose');
const {
  SUBJECTS,
  EDUCATION_LEVELS,
  RESOURCE_TYPES,
  LANGUAGES,
  TITLE_MAX,
  DESCRIPTION_MAX,
  PROVIDER_MAX,
  UPLOADER_MAX,
} = require('../constants/resourceEnums');

const resourceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: TITLE_MAX,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: DESCRIPTION_MAX,
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
    resourceType: {
      type: String,
      required: true,
      enum: RESOURCE_TYPES,
    },
    language: {
      type: String,
      required: true,
      enum: LANGUAGES,
    },
    providerName: {
      type: String,
      trim: true,
      default: '',
      maxlength: PROVIDER_MAX,
    },
    uploadedBy: {
      type: String,
      trim: true,
      default: 'Anonymous contributor',
      maxlength: UPLOADER_MAX,
    },
    tags: {
      type: [String],
      default: [],
    },
    fileName: {
      type: String,
      required: true,
      trim: true,
    },
    fileType: {
      type: String,
      required: true,
      trim: true,
    },
    fileSize: {
      type: Number,
      required: true,
      min: 1,
    },
    fileHash: {
      type: String,
      required: true,
      index: true,
    },
    gridFsFileId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

resourceSchema.index({ createdAt: -1 });
resourceSchema.index({ subject: 1, educationLevel: 1, language: 1 });

resourceSchema.methods.toClient = function toClient() {
  const obj = this.toObject();
  const id = String(obj._id);

  return {
    _id: obj._id,
    id,
    title: obj.title,
    description: obj.description,
    subject: obj.subject,
    educationLevel: obj.educationLevel,
    level: obj.educationLevel,
    resourceType: obj.resourceType,
    type: obj.resourceType,
    language: obj.language,
    providerName: obj.providerName || '',
    provider: obj.providerName || '',
    uploadedBy: obj.uploadedBy,
    tags: obj.tags || [],
    fileName: obj.fileName,
    fileType: obj.fileType,
    fileSize: obj.fileSize,
    createdAt: obj.createdAt,
    updatedAt: obj.updatedAt,
    url: `/api/resources/${id}/file`,
  };
};

const Resource = mongoose.model('Resource', resourceSchema);

module.exports = Resource;
