import express, { NextFunction, Request, Response } from 'express';
import { authRouts } from './modules/auth/auth.rout';
import { userRoutes } from './modules/user/user.rout';
import { contactRoutes } from './modules/contact/contact.route';

import { dashboardRouts } from './modules/dasboard/dashboard.rout';
import { settingsRoutes } from './modules/settings/settings.rout';
import { productRoutes } from './modules/products/products.route';
import { paymentsRoutes } from './modules/payments/payments.route';
import { reviewRoutes } from './modules/review/review.route';
import { bannerRouts } from './modules/banner/banner.route';
import { ReelsRouts } from './modules/stories/stories.rout';
import { notificationRoute } from './modules/notification/notification.routes';
import { packageRouts } from './modules/package/package.rout';
import { favouriteRouts } from './modules/favourites/favourites.rout';


const router = express.Router();

const moduleRoutes = [
    {
        path: '/auth',
        route: authRouts,
    },
    {
        path: '/users',
        route: userRoutes,
    },
    {
        path: '/contacts',
        route: contactRoutes,
    },
    {
        path: '/dashboard',
        route: dashboardRouts,
    },
    {
        path: '/products',
        route: productRoutes,
    },
    {
        path: '/reviews',
        route: reviewRoutes,
    },
    {
        path: '/banners',
        route: bannerRouts,
    },
    {
        path: '/reels',
        route: ReelsRouts,
    },
    {
        path: '/notifications',
        route: notificationRoute,
    },
    {
        path: '/setting',
        route: settingsRoutes,
    },
    {
        path: '/packages',
        route: packageRouts,
    },
    {
        path: '/payments',
        route: paymentsRoutes,
    },
    {
        path: '/favourites',
        route: favouriteRouts,
    }
];

moduleRoutes.forEach(route => router.use(route.path, route.route));

export default router;