/**
 * @file This middleware handles auth for the app.
 */
export default defineNuxtRouteMiddleware(async(to) => {

  /**
   * Checking for auth using JWT cookie.
   */
  const token = useCookie<string>('token');
  if(token.value) {
    useState('isAdmin', () => true);
  }

  // Not too worried about security for this demo, normally would worry about httpOnly, sameSite and secure flags
  const adminCheck = useCookie<boolean>('admCheckResult');

  // Set cookie for persistent session state
  if(!adminCheck.value) {
    adminCheck.value = false;
  }

  /**
   * Check if there is an admin user that exists on the system.
   * If not, redirect to create-app page.
   * This would be refined in a real-world app to prevent so many calls to the API.
   */ 
  if(!adminCheck.value && to.path !== '/create-app') {

    const config = useRuntimeConfig();

    try {
      const { data } = await useFetch<{ requireAdmin: boolean }>(`${config.public.apiBase}/auth/check-admin`);

      if(data.value?.requireAdmin) {
        return navigateTo('/create-app');
      } 
      adminCheck.value = true;
        
    } catch (err) {
      console.error('Error checking admin role', err);
    }
  }

  // Set client-side state
  useState('adminExists', () => adminCheck.value);

  if(adminCheck.value && to.path === '/create-app') {
    return navigateTo('/');
  }
    
});