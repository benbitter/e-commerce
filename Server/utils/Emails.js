import nodemailer from "nodemailer"

// pmle rgpa vzhi bbzl
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "princeraj1504@gmail.com",
    pass: "pmle rgpa vzhi bbzl",
  },
});

const sendMail = async(receiverEmail,subject,body) => {
    await transporter.sendMail({
    from: "princeraj1504@gmail.com",
    to: receiverEmail,
    subject: subject,
    html: body
  });
};

export { sendMail };