import { JSX } from 'react';
import OrderData from '../modules/order/OrderData';
import UserForm from '../modules/user/UserForm';
import ProductData from '../modules/product/ProductData';

export interface AppRoute{
    path: string;
    element: JSX.Element;
    label?: string;
    icon?: string;
    allowedRoles?: string[];
    //roleIds?: string[];
    //hidden?: boolean;
}

const routes: AppRoute[] = [
  {
    path: '/dashboard',
    element: <UserForm />,
    label: 'Inicio',
    icon: 'HomeOutlined',
    allowedRoles: ['admin', 'usuario']
  },
  {
    path: '/users',
    element: <UserForm />,
    label: 'Usuarios',
    icon: 'UserOutlined',
    allowedRoles: ['admin']
  },
  {
    path: '/products',
    element: <ProductData />,
    label: 'Productos',
    icon: 'UserOutlined',
    allowedRoles: ['admin', 'editor']
  },
  {
    path: '/orders',
    element: <OrderData />,
    label: 'Órdenes',
    icon: 'UserOutlined',
    allowedRoles: ['admin', 'editor']
  },
  {
    path: '/report',
    element: <UserForm />,
    label: 'Reportes',
    icon: 'UserOutlined',
    allowedRoles: ['usuario']
  }
];

export default routes;