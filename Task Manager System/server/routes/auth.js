const router = require("express").Router();
const { User } = require("../models/user");
const bcrypt = require("bcrypt");

router.post("/", async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        
        const token = user && user.generateAuthToken();

        if (!user || !await bcrypt.compare(req.body.password, user.password)) {
            return res.status(422).send({ data: token || null, message: "Email or Password are wrong!!" });
        }

        res.status(200).send({ data: token || null, message: "logged in successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Something went wrong try again later.", data: error.message });
    }
});

module.exports = router;
