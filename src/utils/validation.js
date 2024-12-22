export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const sanitizeText = (input) => {
  if (typeof input !== "string") return input;
  return input.trim().replace(/[<>]/g, "");
};

export const sanitizeUrl = (input) => {
  if (typeof input !== "string") return input;
  const urlRegex = /^(?:https?:\/\/)?[\da-z\.-]+\.[a-z\.]{2,6}\S*$/;
  return urlRegex.test(input)
    ? input.trim()
    : input.trim().replace(/[^A-Za-z0-9-]/g, "");
};

export const validatePassword = (password) => {
  return password.length >= 8;
};

export const validateCampaign = (campaign) => {
  const errors = {};

  if (!campaign?.title?.trim()) {
    errors.title = ["Campaign title is required"];
  }

  if (!campaign.landing_page_url) {
    errors.landing_page_url = ["Valid landing page URL is required"];
  }

  if (campaign.landing_page_url) {
    const url = new URL(campaign.landing_page_url);
    if (!url.hostname) {
      errors.landing_page_url = ["Must be a valid URL"];
    }
  }

  if (!campaign.activity_status) {
    errors.activity_status = ["Status is required"];
  }

  if (!campaign.payouts || campaign.payouts.length === 0) {
    errors.payouts = ["At least one payout is required"];
  }

  campaign.payouts.forEach((payout, index) => {
    if (!payout.country) {
      errors[`payouts.${index}.country`] = ["Country is required"];
    }

    if (!payout.payout_value) {
      errors[`payouts.${index}.payout_value`] = ["Payout value is required"];
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateRegister = (form) => {
  const errors = {};

  if (!form.name) {
    errors.name = ["Name is required"];
  }

  if (form.name && form.name.trim().length < 5) {
    errors.name = ["Name must be at least 5 characters long"];
  }

  if (!form.email) {
    errors.email = ["Email is required"];
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(form.email)) {
    errors.email = ["Please enter a valid email address"];
  }

  if (!form.password) {
    errors.password = ["Password is required"];
  }

  if (!validatePassword(form.password)) {
    errors.password = ["Password must be at least 8 characters long"];
  }

  if (form.password !== form.password_confirmation) {
    if (errors.password) {
      errors.password.push("Passwords do not match");
    } else {
      errors.password = ["Passwords do not match"];
    }
  }

  return {
    isValid: Object.keys(errors)?.length === 0,
    errors,
  };
};
