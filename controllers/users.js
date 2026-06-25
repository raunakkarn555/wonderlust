const User = require("../models/user.js");
const Message = require("../models/message.js");
const wrapAsync = require("../utils/wrapAsync.js");
const nodemailer = require("nodemailer");



module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
};


module.exports.signUp = async(req, res) => {
    try {
    let{username, email, password} = req.body;
    const newUser = new User({email, username});
   const registeredUser = await User.register(newUser, password);
   console.log(registeredUser);
   req.login(registeredUser, (err) => {
     if (err) {
            return next(err);
        };
           req.flash("success", "Welcome to WonderLust!")
   res.redirect("/listings");
   });
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};

// /login form
module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
};

// login 
module.exports.login = async(req, res) => {
    req.flash("success", "Welcome back to WonderLust!")
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

// logout
module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        };
    });
    req.flash("success", "You are logged out!");
    res.redirect("/listings");
};


// pages
module.exports.renderAbout = (req, res) => {
    res.render("pages/about.ejs"); 
}

module.exports.renderContact = (req, res) => {
    res.render("pages/contact.ejs");
};

module.exports.renderPrivacy = (req, res) => {
    res.render("pages/privacy.ejs");
};

module.exports.renderTerms = (req, res) => {
    res.render("pages/terms.ejs");
};

module.exports.renderDeveloper = (req, res) => {
    res.render("pages/developer.ejs");
};

// Handle form submission
module.exports.submitContactForm = async (req, res) => {
    const { name, email, message } = req.body;

    // 1. Create a transporter using Gmail server settings
    const transporter = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER, 
            pass: process.env.EMAIL_PASS  
        }
    });

    // 2. Format the email content
    const mailOptions = {
        from: `"${name}" <${email}>`, // Shows who sent it
        to: "raunakkarn555@gmail.com", // Sent directly to your email
        replyTo: email,                // Clicking 'Reply' in Gmail goes back to the user
        subject: `WonderLust Project: New Message from ${name}`,
        text: `You received a new message from your WonderLust contact form:\n\n` +
              `Name: ${name}\n` +
              `Email: ${email}\n\n` +
              `Message:\n${message}`
    };

    try {
        // 3. Send the email
        await transporter.sendMail(mailOptions);
        req.flash("success", "Thank you for reaching out! Your message has been sent directly to Raunak's inbox.");
    } catch (error) {
        console.error("Nodemailer Error: ", error);
        req.flash("error", "Failed to send message. Please try again later.");
    }
    
    res.redirect("/contact");
};