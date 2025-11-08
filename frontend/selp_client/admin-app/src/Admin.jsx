import * as React from 'react';
// use the shared ItemList component from the main client src/components folder
import ItemList from './ItemList';
import { useAuth } from '/src/App';


function Admin() {
    const { user, username, isAuthenticated } = useAuth();

  return (
    <>
    <ItemList />
    </>
  );
}

export default Admin;