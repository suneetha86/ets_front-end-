const axios = require('axios');

(async () => {
    try {
        // Fetch all standard salaries
        let res = await axios.get('http://localhost:8080/api/admin/salary-management');
        console.log("Standard Salaries:", res.data);

        // Fetch simplified salaries
        let res2 = await axios.get('http://localhost:8080/api/employee-salary-management/all');
        console.log("Simplified Salaries:", res2.data);
    } catch(err) {
        console.error("Error:", err.message);
    }
})();
