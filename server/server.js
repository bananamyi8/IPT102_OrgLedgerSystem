
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const memberSchema = new mongoose.Schema(
  {
    studentNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    section: {
      type: String,
      default: "",
      trim: true
    },
    totalDues: {
      type: Number,
      required: true,
      min: 0,
      default: 100
    }
  },
  { timestamps: true }
);

const paymentSchema = new mongoose.Schema(
  {
    member: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
      required: true
    },
    amount: {
      type: Number,
      required: true,
      min: 0.01
    },
    reference: {
      type: String,
      unique: true,
      required: true
    },
    paymentDate: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

const Member = mongoose.model("Member", memberSchema);
const Payment = mongoose.model("Payment", paymentSchema);

app.get("/api/health", (req, res) => {
  res.json({ message: "OrgLedger API is running." });
});

// Get members and calculate their balances.
app.get("/api/members", async (req, res) => {
  try {
    const search = (req.query.search || "").trim();

    const filter = search
      ? {
          $or: [
            { studentNumber: { $regex: search, $options: "i" } },
            { name: { $regex: search, $options: "i" } }
          ]
        }
      : {};

    const members = await Member.find(filter).sort({ name: 1 }).lean();

    const payments = await Payment.aggregate([
      {
        $group: {
          _id: "$member",
          paid: { $sum: "$amount" }
        }
      }
    ]);

    const paidByMember = new Map(
      payments.map((item) => [String(item._id), item.paid])
    );

    res.json(
      members.map((member) => {
        const paid = paidByMember.get(String(member._id)) || 0;
        const balance = Math.max(0, member.totalDues - paid);

        return {
          ...member,
          totalPaid: paid,
          balance,
          status: balance === 0 ? "Paid" : paid > 0 ? "Partial" : "Unpaid"
        };
      })
    );
  } catch (error) {
    res.status(500).json({ message: "Unable to retrieve members." });
  }
});

// Register a member.
app.post("/api/members", async (req, res) => {
  try {
    const studentNumber = String(req.body.studentNumber || "").trim();
    const name = String(req.body.name || "").trim();
    const section = String(req.body.section || "").trim();
    const totalDues = Number(req.body.totalDues);

    if (!studentNumber || !name) {
      return res.status(400).json({
        message: "Student number and name are required."
      });
    }

    if (
      req.body.totalDues === "" ||
      !Number.isFinite(totalDues) ||
      totalDues < 0
    ) {
      return res.status(400).json({
        message: "Total dues must be a valid non-negative amount."
      });
    }

    const member = await Member.create({
      studentNumber,
      name,
      section,
      totalDues
    });

    res.status(201).json(member);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "That student number already exists."
      });
    }

    res.status(500).json({ message: "Unable to add member." });
  }
});

// Edit member details.
app.put("/api/members/:id", async (req, res) => {
  try {
    const updates = {};
    if (req.body.studentNumber !== undefined) {
      updates.studentNumber = String(req.body.studentNumber).trim();
    }
    if (req.body.name !== undefined) {
      updates.name = String(req.body.name).trim();
    }
    if (req.body.section !== undefined) {
      updates.section = String(req.body.section).trim();
    }
    if (req.body.totalDues !== undefined) {
      const totalDues = Number(req.body.totalDues);
      if (
        req.body.totalDues === "" ||
        !Number.isFinite(totalDues) ||
        totalDues < 0
      ) {
        return res.status(400).json({
          message: "Total dues must be a valid non-negative amount."
        });
      }
      updates.totalDues = totalDues;
    }

    if (
      (updates.studentNumber !== undefined && !updates.studentNumber) ||
      (updates.name !== undefined && !updates.name)
    ) {
      return res.status(400).json({
        message: "Student number and name cannot be empty."
      });
    }

    const member = await Member.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );

    if (!member) {
      return res.status(404).json({ message: "Member not found." });
    }

    res.json(member);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "That student number already exists."
      });
    }

    res.status(500).json({ message: "Unable to update member." });
  }
});

// Record a payment and generate a unique reference.
app.post("/api/payments", async (req, res) => {
  try {
    const memberId = String(req.body.memberId || "");
    const amount = Number(req.body.amount);

    if (
      !mongoose.isValidObjectId(memberId) ||
      req.body.amount === "" ||
      !Number.isFinite(amount) ||
      amount <= 0
    ) {
      return res.status(400).json({
        message: "Select a member and enter a valid positive amount."
      });
    }

    const member = await Member.findById(memberId);

    if (!member) {
      return res.status(404).json({ message: "Member not found." });
    }

    const payments = await Payment.aggregate([
      { $match: { member: member._id } },
      { $group: { _id: null, paid: { $sum: "$amount" } } }
    ]);

    const totalPaid = payments[0]?.paid || 0;
    const balance = Math.max(0, member.totalDues - totalPaid);

    if (balance <= 0) {
      return res.status(400).json({
        message: "This member has no outstanding balance."
      });
    }

    if (amount > balance) {
      return res.status(400).json({
        message: `Payment exceeds the outstanding balance of ${balance.toFixed(2)}.`
      });
    }

    // The database generates a unique ID for this payment.
    // The receipt reference is based on that ID and saved with the record.
    const paymentId = new mongoose.Types.ObjectId();
    const reference = `OL-${Date.now()}-${paymentId.toString().slice(-6).toUpperCase()}`;

    const payment = await Payment.create({
      _id: paymentId,
      member: member._id,
      amount,
      reference
    });

    res.status(201).json({
      message: "Payment recorded successfully.",
      payment
    });
  } catch (error) {
    res.status(500).json({ message: "Unable to record payment." });
  }
});

// Get payment history.
app.get("/api/payments", async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate("member", "studentNumber name section")
      .sort({ paymentDate: -1 });

    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: "Unable to retrieve payments." });
  }
});

// Dashboard summary.
app.get("/api/reports/summary", async (req, res) => {
  try {
    const members = await Member.find().select("totalDues").lean();

    const paymentTotals = await Payment.aggregate([
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    const totalMembers = members.length;
    const totalDues = members.reduce(
      (sum, member) => sum + member.totalDues,
      0
    );
    const totalCollected = paymentTotals[0]?.total || 0;
    const outstandingBalance = Math.max(0, totalDues - totalCollected);

    const paidTotals = await Payment.aggregate([
      { $group: { _id: "$member", paid: { $sum: "$amount" } } }
    ]);

    const paidByMember = new Map(
      paidTotals.map((item) => [String(item._id), item.paid])
    );

    const fullyPaid = members.filter(
      (member) =>
        (paidByMember.get(String(member._id)) || 0) >= member.totalDues
    ).length;

    res.json({
      totalMembers,
      totalCollected,
      outstandingBalance,
      fullyPaid
    });
  } catch (error) {
    res.status(500).json({ message: "Unable to load summary." });
  }
});

app.use((req, res) => {
  res.status(404).json({ message: "API endpoint not found." });
});

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB.");
    app.listen(PORT, () => {
      console.log(`OrgLedger API running at http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  });
