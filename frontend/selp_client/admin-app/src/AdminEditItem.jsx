import * as React from 'react';
import ItemEdit from './ItemEdit';

import { useAuth } from '/src/App';


function AdminEditItem() {  
const { user, username, isAuthenticated } = useAuth();

  return (
    <>
    <ItemEdit />
    </>
  );
}

export default AdminEditItem;