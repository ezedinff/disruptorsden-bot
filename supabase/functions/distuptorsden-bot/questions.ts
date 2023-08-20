const memberForm = [
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
      return answer.length > 0 && new RegExp(/.+@.+\..+/i).test(answer);
    },
    errorMessage: "Please enter a valid email.",
  },
  {
    question: "What is your phone number?",
    answer: "",
    key: "phone",
    validation: (answer: string) => {
      return answer.length > 0 && new RegExp(/\d{10}/).test(answer);
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

export const meetupForm = [
  {
    question: "What is the date of the meetup? in the format YYYY-MM-DD",
    answer: "",
    key: "date",
    validation: (answer: string) => {
      return answer.length > 0 && new RegExp(/\d{4}-\d{2}-\d{2}/).test(answer);
    },
    errorMessage: "Please enter a valid date.",
  },
  {
    question: "What is the location of the meetup?",
    answer: "",
    key: "location",
    validation: (answer: string) => {
      return answer.length > 0;
    },
    errorMessage: "Please enter a valid location.",
  },
  {
    question: "What is the start time of the meetup? in the format HH:MM",
    answer: "",
    key: "start_time",
    validation: (answer: string) => {
      return answer.length > 0 && new RegExp(/\d{2}:\d{2}/).test(answer);
    },
    errorMessage: "Please enter a valid start time.",
  },
  {
    question: "What are the topics of the meetup? (separated by commas)",
    answer: "",
    key: "topics",
    validation: (answer: string) => {
      // optional
      return true;
    },
    errorMessage: "Please enter a valid topics.",
  },
];

export const getAttendanceForm = [
  {
    question: "What is the date of the meetup? in the format YYYY-MM-DD",
    answer: "",
    key: "date",
    validation: (answer: string) => {
      return answer.length > 0 && new RegExp(/\d{4}-\d{2}-\d{2}/).test(answer);
    },
    errorMessage: "Please enter a valid date.",
  }
];

export const registerAdminForm = [
  {
    question: "Cool! Who are you going to assign as an admin? Please enter the member id.",
    answer: "",
    key: "member_id",
    validation: (answer: string) => {
      return answer.length > 0 && new RegExp(/\d+/).test(answer);
    },
    errorMessage: "Please enter a valid member id.",
  }
];


export default {
  memberForm,
  meetupForm,
  getAttendanceForm,
  registerAdminForm
};
