// src/controllers/userController.js
const UserModel = require('../models/userModel');

exports.updateUser = async (req, res) => {
  try {
    const { walletAddress, name, description } = req.body;
    let profilePicture = null;

    if (req.file) {
      profilePicture = req.file.path;
    }

    await UserModel.updateUser(walletAddress, name, description, profilePicture);

    const updatedUser = await UserModel.getUserByWalletAddress(walletAddress);

    res.status(200).json({
      message: 'User details updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

exports.getUserDetails = async (req, res) => {
  try {
    const { walletAddress } = req.params;
    const user = await UserModel.getUserByWalletAddress(walletAddress);

    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};
