const Member = require('../models/Member');

exports.addMember = async (req, res) => {
  try {
    const { firstName, lastName, phone, gymFee, months, address, submissionDate } = req.body;

    if (
      !firstName || !lastName || !phone || !gymFee ||
      !months || !address || !submissionDate
    ) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const member = new Member({
      firstName,
      lastName,
      phone,
      gymFee,
      months,
      address,
      submissionDate
    });

    await member.save();
    res.status(201).json({ message: 'Member added successfully', member });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getAllMembers = async (req, res) => {
  try {
    const members = await Member.find();
    // Check and update status for each member
    for (const member of members) {
      if (member.isActive && isMembershipExpired(member)) {
        member.isActive = false;
        await member.save();
      }
    }
    res.json(members);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getActiveMembers = async (req, res) => {
  try {
    const members = await Member.find({ isActive: true });
    // Check and update status for each member
    for (const member of members) {
      if (isMembershipExpired(member)) {
        member.isActive = false;
        await member.save();
      }
    }
    // Return only still-active members
    const activeMembers = await Member.find({ isActive: true });
    res.json(activeMembers);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
exports.toggleMemberStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const member = await Member.findById(id);
    if (!member) return res.status(404).json({ message: 'Member not found' });

    member.isActive = !member.isActive;
    await member.save();
    res.json({ message: 'Member status updated', member });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
exports.deleteMember = async (req, res) => {
  try {
    const { id } = req.params;
    const member = await Member.findByIdAndDelete(id);
    if (!member) return res.status(404).json({ message: 'Member not found' });
    res.json({ message: 'Member deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
function isMembershipExpired(member) {
  const start = new Date(member.submissionDate);
  const expiry = new Date(start.setMonth(start.getMonth() + member.months));
  return new Date() > expiry;
}

exports.updateMember = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      firstName,
      lastName,
      phone,
      gymFee,
      months,
      address,
      submissionDate
    } = req.body;

    const updated = await Member.findByIdAndUpdate(
      id,
      {
        firstName,
        lastName,
        phone,
        gymFee,
        months,
        address,
        submissionDate
      },
      { new: true, runValidators: true }
    );

    if (!updated) return res.status(404).json({ message: 'Member not found' });
    res.json({ message: 'Member updated', member: updated });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};