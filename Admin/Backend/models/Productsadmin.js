const mongoose = require("mongoose");

// تعريف سكيما المناظرات
const productSchema = new mongoose.Schema({
  title: { type: String, required: true }, // عنوان المناظرة
  description: { type: String, required: true }, // وصف المناظرة
  video_path: { type: String, required: true }, // مسار الفيديو المخزن محليًا
  category: {
    type: String,
    required: true,
    enum: ["ثقافي", "اجتماعي", "سياسي"],
  }, // التصنيف
  created_at: { type: Date, default: Date.now }, // تاريخ الإنشاء
  is_delete: { type: Boolean, default: false }, // إمكانية الحذف من قبل النظام
  isApproved: { type: Boolean, default: true }, // موافقة المسؤول على المناظرة
  isDeletedAdmin: { type: Boolean, default: false }, // تم الحذف من قبل الإداري
  admin_id: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" }, // مرجع إلى الإداري
});

module.exports = mongoose.model("Product", productSchema);
