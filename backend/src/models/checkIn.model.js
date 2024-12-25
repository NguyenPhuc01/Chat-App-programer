import mongoose from "mongoose";

const checkInSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }, // Liên kết với bảng User
    date: { type: Date, default: Date.now },
    checkInTime: { type: Date, required: true },
    checkOutTime: { type: Date },
    location: { type: String, required: true },
    totalHours: { type: Number, required: true }, // Số giờ làm việc
  },
  {
    timestamps: true, // Tự động thêm createdAt, updatedAt
  }
);

const CheckIn = mongoose.model("CheckIn", checkInSchema);
export default CheckIn;
