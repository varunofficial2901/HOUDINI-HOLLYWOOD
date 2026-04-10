import { createContext, useContext, useState } from "react";

const EnrollmentContext = createContext(null);

export function EnrollmentProvider({ children }) {
  const [enrollments, setEnrollments] = useState([]);

  const addEnrollment = (courseId, userName, email) => {
    setEnrollments(prev => [...prev, { courseId, userName, email }]);
  };

  return (
    <EnrollmentContext.Provider value={{ enrollments, addEnrollment }}>
      {children}
    </EnrollmentContext.Provider>
  );
}

export const useEnrollment = () => useContext(EnrollmentContext);