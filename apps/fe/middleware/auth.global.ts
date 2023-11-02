export default defineNuxtRouteMiddleware(async(to, from) => {
  
  //   const token = useCookie('token');
  //   const anonymousPaths = ['resetpassword'];
    
  //   // TODO: check token expiry, i.e.  // console.log(jwt, new Date(jwt.exp * 1000));
  //   if(!token.value && !anonymousPaths.find((x) => to.path.includes(x)) && to.path !== '/') {
  //     return navigateTo('/');
  //   } 
  
  //   if(token.value) {
  //     const tokenState = useState<string>('token', () => '');
  //     tokenState.value = token.value;
  //   }
  const hasAdminRole = useState('hasAdmin', () => false);
  const hasCheckedAdmin = useState('hasCheckedAdmin', () => false);
  console.log('checking admin role - ' + hasAdminRole.value);

  // Check if there is an admin user
  if(!hasAdminRole.value && (to.path !== '/create-app' || !hasCheckedAdmin.value)) {

    const config = useRuntimeConfig();

    try {
      const { data } = await useFetch<{ requireAdmin: boolean }>(`${config.public.apiBase}/auth/check-admin`);
      console.log('Admin found in be?', data.value);
      hasCheckedAdmin.value = true;

      if(data.value?.requireAdmin) {
        console.log('No admin found - redirecting to create app');
        return navigateTo('/create-app');
      }

      console.log('Admin found - setting hasAdminRole');
      hasAdminRole.value = true;
    } catch (err) {
      console.log('Error checking admin role', err);
    }
  }
    
});