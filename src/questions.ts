const questions = [
  {
    question: "What is your name?",
    answer: "",
    key: "name",
    validation: (answer: string) => {
      return answer.length > 0;
    },
    errorMessage: "Please enter a valid name.",
  },
  {
    question: "What is your email?",
    answer: "",
    key: "email",
    validation: (answer: string) => {
      return answer.length > 0 && answer.match(/.+@.+\..+/i);
    },
    errorMessage: "Please enter a valid email.",
  },
  {
    question: "What is your phone number?",
    answer: "",
    key: "phone",
    validation: (answer: string) => {
      return answer.length > 0 && answer.match(/\d{10}/);
    },
    errorMessage: "Please enter a valid phone number.",
  },
  {
    question: "What is your LinkedIn username?",
    answer: "",
    key: "linkedin_username",
    validation: (answer: string) => {
      return answer.length > 0;
    },
    errorMessage: "Please enter a valid LinkedIn username.",
  },
];

export default questions;
