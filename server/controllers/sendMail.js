const nodemailer = require("nodemailer");

const sendMail = async (req, res) => {
    // res.send("this is node mailer route");

    //initiating nodemailer
    const transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // true for port 465, false for other ports
        auth: {
            user: "bennie.buckridge@ethereal.email",
            pass: "gcP1sEFZKMxaM6bGVS",
        },
    });

    //creating message
    const info = await transporter.sendMail({
        from: `${req.body.email}`, // sender address
        to: "support@gobuy.com", // list of receivers
        subject: `${req.body.subject}`, // Subject line
        text: `${req.body.message}`, // plain text body
        html: `<b>${req.body.message}</b>`, // html body
    });

    console.log(req.body);
    console.log("Message sent: %s", info.messageId);
    res.status(200).json({ msg: "hello" });
};

module.exports = sendMail;
