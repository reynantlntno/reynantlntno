// auth-check.js

function checkAuth() {
    // Get the token from the cookie
    const cookies = document.cookie.split(';');
    let token = null;
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.startsWith('token=')) {
        token = cookie.substring('token='.length, cookie.length);
        break;
      }
    }
  
    // If no token is found, redirect to manage.htm
    if (!token) {
      // Check if the current URL already includes "manage.htm"
      if (!window.location.pathname.endsWith('/private/manage.htm')) {
        window.location.href = '/private/manage.htm'; 
      } 
    }
  }
  
  checkAuth();