import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
    {
      name: 'mock-api-middleware',
      configureServer(server) {
        let mockAttendanceHistory = [];
        let mockActivePunchIn = null;
        let mockSimplifiedSalaries = [
          { id: 1, employeeId: 1, employeeName: "Suneetha", cycle: "March 2026", gross: 80000, deductions: 5000, netAmount: 75000, transferDate: "2026-03-10", transactionStatus: "PAID" },
          { id: 2, employeeId: 2, employeeName: "Arjun Pishke", cycle: "March 2026", gross: 73000, deductions: 5000, netAmount: 68000, transferDate: "2026-03-10", transactionStatus: "PAID" }
        ];
        let mockStandardSalaries = [
          { id: 101, employeeName: "Suneetha", employeeCode: "EMP001", amount: 75000, status: "PAID", month: "March 2026", receiptDate: "2026-03-10", department: "Engineering", designation: "Software Engineer", netSalary: 75000, grossSalary: 80000, deductions: 5000, receiptIssued: true },
          { id: 102, employeeName: "Arjun", employeeCode: "EMP002", amount: 68000, status: "PAID", month: "March 2026", receiptDate: "2026-03-10", department: "Finance", designation: "Analyst", netSalary: 68000, grossSalary: 73000, deductions: 5000, receiptIssued: true }
        ];

        let mockNotifications = [
          { id: 1, title: "Salary Credited", message: "Your remuneration for January 2026 has been successfully processed and credited to your account.", type: "success", category: "Payroll", read: false, createdAt: new Date(Date.now() - 3600000).toISOString() },
          { id: 2, title: "New Task Assigned", message: "A new algorithm optimization task has been assigned to your workspace. Completion deadline: 48 hours.", type: "info", category: "Assignment", read: false, createdAt: new Date(Date.now() - 86400000).toISOString() },
          { id: 3, title: "System Maintenance", message: "AJA Kernel will undergo scheduled maintenance on Sunday, 02:00 AM. Expect brief downtime.", type: "warning", category: "Infrastructure", read: true, createdAt: new Date(Date.now() - 172800000).toISOString() },
          { id: 4, title: "Policy Update", message: "The employee handbook has been updated regarding the new hybrid work protocols. Please review.", type: "info", category: "HR", read: true, createdAt: new Date(Date.now() - 259200000).toISOString() }
        ];

        let mockTasks = [
          {
            id: 1,
            date: '2026-03-10',
            time: '12:00',
            taskDescription: 'Integrated Notification API with mock data handlers to enable real-time alerting in the standard member dashboard.',
            challengesFaced: 'Encountered 401 Unauthorized errors on new endpoints before middleware synchronization.',
            solutionImplemented: 'Updated vite.config.js to intercept /api/notifications and provide structured mock signals.',
            status: 'COMPLETED'
          },
          {
            id: 2,
            date: '2026-03-09',
            time: '15:30',
            taskDescription: 'Refined Salary Management UI including payslip modal responsiveness and dynamic name rendering for Chandra Sekhar Bijibilla.',
            challengesFaced: 'Modal was overflowing on smaller viewports and name was hardcoded to Ravi Kumar.',
            solutionImplemented: 'Implemented min-height and viewport-relative scaling using Tailwind CSS utility classes.',
            status: 'COMPLETED'
          }
        ];

        let mockAdminTasks = [
          {
            id: 1,
            firstName: "suneetha",
            taskTitle: "API Kernel Optimization",
            description: "Refactor core authentication middleware for lower latency.",
            status: "Completed",
            completed: true,
            score: 9.5,
            date: "2026-03-10"
          },
          {
            id: 2,
            firstName: "Arjun Pishke",
            taskTitle: "Q1 Financial Reconciliation",
            description: "Audit organization-wide salary receipts for disbursement validation.",
            status: "In Progress",
            active: true,
            score: 8.2,
            date: "2026-03-11"
          },
          {
            id: 3,
            firstName: "Chandrasekar Nair",
            taskTitle: "Dashboard UX Overhaul",
            description: "Implement premium glassmorphism patterns and responsive scaling.",
            status: "Completed",
            completed: true,
            score: 9.8,
            date: "2026-03-09"
          },
          {
            id: 4,
            firstName: "Siva Yennam",
            taskTitle: "Staff Onboarding Wave B",
            description: "Provision credentials and security clearance for 12 new nodes.",
            status: "Failed",
            failed: true,
            score: 4.5,
            date: "2026-03-08"
          }
        ];

        let mockUsers = [
          { id: 1, firstName: "Suneetha", nameUsername: "Suneetha", emailAddress: "suneetha@aja.com", phone: "+91 9666477844", dept: "Engineering", accessPassword: "123" },
          { id: 2, firstName: "Sravani", nameUsername: "Sravani", emailAddress: "sravani@aja.com", phone: "+91 9988776655", dept: "Engineering", accessPassword: "123" },
          { id: 3, firstName: "Arjun", nameUsername: "Arjun", emailAddress: "arjun@aja.com", phone: "+91 8877665544", dept: "Finance", accessPassword: "123" },
          { id: 4, firstName: "Chandrasekar", nameUsername: "Chandrasekar", emailAddress: "chandrasekar@aja.com", phone: "+91 7766554433", dept: "Design", accessPassword: "123" },
          { id: 5, firstName: "Siva", nameUsername: "Siva", emailAddress: "siva@aja.com", phone: "+91 6655443322", dept: "HR", accessPassword: "123" }
        ];

        let mockDepartments = [
          { id: 1, name: 'Engineering', count: 42, percent: 33, head: 'Suneetha', budget: '₹18L', status: 'Active', description: 'Technical development and infrastructure management.' },
          { id: 2, name: 'Sales', count: 24, percent: 19, head: 'Sravani', budget: '₹10L', status: 'Active', description: 'Client acquisition and revenue generation.' },
          { id: 3, name: 'Finance', count: 18, percent: 14, head: 'Siva', budget: '₹9L', status: 'Active', description: 'Financial planning and payroll management.' },
          { id: 4, name: 'Operations', count: 18, percent: 14, head: 'Chandrasekar', budget: '₹8L', status: 'Active', description: 'Daily business logistics and execution.' },
          { id: 5, name: 'Design', count: 14, percent: 11, head: 'Arjun', budget: '₹7L', status: 'Active', description: 'UI/UX and product branding.' },
          { id: 6, name: 'HR', count: 12, percent: 9, head: 'Dev Kumar', budget: '₹6L', status: 'Active', description: 'Human resources and employee welfare.' }
        ];

        server.middlewares.use((req, res, next) => {
          // Ensure we only handle API requests to avoid MIME type errors with static assets
          // Also check if the request is looking for HTML (likely a frontend route)
          const isHtmlRequest = req.headers.accept?.includes('text/html');

          if (isHtmlRequest || (!req.url.startsWith('/api') && !req.url.startsWith('/admin') && !req.url.includes('/employee-salary-management'))) {
            return next();
          }

          // Handle Notifications
          if (req.url.startsWith('/api/notifications')) {
            res.setHeader('Content-Type', 'application/json');

            if (req.url === '/api/notifications/unread' && req.method === 'GET') {
              const unread = mockNotifications.filter(n => !n.read);
              res.end(JSON.stringify({ unreadCount: unread.length, unread }));
              return;
            }
            if (req.url === '/api/notifications' && req.method === 'GET') {
              res.end(JSON.stringify(mockNotifications));
              return;
            }
            const idMatch = req.url.match(/\/api\/notifications\/(\d+)$/);
            if (idMatch && req.method === 'GET') {
              const notif = mockNotifications.find(n => n.id === parseInt(idMatch[1]));
              if (notif) res.end(JSON.stringify(notif));
              else { res.statusCode = 404; res.end(JSON.stringify({ message: "Not found" })); }
              return;
            }
            const readMatch = req.url.match(/\/api\/notifications\/(\d+)\/read$/);
            if (readMatch && req.method === 'PUT') {
              const id = parseInt(readMatch[1]);
              mockNotifications = mockNotifications.map(n => n.id === id ? { ...n, read: true } : n);
              res.end(JSON.stringify({ success: true }));
              return;
            }
            const deleteMatch = req.url.match(/\/api\/notifications\/(\d+)$/);
            if (deleteMatch && req.method === 'DELETE') {
              const id = parseInt(deleteMatch[1]);
              mockNotifications = mockNotifications.filter(n => n.id !== id);
              res.end(JSON.stringify({ success: true }));
              return;
            }
          }

          // Handle Employee Notifications
          if (req.url.startsWith('/api/employee/notifications')) {
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;

            if (req.url.includes('/unread-count')) {
              const unreadCount = mockNotifications.filter(n => !n.read).length;
              res.end(JSON.stringify({ unreadCount }));
              return;
            }
            if (req.url.includes('/unread')) {
              const unread = mockNotifications.filter(n => !n.read);
              res.end(JSON.stringify({ unreadCount: unread.length, unread }));
              return;
            }
            res.end(JSON.stringify(mockNotifications));
            return;
          }

          // Handle Employee Login
          if (req.url.includes('/api/employee/login') && req.method === 'POST') {
            let body = '';
            req.on('data', chunk => body += chunk.toString());
            req.on('end', () => {
              try {
                const data = JSON.parse(body);
                console.log("Login Trial:", data);

                // Check against stateful mockUsers array (case insensitive email/name)
                const user = mockUsers.find(u =>
                  (u.emailAddress?.toLowerCase() === data.email?.toLowerCase() ||
                    u.nameUsername?.toLowerCase() === data.email?.toLowerCase()) &&
                  String(u.accessPassword) === String(data.password)
                );

                if (user) {
                  console.log("Access Granted:", user.nameUsername);
                  res.setHeader('Content-Type', 'application/json');
                  res.statusCode = 200;
                  res.end(JSON.stringify({
                    message: "Login successful",
                    token: "mock-jwt-token-" + user.id,
                    id: user.id,
                    empId: user.id,
                    email: user.emailAddress,
                    firstName: user.firstName || user.nameUsername,
                    role: 'employee',
                    taskCounts: { active: 2, newTask: 1, completed: 5, failed: 0 }
                  }));
                  return;
                }

                // Static sandbox fallbackschandra
                if ((data.email === 'chandrab@gmail.com' && data.password === 'chandra123') ||
                  (data.email === 'suneetha@aja.com' && data.password === '123')) {
                  res.setHeader('Content-Type', 'application/json');
                  res.statusCode = 200;
                  res.end(JSON.stringify({
                    message: "Login successful",
                    token: "mock-jwt-token-sandbox",
                    id: 99,
                    empId: 99,
                    email: data.email,
                    firstName: "Chandra",
                    role: 'employee',
                    taskCounts: { active: 1, newTask: 0, completed: 10, failed: 0 }
                  }));
                  return;
                }
              } catch (e) {
                console.error("Login Parse Error:", e);
              }
              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 401;
              res.end(JSON.stringify({ message: "Invalid credentials" }));
            });
            return;
          }

          // Handle Admin Login
          if (req.url === '/api/admin/login' && req.method === 'POST') {
            let body = '';
            req.on('data', chunk => body += chunk.toString());
            req.on('end', () => {
              try {
                const data = JSON.parse(body);
                // Check against common admin credentials or mockUsers with admin role
                const isValidAdmin = (data.email === 'admin' && data.password === 'admin@123') ||
                  (data.email === 'admin@aja.com' && data.password === 'admin123');

                if (isValidAdmin) {
                  res.setHeader('Content-Type', 'application/json');
                  res.statusCode = 200;
                  res.end(JSON.stringify({
                    message: "Admin Login Successful",
                    token: "mock-admin-jwt-token",
                    role: "admin",
                    firstName: "System Admin"
                  }));
                  return;
                }
              } catch (e) { }
              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 401;
              res.end(JSON.stringify({ message: "Invalid Admin Credentials" }));
            });
            return;
          }

          if (req.url === '/api/profiles/employee' && req.method === 'GET') {
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            res.end(JSON.stringify({
              name: "Chandra Sekhar Bijibilla",
              designation: "Sr Backend Developer",
              systemName: "AJA Kernel",
              cohort: "2026",
              location: "Hyderabad, India",
              email: "chandrab@gmail.com",
              phone: "+91 9948654321",
              employeeId: 99,
              attendance: 100,
              codingScore: 100,
              profileImage: null
            }));
            return;
          }

          if (req.url.startsWith('/api/attendance/weekly') && req.method === 'GET') {
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            res.end(JSON.stringify(mockAttendanceHistory));
            return;
          }

          if (req.url.match(/^\/api\/profiles\/(.+)$/) && req.method === 'PUT') {
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            let body = '';
            req.on('data', chunk => body += chunk.toString());
            req.on('end', () => {
              try {
                const updated = JSON.parse(body || '{}');
                res.end(JSON.stringify({ message: "Profile updated successfully", data: updated }));
              } catch (e) {
                res.end(JSON.stringify({ message: "Profile updated successfully" }));
              }
            });
            return;
          }

          if (req.url.match(/employee-salary-management\/dashboard/) && req.method === 'GET') {
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            const urlObj = new URL(req.url, `http://${req.headers.host}`);
            const page = parseInt(urlObj.searchParams.get('page')) || 0;
            const size = parseInt(urlObj.searchParams.get('size')) || 5;

            const start = page * size;
            const end = start + size;
            const paginatedRecords = mockSimplifiedSalaries.slice(start, end);

            res.end(JSON.stringify({
              "records": paginatedRecords,
              "totalRecords": mockSimplifiedSalaries.length,
              "summary": { "totalNetValue": 756400, "filteredPeriodGross": 828400, "filteredPeriodDeductions": 72000 }
            }));
            return;
          }

          if (req.url.match(/employee-salary-management\/save/) && req.method === 'POST') {
            let body = '';
            req.on('data', chunk => body += chunk.toString());
            req.on('end', () => {
              try {
                const data = JSON.parse(body);
                const newRecord = {
                  id: Date.now(),
                  ...data,
                  transferDate: data.transferDate || new Date().toISOString().split('T')[0],
                  transactionStatus: data.transactionStatus || 'PAID'
                };
                mockSimplifiedSalaries.unshift(newRecord);
                res.setHeader('Content-Type', 'application/json');
                res.statusCode = 200;
                res.end(JSON.stringify({ message: "Simplified salary record issued successfully (Mock Signal)", data: newRecord }));
              } catch (e) {
                res.statusCode = 400;
                res.end(JSON.stringify({ message: "Invalid JSON in mock handler" }));
              }
            });
            return;
          }

          if (req.url.match(/employee-salary-management\/all/) && req.method === 'GET') {
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            res.end(JSON.stringify(mockSimplifiedSalaries));
            return;
          }

          if (req.url.match(/employee-salary-management\/id\/(\d+)/) && req.method === 'GET') {
            const match = req.url.match(/employee-salary-management\/id\/(\d+)/);
            const id = parseInt(match[1]);
            const record = mockSimplifiedSalaries.find(s => s.id === id);
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = record ? 200 : 404;
            res.end(JSON.stringify(record || { message: "Simplified salary record not found" }));
            return;
          }

          if (req.url.startsWith('/api/attendance/check-in') && req.method === 'POST') {
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            mockActivePunchIn = new Date().toISOString();
            res.end(JSON.stringify({ message: "Check-in successful", loginTime: mockActivePunchIn }));
            return;
          }

          if (req.url.startsWith('/api/attendance/check-out') && req.method === 'POST') {
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;

            const punchOutTimer = new Date().toISOString();
            let hours = '0h 0m 0s';
            if (mockActivePunchIn) {
              const diffMs = new Date(punchOutTimer) - new Date(mockActivePunchIn);
              const h = Math.floor(diffMs / (1000 * 60 * 60));
              const m = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
              const s = Math.floor((diffMs % (1000 * 60)) / 1000);
              hours = `${h}h ${m}m ${s}s`;
            } else {
              // If mocked server restarted during a punch-in, fake it
              mockActivePunchIn = new Date(Date.now() - 5000).toISOString();
              hours = "0h 0m 5s";
            }

            mockAttendanceHistory.push({
              id: Date.now(),
              employee: { username: 'Attendance' },
              date: new Date().toISOString().split('T')[0],
              loginTime: mockActivePunchIn,
              logoutTime: punchOutTimer,
              workingHours: hours,
              status: 'Present'
            });
            mockActivePunchIn = null;

            res.end(JSON.stringify({ message: "Check-out successful", logoutTime: punchOutTimer, workingHours: hours }));
            return;
          }

          // The original /api/employee-salary-management/dashboard handler is now replaced by the new one above.
          // The original /api/employee-salary-management/all handler is now replaced by the new one above.

          if (req.url.includes('/api/employee-salary-management/summary')) {
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            res.end(JSON.stringify({
              totalNetValue: 756400,
              filteredPeriodGross: 828400,
              filteredPeriodDeductions: 72000
            }));
            return;
          }

          if (req.url.includes('/api/employee-salary-management/id/')) {
            // Deprecated by the regex handler above, but keeping basic fallback
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            res.end(JSON.stringify(mockSimplifiedSalaries[0] || {}));
            return;
          }

          if (req.url.includes('/api/employee-salary-management/filter')) {
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            res.end(JSON.stringify([
              { id: 1, cycle: "January 2026", netAmount: 75000, transactionStatus: "Paid", transferDate: "2026-01-31", gross: 85000, deductions: 10000 }
            ]));
            return;
          }

          if (req.url.includes('/api/employee-salary-management/pagination')) {
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            res.end(JSON.stringify({
              content: [
                { id: 1, cycle: "January 2026", netAmount: 75000, transactionStatus: "Paid", transferDate: "2026-01-31", gross: 85000, deductions: 10000 }
              ],
              totalElements: 1
            }));
            return;
          }

          if (req.url === '/api/tasks/preview/document' && req.method === 'GET') {
            res.setHeader('Content-Type', 'image/png');
            res.statusCode = 200;
            try {
              const imagePath = path.resolve(__dirname, 'src/assets/doc-preview.png');
              if (fs.existsSync(imagePath)) {
                res.end(fs.readFileSync(imagePath));
              } else {
                res.end(Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==', 'base64'));
              }
            } catch (e) {
              res.end(Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==', 'base64'));
            }
            return;
          }

          if (req.url.includes('/api/tasks/get_task') && req.method === 'GET') {
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            res.end(JSON.stringify(mockTasks));
            return;
          }

          if (req.url.startsWith('/api/tasks/download/')) {
            // Serve the actual mission preview image for all image requests in dev
            const fileName = req.url.split('/').pop();
            const isPdf = fileName.toLowerCase().endsWith('.pdf');
            res.setHeader('Content-Type', isPdf ? 'application/pdf' : 'image/png');
            res.statusCode = 200;

            if (isPdf) {
              res.end("%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n3 0 obj\n<< /Type /Page /Parent 2 0 R /Resources << >> /Contents 4 0 R >>\nendobj\n4 0 obj\n<< /Length 21 >>\nstream\nBT /F1 12 Tf ET\nendstream\nendobj\nxref\n0 5\n0000000000 65535 f\n0000000009 00000 n\n0000000058 00000 n\n0000000115 00000 n\n0000000193 00000 n\ntrailer\n<< /Size 5 /Root 1 0 R >>\nstartxref\n264\n%%EOF");
            } else {
              try {
                // Return real image from assets
                const imagePath = path.resolve(__dirname, 'src/assets/mission-preview.png');
                if (fs.existsSync(imagePath)) {
                  res.end(fs.readFileSync(imagePath));
                } else {
                  // Fallback to minimal transparent PNG
                  res.end(Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==', 'base64'));
                }
              } catch (e) {
                res.end(Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==', 'base64'));
              }
            }
            return;
          }

          if (req.url === '/api/tasks/create' && req.method === 'POST') {
            let body = '';
            req.on('data', chunk => body += chunk.toString());
            req.on('end', () => {
              try {
                const newTask = JSON.parse(body);
                newTask.id = Date.now();
                mockTasks.push(newTask);
                res.setHeader('Content-Type', 'application/json');
                res.statusCode = 200;
                res.end(JSON.stringify({ message: "Your daily report has been saved successfully.", data: newTask }));
              } catch (e) {
                res.statusCode = 400;
                res.end(JSON.stringify({ message: "Invalid JSON" }));
              }
            });
            return;
          }

          if (req.url.includes('/api/challenges')) {
            res.setHeader('Content-Type', 'application/json');

            if (req.method === 'POST') {
              let body = '';
              req.on('data', chunk => body += chunk.toString());
              req.on('end', () => {
                const data = JSON.parse(body || '{}');
                const newChallenge = { id: Date.now(), ...data, status: 'PENDING' };
                res.statusCode = 200;
                res.end(JSON.stringify(newChallenge));
              });
              return;
            }

            res.statusCode = 200;
            if (req.url.endsWith('/solve-url')) {
              res.end(JSON.stringify({ url: "https://leetcode.com/discuss/general-discussion/4914/Interview-Preparation-Guide" }));
            } else if (req.url.match(/\/api\/challenges\/\d+$/)) {
              res.end(JSON.stringify({
                id: 1,
                title: "Advanced Algorithm Optimization",
                description: "Optimize the time complexity of the provided kernel module.",
                difficulty: "Hard",
                category: "Kernels",
                points: 500,
                timeLimit: "45 mins",
                solveUrl: "https://leetcode.com/problems/matrix-rotation"
              }));
            } else {
              res.end(JSON.stringify([
                { id: 1, title: "Backend Optimization", description: "Optimize the DB query performance.", difficulty: "Medium", category: "Fullstack", points: 200, status: 'OPEN', solveUrl: "https://leetcode.com/problems/two-sum" },
                { id: 2, title: "Algorithm Challenge", description: "Solve the matrix rotation puzzle.", difficulty: "Hard", category: "Algorithmic", points: 300, status: 'SOLVED', solveUrl: "https://leetcode.com/problems/rotate-image" }
              ]));
            }
            return;
          }

          /*
                    if (req.url === '/api/admin/login' && req.method === 'POST') {
                      res.setHeader('Content-Type', 'application/json');
                      res.statusCode = 200;
                      res.end(JSON.stringify({ token: "mock_admin_token", message: "Admin login successful" }));
                      return;
                    } */

          // Handle Admin Employees
          if (req.url.startsWith('/api/admin/employees')) {
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;

            if (req.url === '/api/admin/employees/active/count' && req.method === 'GET') {
              res.end(JSON.stringify(128));
              return;
            }

            if (req.url === '/api/admin/employees' && req.method === 'GET') {
              res.end(JSON.stringify([
                { id: 1, empId: 1, username: "Suneetha", firstName: "Suneetha", lastName: "Namburi", email: "suneetha@aja.com", department: "Engineering", designation: "Software Engineer", status: "Active" },
                { id: 2, empId: 2, username: "Arjun", firstName: "Arjun", lastName: "Mehta", email: "arjun@aja.com", department: "Finance", designation: "Analyst", status: "Active" },
                { id: 3, empId: 3, username: "Chandrasekar", firstName: "Chandrasekar", lastName: "Nair", email: "chandrasekar@aja.com", department: "Design", designation: "UI Designer", status: "Active" },
                { id: 4, empId: 4, username: "Siva", firstName: "Siva", lastName: "Yennam", email: "siva@aja.com", department: "HR", designation: "Manager", status: "Active" }
              ]));
              return;
            }
          }
          if (req.url.match(/admin\/salary-management/)) {
            res.setHeader('Content-Type', 'application/json');

            if (req.method === 'GET') {
              const idMatch = req.url.match(/admin\/salary-management\/(\d+)/);
              res.statusCode = 200;
              if (idMatch) {
                const id = parseInt(idMatch[1]);
                const record = mockStandardSalaries.find(s => s.id === id);
                res.end(JSON.stringify(record || mockStandardSalaries[0]));
              } else {
                res.end(JSON.stringify(mockStandardSalaries));
              }
              return;
            }

            if (req.method === 'POST') {
              let body = '';
              req.on('data', chunk => body += chunk.toString());
              req.on('end', () => {
                try {
                  const data = JSON.parse(body || '{}');
                  const newRecord = {
                    id: Date.now(),
                    ...data,
                    receiptDate: data.receiptDate || new Date().toISOString().split('T')[0],
                    status: data.status || 'PAID'
                  };
                  mockStandardSalaries.unshift(newRecord);
                  res.statusCode = 200;
                  res.end(JSON.stringify({
                    message: "Salary record processed successfully (Mock Signal)",
                    data: newRecord
                  }));
                } catch (e) {
                  res.statusCode = 400;
                  res.end(JSON.stringify({ message: "Invalid JSON in mock handler" }));
                }
              });
              return;
            }
          }

          // Remove overlapping handlers that are now redundant
          // The original /api/admin/salary-management handler is now replaced by the new one above.
          // The original /api/employee-salary-management/all handler is now replaced by the new one above.

          if (req.url.includes('/api/admin/submissions/fetch') && req.method === 'GET') {
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            res.end(JSON.stringify([
              { id: 1, employeeName: "suneetha", taskTitle: "API Kernel Optimization", taskCategory: "Engineering", submissionDate: "2026-03-10", status: "Approved", score: 95 },
              { id: 2, employeeName: "Arjun", taskTitle: "Q1 Financial Reconciliation", taskCategory: "Finance", submissionDate: "2026-03-10", status: "PENDING", score: null }
            ]));
            return;
          }

          if (req.url.includes('/api/admin/submissions/pending/count') && req.method === 'GET') {
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            res.end(JSON.stringify(1));
            return;
          }

          if (req.url.includes('/api/admin/submissions/pending') && req.method === 'GET') {
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            res.end(JSON.stringify([
              { id: 2, employeeName: "Arjun", taskTitle: "Q1 Financial Reconciliation", taskCategory: "Finance", submissionDate: "2026-03-10", status: "PENDING", score: null }
            ]));
            return;
          }

          if (req.url.match(/\/api\/admin\/submissions\/\d+\/(approve|reject)/) && (req.method === 'PUT' || req.method === 'POST')) {
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            res.end(JSON.stringify({ message: "Action authorized by Master Gateway" }));
            return;
          }

          if (req.url === '/api/notifications' && req.method === 'GET') {
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            res.end(JSON.stringify(mockNotifications));
            return;
          }

          if (req.url === '/api/notifications' && req.method === 'POST') {
            let body = '';
            req.on('data', chunk => body += chunk.toString());
            req.on('end', () => {
              const data = JSON.parse(body || '{}');
              const newNotif = {
                id: Date.now(),
                ...data,
                createdAt: new Date().toISOString()
              };
              mockNotifications.unshift(newNotif);
              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 200;
              res.end(JSON.stringify(newNotif));
            });
            return;
          }

          if (req.url === '/api/reports' && req.method === 'POST') {
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            res.end(JSON.stringify({ message: "Report archived successfully." }));
            return;
          }

          if (req.url === '/api/reports' && req.method === 'GET') {
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            res.end(JSON.stringify([
              { id: 1001, totalEmployees: 128, activeUsers: 104, tasksAssigned: 450, completionRate: 85.5 },
              { id: 1002, totalEmployees: 126, activeUsers: 98, tasksAssigned: 420, completionRate: 82.1 }
            ]));
            return;
          }

          if (req.url.match(/\/api\/reports\/\d+$/) && req.method === 'GET') {
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            res.end(JSON.stringify({
              id: 1001,
              totalEmployees: 128,
              activeUsers: 104,
              tasksAssigned: 450,
              completionRate: 85.5
            }));
            return;
          }

          if (req.url.includes('/api/admin/attendance/dashboard') && req.method === 'GET') {
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            res.end(JSON.stringify([
              { name: "Suneetha", department: "Engineering", email: "suneetha@aja.com", todayStatus: "PRESENT", loginTime: "09:00 AM", lastWeekScore: 95, monthScore: 98, monthPresentDays: 21, absenceCount: 0 },
              { name: "Arjun", department: "Finance", email: "arjun@aja.com", todayStatus: "PRESENT", loginTime: "09:15 AM", lastWeekScore: 88, monthScore: 92, monthPresentDays: 19, absenceCount: 1 },
              { name: "Chandrasekar", department: "Design", email: "chandrasekar@aja.com", todayStatus: "PRESENT", loginTime: "10:00 AM", lastWeekScore: 92, monthScore: 90, monthPresentDays: 20, absenceCount: 0 },
              { name: "Siva", department: "HR", email: "siva@aja.com", todayStatus: "NOT_MARKED", loginTime: "-", lastWeekScore: 75, monthScore: 82, monthPresentDays: 15, absenceCount: 3 },
              { name: "Manasvi", department: "Engineering", email: "manasvi@aja.com", todayStatus: "NOT_MARKED", loginTime: "-", lastWeekScore: 85, monthScore: 88, monthPresentDays: 18, absenceCount: 2 }
            ]));
            return;
          }

          if (req.url.includes('/api/admin/attendance/mark') && req.method === 'POST') {
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            res.end(JSON.stringify({ message: "Attendance record established successfully." }));
            return;
          }

          if (req.url.includes('/api/admin/attendance/popup') && req.method === 'GET') {
            const url = new URL(req.url, `http://${req.headers.host}`);
            const name = url.searchParams.get('name') || "Employee";
            const date = url.searchParams.get('date') || new Date().toISOString().split('T')[0];

            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            res.end(JSON.stringify({
              name: name,
              department: "Engineering",
              date: date,
              monthScore: 94,
              lastWeekScore: 89,
              monthPresentDays: 20,
              absenceCount: 1,
              loginTime: "09:00 AM",
              logoutTime: "06:00 PM",
              averageWorkingHours: "8h 45m",
              onTimeArrivalRate: "92%",
              monthlyAttendance: "96%",
              last5Days: [
                { date: '2026-03-10', status: 'Present', checkIn: '09:00 AM' },
                { date: '2026-03-09', status: 'Present', checkIn: '08:55 AM' },
                { date: '2026-03-08', status: 'Present', checkIn: '09:05 AM' },
                { date: '2026-03-07', status: 'Present', checkIn: '08:50 AM' },
                { date: '2026-03-06', status: 'Absent', checkIn: '-' }
              ]
            }));
            return;
          }

          if (req.url.includes('/api/attendance/all') && req.method === 'GET') {
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            res.end(JSON.stringify([
              { id: 101, employee: { username: "Suneetha", email: "suneetha@aja.com", role: "Sr Developer" }, loginTime: "2026-03-10T09:00:00Z", logoutTime: "2026-03-10T18:00:00Z", workingHours: "9h 0m", status: "Present", date: "2026-03-10" },
              { id: 102, employee: { username: "Arjun", email: "arjun@aja.com", role: "Analyst" }, loginTime: "2026-03-10T09:15:00Z", logoutTime: "2026-03-10T17:45:00Z", workingHours: "8h 30m", status: "Present", date: "2026-03-10" },
              { id: 103, employee: { username: "Chandrasekar", email: "chandrasekar@aja.com", role: "UI Designer" }, loginTime: "2026-03-10T10:00:00Z", logoutTime: "2026-03-11T00:30:00Z", workingHours: "9h 0m", status: "Present", date: "2026-03-10" },
              { id: 104, employee: { username: "Siva", email: "siva@aja.com", role: "Manager" }, loginTime: null, logoutTime: null, workingHours: "0h 0m", status: "Absent", date: "2026-03-10" }
            ]));
            return;
          }

          if (req.url.includes('/api/admin/tasks') && req.method === 'GET') {
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            res.end(JSON.stringify(mockAdminTasks));
            return;
          }

          if (req.url.startsWith('/api/admin/assign/tasks/delete/') && req.method === 'DELETE') {
            const id = parseInt(req.url.split('/').pop());
            mockAdminTasks = mockAdminTasks.filter(t => t.id !== id);
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            res.end(JSON.stringify({ message: "Task deleted successfully" }));
            return;
          }

          if (req.url.startsWith('/api/admin/tasks/delete/') && req.method === 'DELETE') {
            const id = parseInt(req.url.split('/').pop());
            mockAdminTasks = mockAdminTasks.filter(t => t.id !== id);
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            res.end(JSON.stringify({ message: "Task deleted successfully" }));
            return;
          }

          if (req.url === '/api/users' && req.method === 'GET') {
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            res.end(JSON.stringify(mockUsers));
            return;
          }

          if (req.url.match(/\/api\/users\/\d+$/) && req.method === 'GET') {
            const id = parseInt(req.url.split('/').pop());
            const user = mockUsers.find(u => u.id === id);
            res.setHeader('Content-Type', 'application/json');
            if (user) {
              res.statusCode = 200;
              res.end(JSON.stringify(user));
            } else {
              res.statusCode = 404;
              res.end(JSON.stringify({ message: "Node not found" }));
            }
            return;
          }

          if (req.url.match(/\/api\/users\/\d+$/) && req.method === 'DELETE') {
            const id = parseInt(req.url.split('/').pop());
            mockUsers = mockUsers.filter(u => u.id !== id);
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            res.end(JSON.stringify({ message: "Node identity terminated" }));
            return;
          }

          if (req.url.match(/\/api\/users\/\d+$/) && req.method === 'PUT') {
            let body = '';
            req.on('data', chunk => body += chunk.toString());
            req.on('end', () => {
              const id = parseInt(req.url.split('/').pop());
              const data = JSON.parse(body);
              mockUsers = mockUsers.map(u => u.id === id ? { ...u, ...data } : u);
              const updatedUser = mockUsers.find(u => u.id === id);
              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 200;
              res.end(JSON.stringify(updatedUser));
            });
            return;
          }

          if (req.url === '/api/admin/employees' && req.method === 'POST') {
            let body = '';
            req.on('data', chunk => body += chunk.toString());
            req.on('end', () => {
              const data = JSON.parse(body);
              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 200;
              res.end(JSON.stringify({ id: Date.now(), ...data, message: "Admin employee created" }));
            });
            return;
          }

          if (req.url === '/api/employee/register' && req.method === 'POST') {
            let body = '';
            req.on('data', chunk => body += chunk.toString());
            req.on('end', () => {
              const data = JSON.parse(body);
              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 200;
              res.end(JSON.stringify({ message: "Employee registered successfully", user: data }));
            });
            return;
          }

          if (req.url === '/api/users' && req.method === 'POST') {
            let body = '';
            req.on('data', chunk => body += chunk.toString());
            req.on('end', () => {
              const data = JSON.parse(body);
              const newUser = { id: Date.now(), ...data };
              mockUsers.push(newUser);
              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 200;
              res.end(JSON.stringify({ ...newUser, message: "User identity established" }));
            });
            return;
          }

          if (req.url === '/api/profiles/create' && req.method === 'POST') {
            let body = '';
            req.on('data', chunk => body += chunk.toString());
            req.on('end', () => {
              const data = JSON.parse(body);
              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 200;
              res.end(JSON.stringify({ message: "Digital profile initialized", profile: data }));
            });
            return;
          }

          // Handle Admin Dashboard Summary
          if (req.url === '/api/admin/dashboard/summary' && req.method === 'GET') {
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            res.end(JSON.stringify({
              totalEmployees: mockUsers.length,
              presentToday: Math.floor(mockUsers.length * 0.8),
              completedTasks: 450,
              pendingTasks: 32,
              recentEmployees: mockUsers.slice(0, 5).map(u => ({
                id: u.id,
                name: u.nameUsername,
                designation: u.dept,
                completedTasks: Math.floor(Math.random() * 20),
                active: true
              }))
            }));
            return;
          }

          // Handle Admin Departments
          if (req.url.startsWith('/api/admin/departments')) {
            res.setHeader('Content-Type', 'application/json');

            if (req.url === '/api/admin/departments/fetch' && req.method === 'GET') {
              res.statusCode = 200;
              res.end(JSON.stringify(mockDepartments));
              return;
            }

            if (req.url === '/api/admin/departments/create' && req.method === 'POST') {
              let body = '';
              req.on('data', chunk => body += chunk.toString());
              req.on('end', () => {
                try {
                  const data = JSON.parse(body);
                  const newDept = {
                    id: mockDepartments.length > 0 ? Math.max(...mockDepartments.map(d => d.id)) + 1 : 1,
                    name: data.name,
                    count: 0,
                    percent: 0,
                    head: 'TBD',
                    budget: '₹0L',
                    status: 'Active',
                    description: 'No description provided.'
                  };
                  mockDepartments.push(newDept);
                  res.statusCode = 200;
                  res.end(JSON.stringify({ message: "Department created successfully", data: newDept }));
                } catch (e) {
                  res.statusCode = 400;
                  res.end(JSON.stringify({ message: "Invalid JSON" }));
                }
              });
              return;
            }

            const deleteMatch = req.url.match(/\/api\/admin\/departments\/(\d+)$/);
            if (deleteMatch && req.method === 'DELETE') {
              const id = parseInt(deleteMatch[1]);
              mockDepartments = mockDepartments.filter(d => d.id !== id);
              res.statusCode = 200;
              res.end(JSON.stringify({ message: "Department deleted successfully" }));
              return;
            }
          }

          next();
        });
      }
    }
  ],
  server: {
    port: 5173,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8081',
        changeOrigin: true,
        secure: false,
      },
      '/admin': {
        target: 'http://localhost:8081',
        changeOrigin: true,
        secure: false,
        bypass: (req) => {
          if (req.headers.accept?.includes('text/html')) {
            return '/index.html';
          }
        }
      },
    },
  },
})
