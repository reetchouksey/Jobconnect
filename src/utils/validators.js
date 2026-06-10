export const isEmail = (value) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || '').toLowerCase());

export const isPhone = (value) =>
  /^[+]?[\d\s\-()]{7,20}$/.test(String(value || ''));

export const minLen = (value, n) => String(value || '').length >= n;

export const required = (value) => Boolean(String(value ?? '').trim().length);

export const validateLogin = ({ email, password }) => {
  const errors = {};
  if (!required(email)) errors.email = 'Email is required';
  else if (!isEmail(email)) errors.email = 'Enter a valid email';
  if (!required(password)) errors.password = 'Password is required';
  else if (!minLen(password, 6))
    errors.password = 'Password must be at least 6 characters';
  return errors;
};

export const validateSignup = ({ name, email, password, confirmPassword }) => {
  const errors = {};
  if (!required(name)) errors.name = 'Full name is required';
  else if (!minLen(name, 2)) errors.name = 'Name is too short';
  if (!required(email)) errors.email = 'Email is required';
  else if (!isEmail(email)) errors.email = 'Enter a valid email';
  if (!required(password)) errors.password = 'Password is required';
  else if (!minLen(password, 6))
    errors.password = 'Password must be at least 6 characters';
  if (password !== confirmPassword)
    errors.confirmPassword = 'Passwords do not match';
  return errors;
};

export const validateApplication = ({ name, email, phone, coverLetter }) => {
  const errors = {};
  if (!required(name)) errors.name = 'Full name is required';
  if (!required(email)) errors.email = 'Email is required';
  else if (!isEmail(email)) errors.email = 'Enter a valid email';
  if (!required(phone)) errors.phone = 'Phone is required';
  else if (!isPhone(phone)) errors.phone = 'Enter a valid phone number';
  if (coverLetter && !minLen(coverLetter, 20))
    errors.coverLetter = 'Cover letter should be at least 20 characters';
  return errors;
};

export const validateJobPost = (job) => {
  const errors = {};
  if (!required(job.title)) errors.title = 'Job title is required';
  if (!required(job.company)) errors.company = 'Company is required';
  if (!required(job.location)) errors.location = 'Location is required';
  if (!required(job.description)) errors.description = 'Description is required';
  if (!required(job.type)) errors.type = 'Job type is required';
  if (job.salaryMin && job.salaryMax && +job.salaryMin > +job.salaryMax)
    errors.salaryMax = 'Max salary must be greater than min salary';
  return errors;
};
