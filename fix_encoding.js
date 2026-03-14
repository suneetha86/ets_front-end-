import fs from 'fs';
const files = [
  'src/components/employee/views/Salary.jsx',
  'src/components/employee/views/MyTasks.jsx',
  'src/components/admin/views/AdminDashboardHome.jsx'
];
files.forEach(file => {
  if (fs.existsSync(file)) {
    let d = fs.readFileSync(file, 'utf8');
    d = d.replace(/â‚¹/g, '₹');
    d = d.replace(/â€”/g, '—');
    d = d.replace(/â€¢/g, '•');
    fs.writeFileSync(file, d, 'utf8');
    console.log('Fixed', file);
  }
});
