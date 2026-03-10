const employees = [
    {
        "id": 1,
        "firstName": "Suneetha",
        "email": "suneetha@aja.com",
        "password": "123",
        "phone": "+91 9666477844",
        "department": "Engineering",
        "role": "Developer",
        "active": true,
        "taskCounts": { "active": 2, "newTask": 1, "completed": 1, "failed": 0 },
        "attendance": [],
        "tasks": []
    },
    {
        "id": 2,
        "firstName": "Sravani",
        "email": "sravani@aja.com",
        "password": "123",
        "phone": "+91 9988776655",
        "department": "Engineering",
        "role": "Software Engineer",
        "active": true,
        "taskCounts": { "active": 1, "newTask": 0, "completed": 1, "failed": 0 },
        "attendance": [],
        "tasks": []
    },
    {
        "id": 3,
        "firstName": "Arjun",
        "email": "arjun@aja.com",
        "password": "123",
        "phone": "+91 8877665544",
        "department": "Finance",
        "role": "Analyst",
        "active": true,
        "taskCounts": { "active": 2, "newTask": 1, "completed": 1, "failed": 0 },
        "attendance": [],
        "tasks": []
    },
    {
        "id": 4,
        "firstName": "Chandrasekar",
        "email": "chandrasekar@aja.com",
        "password": "123",
        "phone": "+91 7766554433",
        "department": "Design",
        "role": "UI Designer",
        "active": true,
        "taskCounts": { "active": 2, "newTask": 1, "completed": 0, "failed": 0 },
        "attendance": [],
        "tasks": []
    },
    {
        "id": 5,
        "firstName": "Siva",
        "email": "siva@aja.com",
        "password": "123",
        "phone": "+91 6655443322",
        "department": "HR",
        "role": "HR Manager",
        "active": true,
        "taskCounts": { "active": 2, "newTask": 1, "completed": 1, "failed": 0 },
        "attendance": [],
        "tasks": []
    },
    {
        "id": 7,
        "firstName": "Vikram",
        "email": "employee7@example.com",
        "password": "123",
        "phone": "+91 98765 43216",
        "department": "Marketing",
        "role": "Marketing Exec",
        "active": false,
        "taskCounts": {
            "active": 0,
            "newTask": 0,
            "completed": 5,
            "failed": 2
        },
        "attendance": [],
        "tasks": []
    },
    {
        "id": 8,
        "firstName": "Anjali",
        "email": "employee8@example.com",
        "password": "123",
        "phone": "+91 98765 43217",
        "department": "HR",
        "role": "Recruiter",
        "active": false,
        "taskCounts": {
            "active": 0,
            "newTask": 0,
            "completed": 10,
            "failed": 0
        },
        "attendance": [],
        "tasks": []
    }
];

const departments = [
    { "id": 1, "name": "Engineering" },
    { "id": 2, "name": "Design" },
    { "id": 3, "name": "Sales" },
    { "id": 4, "name": "Marketing" },
    { "id": 5, "name": "HR" }
];

const admin = [{
    "id": 1,
    "email": "admin@example.com",
    "password": "123"
}];

export const setLocalStorage = () => {
    localStorage.setItem('employees', JSON.stringify(employees));
    localStorage.setItem('admin', JSON.stringify(admin));
    localStorage.setItem('departments', JSON.stringify(departments));
}

export const getLocalStorage = () => {
    const employees = JSON.parse(localStorage.getItem('employees'));
    const admin = JSON.parse(localStorage.getItem('admin'));
    const departments = JSON.parse(localStorage.getItem('departments'));

    return { employees, admin, departments };
}
