const registerButton = {
    text: "Register",
    callback_data: "/register"
};

const attendanceButton = {
    text: "Attended / መጥቻለሁ",
    regex: /\/attendance\/(?<id>\d+)/,
    callback_data: "/attendance/{id}"
};

export const getAttendanceButton = {
    text: "Get Attendance",
    callback_data: "/get-attendance"
}

export const sendAttendanceButton = {
    text: "Send Attendance",
    callback_data: "/attendance"
}
export const createMeetupButton = {
    text: "Create Meetup",
    callback_data: "/meetup"
}

export default {
    register: registerButton,
    attendance: attendanceButton,
    getAttendance: getAttendanceButton,
    sendAttendance: sendAttendanceButton,
    createMeetup: createMeetupButton
}