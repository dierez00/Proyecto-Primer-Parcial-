import { JSX } from 'react';
import OrderData from '../modules/order/OrderData';
import UserForm from '../modules/user/UserForm';
import ProductData from '../modules/product/ProductData';

export interface AppRoute{
    path: string;
    element: JSX.Element;
    label?: string;
    icon?: string;
    //roleIds?: string[];
    //hidden?: boolean;
}

const routes: AppRoute[] = [
    {
        path: '/dashboard',
        element: <UserForm />,
        label: 'Inicio',
        icon: 'HomeOutlined', 
    },
    {
        path: '/users',
        element: <UserForm />,
        label: 'Usuarios',
        icon: 'UserOutlined',
    },
    {
        path: '/products',
        element: <ProductData />,
        label: 'Usuarios',
        icon: 'UserOutlined',
    },
    {
        path: '/orders',
        element: <OrderData />,
        label: 'Usuarios',
        icon: 'UserOutlined',
    },
    {
        path: '/report',
        element: <UserForm/>,
        label: 'Reportes',
        icon: 'UserOutlined',
    }
]

export default routes;