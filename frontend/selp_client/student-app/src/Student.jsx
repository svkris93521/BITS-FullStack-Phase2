import * as React from 'react';
import StudentRequest from './StudentRequest';
import { useAuth } from '/src/App';


function Student() {
 const { user, isAuthenticated } = useAuth();

  return (
    <>
    <StudentRequest />
    </>
  );
}

export default Student;