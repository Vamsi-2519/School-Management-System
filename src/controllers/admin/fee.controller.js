const FeePayment = require('../../model/tenant/Fee');

/**
 * CREATE FEE PAYMENT
 */
exports.createFeePayment = async (req, res) => {
  try {
    const {
      studentFeeId,
      amountPaid,
      paymentMode,
      receiptNumber,
      paymentDate,
      remarks,
      transactionId,
      collectedBy,
      status,
      lateFee,
      discount,
      academicYear,
      verifiedAt
    } = req.body;

    const feePayment = await FeePayment.create({
      studentFeeId,
      amountPaid,
      paymentMode,
      receiptNumber,
      paymentDate,
      remarks,
      transactionId,
      collectedBy,
      status,
      lateFee,
      discount,
      academicYear,
      verifiedAt
    });

    return res.status(201).json({
      success: true,
      data: feePayment
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

/**
 * GET ALL FEE PAYMENTS (NO PAGINATION)
 */
exports.getAllFeePayments = async (req, res) => {
  try {
    const payments = await FeePayment.find()
      .populate('studentFeeId')
      .populate('collectedBy', 'name email')
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      total: payments.length,
      data: payments
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

/**
 * GET FEE PAYMENT BY ID
 */
exports.getFeePaymentById = async (req, res) => {
  try {
    const payment = await FeePayment.findById(req.params.id)
      .populate('studentFeeId')
      .populate('collectedBy', 'name email');

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Fee payment not found'
      });
    }

    return res.json({
      success: true,
      data: payment
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

/**
 * UPDATE FEE PAYMENT
 */
exports.updateFeePayment = async (req, res) => {
  try {
    const payment = await FeePayment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Fee payment not found'
      });
    }

    return res.json({
      success: true,
      data: payment
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

/**
 * DELETE FEE PAYMENT
 */
exports.deleteFeePayment = async (req, res) => {
  try {
    const payment = await FeePayment.findByIdAndDelete(req.params.id);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Fee payment not found'
      });
    }

    return res.json({
      success: true,
      message: 'Fee payment deleted successfully'
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
};
