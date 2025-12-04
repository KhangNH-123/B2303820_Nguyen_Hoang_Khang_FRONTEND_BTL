export const authUtils = {
  logoutAll: () => {
    console.log('🚪 Logging out from ALL accounts');
    localStorage.removeItem("userToken");
    localStorage.removeItem("userData");
    localStorage.removeItem("userLastActivity");
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminData");
    localStorage.removeItem("adminLastActivity");
  },

  checkActiveSession: () => {
    const hasUserToken = !!localStorage.getItem("userToken");
    const hasAdminToken = !!localStorage.getItem("adminToken");

    return {
      hasUserSession: hasUserToken,
      hasAdminSession: hasAdminToken,
      isUserActive: hasUserToken && !hasAdminToken,
      isAdminActive: hasAdminToken && !hasUserToken,
      hasBothSessions: hasUserToken && hasAdminToken
    };
  },

  getTokenForCurrentRoute: () => {
    const isAdminRoute = window.location.pathname.includes('/admin');

    if (isAdminRoute) {
      return localStorage.getItem('adminToken');
    } else {
      return localStorage.getItem('userToken');
    }
  }
};