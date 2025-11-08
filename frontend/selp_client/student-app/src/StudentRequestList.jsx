import * as React from 'react';
import StudentList from './StudentList';
import { useAuth } from '/src/App';

function StudentRequestList() {
  const { user, username, isAuthenticated } = useAuth();

  return (
    <>
    <StudentList />

    </>
  );
}

export default StudentRequestList;