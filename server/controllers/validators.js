// Functions for validating data

// check if empty string
const isEmpty = (string) => {
  if (string.trim() === '') return true;
  else return false;
};

// Check for email pattern 
const isEmail = (email) => {
  const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (email.match(regEx)) {
    return true;
  } else {
    return false;
  }
}

// Validate inputs for signup
export const validateSignupData = (newUser) => {
  let errors = {};
  let valid = false;

  if (isEmpty(newUser.email)) {
    errors.email = 'Email must not be empty';
  } else if (!isEmail(newUser.email)) {
    errors.email = 'Must be a valid email address';
  }

  if (isEmpty(newUser.password)) {
    errors.password = 'Password must not be empty';
  }

  if (newUser.password !== newUser.confirmPassword) {
    errors.confirmPassword = 'Passwords must match';
  }

  if (isEmpty(newUser.handle)) {
    errors.handle = 'Handle must not be empty';
  }

  if (!Object.keys(errors).length > 0) {
    valid = true;
  }

  return {
    valid,
    errors
  };
}

// Validate inputs for login
export const validateLoginData = (data) => {
  let valid = false;
  let errors = {};

  if (isEmpty(data.email)) {
    errors.email = 'Email must not be empty';
  } else if (!isEmail(data.email)) {
    errors.email = 'Must be a valid email address';
  }

  if (isEmpty(data.password)) {
    errors.password = 'Password must not be empty';
  }

  if (!Object.keys(errors).length > 0) {
    valid = true;
  }

  return {
    valid,
    errors
  };
}

// Validate the inputs for user details 
export const reduceUserDetails = (data) => {
  let userDetails = {};
  userDetails.bio = "";
  userDetails.website = "";
  userDetails.location = "";

  if (!isEmpty(data.bio.trim())) {
    userDetails.bio = data.bio;
  }

  if (!isEmpty(data.website.trim())) {

    let website = data.website.trim();
    // check if http is added in the website url
    if (website.substring(0, 4) !== 'http') {
      userDetails.website = `http://${website}`;
    } else {
      userDetails.website = website;
    }
  }

  if (!isEmpty(data.location.trim())) {
    userDetails.location = data.location;
  }

  return userDetails;
}