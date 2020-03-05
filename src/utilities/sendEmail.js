const nodemailer = require('nodemailer')

module.exports = sendEmail;

async function sendEmail(mailOptions) {
    try {
        const option = {
            service: 'gmail',
            auth: {
                user: 'tatcaoday1507@gmail.com',
                pass: 'seasuninthesun1'
            }
        };
        var transporter = nodemailer.createTransport(option);
        mailOptions.from = 'tatcaoday1507@gmail.com';
        var result = await transporter.sendMail(mailOptions);
        return result;
    } catch (ex) {
        console.log(ex);
        return { success: false, code: 500, message: "Có lỗi xảy ra. Xin vui lòng thử lại.!" }
    }
}