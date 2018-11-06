export default [
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      {
        path: '/user',
        redirect: '/user/login'
      },
      {
        path: '/user/login',
        component: './User/Login'
      },
      {
        path: '/user/register',
        component: './User/Register'
      },
      {
        path: '/user/register-result',
        component: './User/RegisterResult'
      },
      {
        path: '/user/forget-password',
        component: './User/forgetPassword'
      }
    ],
  },
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized', 'src/components/AuthMenu'],
    authority: ['admin'],
    routes: [
      {
        path: '403',
        component: './Exception/403',
      },
      {
        component: '404',
      },
    ],
  },
];
