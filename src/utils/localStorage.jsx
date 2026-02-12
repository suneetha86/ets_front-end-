const employees = [
    {
        "id": 1,
        "firstName": "suneetha",
        "email": "sunitha@gmail.com",
        "password": "123",
        "phone": "+91 9666477844",
        "department": "Engineering",
        "role": "Developer",
        "active": true,
        "taskCounts": {
            "active": 2,
            "newTask": 1,
            "completed": 1,
            "failed": 0
        },
        "attendance": [
            { "date": "2024-02-09", "status": "Present" },
            { "date": "2024-02-08", "status": "Present" },
            { "date": "2024-02-07", "status": "Absent" }
        ],
        "tasks": [
            {
                "active": true,
                "newTask": true,
                "completed": false,
                "failed": false,
                "taskTitle": "Update website",
                "taskDescription": "Revamp the homepage design",
                "taskDate": "2024-10-12",
                "category": "Design"
            },
            {
                "active": false,
                "newTask": false,
                "completed": true,
                "failed": false,
                "taskTitle": "Client Meeting",
                "taskDescription": "Discuss project requirements",
                "taskDate": "2024-10-10",
                "category": "Meeting"
            },
            {
                "active": true,
                "newTask": false,
                "completed": false,
                "failed": false,
                "taskTitle": "Fix bugs",
                "taskDescription": "Resolve bugs reported in issue tracker",
                "taskDate": "2024-10-14",
                "category": "Development"
            }
        ]
    },
    {
        "id": 2,
        "firstName": "manasvi",
        "email": "manasvi@example.com",
        "password": "123",
        "phone": "+91 98765 43211",
        "department": "Engineering",
        "role": "DB Admin",
        "active": true,
        "taskCounts": {
            "active": 1,
            "newTask": 0,
            "completed": 1,
            "failed": 0
        },
        "attendance": [
            { "date": "2024-02-09", "status": "Present" },
            { "date": "2024-02-08", "status": "Present" }
        ],
        "tasks": [
            {
                "active": true,
                "newTask": false,
                "completed": false,
                "failed": false,
                "taskTitle": "Database Optimization",
                "taskDescription": "Optimize queries for better performance",
                "taskDate": "2024-10-11",
                "category": "Database"
            },
            {
                "active": false,
                "newTask": false,
                "completed": true,
                "failed": false,
                "taskTitle": "Design new feature",
                "taskDescription": "Create mockups for the upcoming feature",
                "taskDate": "2024-10-09",
                "category": "Design"
            }
        ]
    },
    {
        "id": 3,
        "firstName": "manu",
        "email": "suneetha@example.com",
        "password": "123",
        "phone": "+91 9885743321",
        "department": "Sales",
        "role": "Sales Exec",
        "active": true,
        "taskCounts": {
            "active": 2,
            "newTask": 1,
            "completed": 1,
            "failed": 0
        },
        "attendance": [
            { "date": "2024-02-09", "status": "Present" }
        ],
        "tasks": [
            {
                "active": true,
                "newTask": true,
                "completed": false,
                "failed": false,
                "taskTitle": "Prepare presentation",
                "taskDescription": "Prepare slides for upcoming client presentation",
                "taskDate": "2024-10-13",
                "category": "Presentation"
            },
            {
                "active": true,
                "newTask": false,
                "completed": false,
                "failed": false,
                "taskTitle": "Code review",
                "taskDescription": "Review code submitted by colleagues",
                "taskDate": "2024-10-12",
                "category": "Development"
            },
            {
                "active": false,
                "newTask": false,
                "completed": true,
                "failed": false,
                "taskTitle": "Testing",
                "taskDescription": "Test the latest build for bugs",
                "taskDate": "2024-10-08",
                "category": "QA"
            }
        ]
    },
    {
        "id": 4,
        "firstName": "basi",
        "email": "basi@example.com",
        "password": "123",
        "phone": "+91 9440413328",
        "department": "HR",
        "role": "HR Manager",
        "active": true,
        "taskCounts": {
            "active": 2,
            "newTask": 1,
            "completed": 0,
            "failed": 0
        },
        "attendance": [],
        "tasks": [
            {
                "active": true,
                "newTask": true,
                "completed": false,
                "failed": false,
                "taskTitle": "Write documentation",
                "taskDescription": "Update implementation documentation",
                "taskDate": "2024-10-13",
                "category": "Documentation"
            },
            {
                "active": true,
                "newTask": false,
                "completed": false,
                "failed": false,
                "taskTitle": "Set up CI/CD",
                "taskDescription": "Implement continuous integration pipeline",
                "taskDate": "2024-10-11",
                "category": "DevOps"
            }
        ]
    },
    {
        "id": 5,
        "firstName": "Karan",
        "email": "employee5@example.com",
        "password": "123",
        "phone": "+91 98765 43214",
        "department": "Design",
        "role": "Designer",
        "active": true,
        "taskCounts": {
            "active": 2,
            "newTask": 1,
            "completed": 1,
            "failed": 0
        },
        "attendance": [],
        "tasks": [
            {
                "active": true,
                "newTask": true,
                "completed": false,
                "failed": false,
                "taskTitle": "UI Redesign",
                "taskDescription": "Redesign user interface for better UX",
                "taskDate": "2024-10-14",
                "category": "Design"
            },
            {
                "active": false,
                "newTask": false,
                "completed": true,
                "failed": false,
                "taskTitle": "Deploy new build",
                "taskDescription": "Deploy the latest build to production server",
                "taskDate": "2024-10-09",
                "category": "DevOps"
            },
            {
                "active": true,
                "newTask": false,
                "completed": false,
                "failed": false,
                "taskTitle": "Client feedback",
                "taskDescription": "Gather feedback from clients after launch",
                "taskDate": "2024-10-12",
                "category": "Support"
            }
        ]
    },
    {
        "id": 6,
        "firstName": "Suneetha",
        "email": "suneetha@gmail.com",
        "password": "suni@123",
        "phone": "+91 9666477844",
        "department": "Engineering",
        "designation": "Sr Backend Developer",
        "project": "AJABench System",
        "cohort": "Cohort C3",
        "role": "Associate",
        "active": true,
        "github": "demouser",
        "analytics": {
            "attendance": "95%",
            "coding": "120"
        },
        "taskCounts": {
            "active": 1,
            "newTask": 1,
            "completed": 0,
            "failed": 0
        },
        "attendance": [],
        "tasks": [
            {
                "active": true,
                "newTask": true,
                "completed": false,
                "failed": false,
                "taskTitle": "Welcome Task",
                "taskDescription": "Complete your profile and onboarding",
                "taskDate": "2026-02-10",
                "category": "Onboarding"
            }
        ]
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
