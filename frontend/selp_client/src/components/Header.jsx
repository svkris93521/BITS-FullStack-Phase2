import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import IconButton from '@mui/material/IconButton';
import LogoutIcon from '@mui/icons-material/Logout';
import SchoolIcon from '@mui/icons-material/School';
import WorkIcon from '@mui/icons-material/Work';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { useAuth } from '/src/App';
// FIX: Mocking useAuth to resolve compilation error when external file /src/App is missing
// const useAuth = () => ({ 
//    username: 'JohnDoe', // Mocked user for compilation purposes
 //   isAuthenticated: true, 
  //  logoutUser: () => console.log('Logged out'), 
   // role: 'Admin' // Mocked role
//});

const Header = () => {
  // Now relies on the actual username provided by the imported useAuth hook (or the mock above)
  const { user, username, isAuthenticated, logoutUser, role } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  // Action handlers carried across from per-page TopNav components
  const userLogout = async () => {
    logoutUser();
    navigate('/login');
  };

  const userAddRequest = async () => {
    navigate('/studentList');
  };

  const goStaffHome = async () => {
    navigate('/staff');
  };

  const goAdminAdd = async () => {
    navigate('/AdminAddItem');
  };

  const goAdminEdit = async () => {
    navigate('/AdminEditItem');
  };

  const goAdminDelete = async () => {
    navigate('/AdminDeleteItem');
  };
  
  // Convert current path to lowercase for reliable matching (fix from previous step)
  const currentPath = location.pathname.toLowerCase();

  const homeNavigate = async () => {
            // navigate based on user role
            if (!isAuthenticated) {
              navigate('/');
              return;
            }
            switch ((role || '').toLowerCase()) {
              case 'student':
                navigate('/student');
                break;
              case 'staff':
                navigate('/staff');
                break;
              case 'admin':
                navigate('/admin');
                break;
              default:
                navigate('/');
            }
          };

  return (
    <header className="site-header">
      <div className="header-inner">
        <div className="brand">
            {role && (
          <div className="brand-label" role="img" aria-label={`SELP ${role}`}>
            {(() => {
              const r = (role || '').toLowerCase();
              if (r === 'student') {
                return (
                  <>
                    <SchoolIcon onClick={homeNavigate} className="role-icon" sx={{ fontSize: 28, color: 'rgba(255,255,255,0.95)' }} />
                    <span className="role-label">(Student)</span>
                  </>
                );
              }
              if (r === 'staff') {
                return (
                  <>
                    <WorkIcon onClick={homeNavigate} className="role-icon" sx={{ fontSize: 28, color: 'rgba(255,255,255,0.92)' }} />
                    <span className="role-label">(Staff)</span>
                  </>
                );
              }
              return (
                <>
                  <AdminPanelSettingsIcon onClick={homeNavigate} className="role-icon" sx={{ fontSize: 28, color: 'rgba(255,255,255,0.95)' }} />
                  <span className="role-label">(Admin)</span>
                </>
              );
            })()}
          </div>
        )}
          
        </div>
        {/* role icon (image) next to home icon — shows student/staff/admin icon based on role */}
        
        {/* left-side navigation removed per request */}

        {/* Per-page action buttons: show based on current pathname (now case-insensitive) */}
        <div className="header-actions">
          {currentPath.includes('/student') && (
            <>
              <button className="action-btn" onClick={userAddRequest}>Request Item</button>
            </>
          )}

          {currentPath.includes('/staff') && (
            <>
              <button className="action-btn" onClick={goStaffHome}>Staff Home</button>
            </>
          )}

          {currentPath.includes('/admin') && (
            <>
              <button className="action-btn" onClick={goAdminAdd}>Add Item</button>
              <button className="action-btn" onClick={goAdminEdit}>Edit Item</button>
              <button className="action-btn" onClick={goAdminDelete}>Delete Item</button>
            </>
          )}
        </div>

        <div className="auth-area">
          {isAuthenticated ? (
            <>
              <span className="username">{username || 'User'}</span>
              <IconButton className="signout-btn" onClick={userLogout} aria-label="Sign out" color="inherit">
                <LogoutIcon />
              </IconButton>
            </>
          ) : (
            <Link to="/login">Sign in</Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;