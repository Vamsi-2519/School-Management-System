// models/FeePayment.js
const mongoose = require("mongoose");

const feePaymentSchema = new mongoose.Schema(
  {
    studentFeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StudentFee",
      required: true
    },

    amountPaid: {
      type: Number,
      required: true
    },

    paymentMode: {
      type: String,
      enum: ["CASH", "UPI", "CARD", "ONLINE"],
      required: true
    },

    receiptNumber: {
      type: String,
      required: true,
      unique: true
    },

    paymentDate: {
      type: Date,
      default: Date.now
    },
    
    remarks: String,

    transactionId: {
      type: String,
      unique: true
    },
    collectedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    status: {
      type: String,
      enum: ["SUCCESS", "FAILED", "PENDING"],
      default: "SUCCESS"
    },
    lateFee: {
      type: Number,
      default: 0
    },
    discount: {
      type: Number,
      default: 0
    },
    academicYear: {
      type: String
    },
    verifiedAt: {
      type: Date
    },
    Schoolcode: {
      type: String
    },
    organizationId: {
      type: String,
      required: false
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("FeePayment", feePaymentSchema);
