const LSUser = require('../models/LSuser');
const jwt = require('jsonwebtoken');

const handleErrors = (err) => {
    console.log(err.message, err.code);
    let errors = { email: '', password: '' };
  
    if (err.message === 'incorrect email') {
      errors.email = 'That email is not registered';
    }
  
    // incorrect password
    if (err.message === 'incorrect password') {
      errors.password = 'That password is incorrect';
    }
  


    // duplicate email error
    if (err.code === 11000) {
      errors.email = 'that email is already registered';
      return errors;
    }
  
    // validation errors
    if (err.message.includes('LSUser validation failed')) {
      // console.log(err);
      Object.values(err.errors).forEach(({ properties }) => {
        // console.log(val);
        // console.log(properties);
        errors[properties.path] = properties.message;
      });
    }
  
    return errors;
  }
const secret = "bunny";
const maxAge = 3*60*60*24;
const createToken = (id)=>{
    return jwt.sign({id},secret,{
        expiresIn:maxAge,
    })
}

const signup_get = (req,res)=>{
    res.render('signup');
}

const signup_post = async (req,res)=>{
    try{
        const {email,password} = req.body;
    const user = new LSUser();
    user.email = email;
    user.password = password;
    await user.save();
    const token = createToken(user._id);
    res.cookie('jwt',token,{
        httpOnly: true,
        maxAge:maxAge*1000,
    })
    
    res.json({
        user:user._id,
    }).status(201); 
    }catch(e){
        const errors = handleErrors(e);
    res.status(400).json({ errors });
    }

}
const login_get = (req,res)=>{
    res.render('login');
}
const login_post = async (req,res)=>{
    const { email, password } = req.body;

  try {
    const user = await LSUser.login(email, password);
    const token = createToken(user._id);
    res.cookie('jwt',token,{
        httpOnly: true,
        maxAge:maxAge*1000,
    })
    res.status(200).json({ user: user._id });
  } catch (err) {
    const error = handleErrors(err);
  res.status(400).json({
    success:false,
    message:error
  })
  }
}
const logout_get = (req,res)=>{
    res.cookie('jwt',null,{maxAge:1});
    res.redirect('/');
}

module.exports =  {
    signup_get,
    signup_post,
    login_get,
    login_post,
    logout_get
};