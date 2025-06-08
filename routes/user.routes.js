const express = require("express");
const router = express.Router();
const User = require("../models/User.model");
const { isAuthenticated } = require("../middleware/jwt.middleware.js");

router.get("/:userNumber", async (req, res, next) => {
  const { userNumber } = req.params;

  // Validate workerNumber
  try {
    const foundUser = await User.findOne({ workerNumber: userNumber });

    if (!foundUser) {
      return res.status(404).json({ message: "User not found." });
    }
   const { workerNumber, userName, isAdmin , id} = foundUser;
    // Sanitize user data to avoid exposing sensitive information
    // In this case, we are not returning the password or any other sensitive field.
   
    
    res
      .status(200)
      .json({ workerNumber, userName, isAdmin, id });
  } catch (error) {
    console.error("Error fetching user data:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
});

router.get("/edit-user/:userId",  async (req, res, next) => {
    const { userId } = req.params;
    
    try {
        const foundUser = await User.findById(userId);
    
        if (!foundUser) {
        return res.status(404).json({ message: "User not found." });
        }
    
        // Sanitize user data to avoid exposing sensitive information
        const { workerNumber, userName, isAdmin, _id } = foundUser;
    
        res.status(200).json({ workerNumber, userName, isAdmin, _id });
    } catch (error) {
        console.error("Error fetching user data:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
})

router.patch("/edit-user/:userId", isAuthenticated, async (req, res, next) => {
    if(!req.payload?.isAdmin){
        return res.status(403).json({ message: "O utilizador actual não tem permissões para efetuar esta operação." });
    }
    const { userId } = req.params;
    const { workerNumber, userName, isAdmin } = req.body;

    try {
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { workerNumber, userName, isAdmin },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found." });
        }

        res.status(200).json({ message: "User updated successfully.", user: updatedUser });
    } catch (error) {
        console.error("Error updating user data:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
});

module.exports = router;
