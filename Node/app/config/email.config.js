const nodemailer = require("nodemailer");
const tp={}

tp.email=""
tp.transporter = nodemailer.createTransport({
	host: "smtp.live.com",
	port: 25,
	secure: false, // true for 465, false for other ports
	auth: {
		user: tp.email,
		pass: ""
	},
	tls: { rejectUnauthorized: false }
  })

  module.exports = tp;