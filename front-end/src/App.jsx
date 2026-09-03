import { BrowserRouter, Routes, Route } from 'react-router-dom';


import DashboardLayout from './layouts/DashboardLayout';
import ProtectedRoute from  '../src/components/common/ProtectedRoute';
import Dashboard from './pages/dashboard/Dashboard';
import Login from './pages/auth/Login';
import Students from './pages/students/Students';
import Attendance from './pages/attendance/Attendance';
import Fees from './pages/fees/Fees';
import Exams from './pages/exams/Exams';
import Staff from './pages/staff/Staff';
import Reports from './pages/reports/Reports';
import Settings from './pages/settings/Settings';
import Accounting from './pages/accounting/Accounting';
import Backup from './pages/backup/Backup'
import ExamSubjects from './pages/exams/ExamSubjects';
import Marks from './pages/marks/Marks';
import Results from './pages/results/Results';
import Timetable from './pages/timetable/TimeTable';
import Parents from './pages/parents/Parents';
import ParentStudent from './pages/parents/ParentStudent';
import Notices from './pages/notices/Notices';

function App() {
  return (
   <BrowserRouter>
      <Routes>
        {/* Auth Route */}
        <Route path="/login" element={<Login/>} />
        <Route element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }></Route>
        <Route element={<DashboardLayout/>}>
        <Route path="/" element={<Dashboard/>} />
        <Route path="/students" element={<Students/>} />
          <Route path="/attendance" element={<Attendance/>} />
          <Route path="/fees" element={<Fees/>} />
          <Route path="/exams" element={<Exams/>} />
          <Route path="/staff" element={<Staff/>} />
          <Route path="/reports" element={<Reports/>} />
        <Route path="/exam-subjects" element={<ExamSubjects />} />
       <Route path="/marks" element={<Marks/>} />
        <Route path="/results" element={<Results/>} />
        <Route path="/timetable" element={<Timetable/>} />
          <Route path="/parents" element={<Parents/>} />
          <Route path="/parent-students" element={<ParentStudent/>} />
           <Route path="/notices" element={<Notices/>} />


          <Route path="/settings" element={<Settings />} />
          <Route path="/accounting" element={<Accounting />} />
          <Route path="/backup" element={<Backup />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;