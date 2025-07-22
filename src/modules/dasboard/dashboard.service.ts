import moment from "moment";
import { User } from "../user/user.models";
import Payment from "../payments/payments.models";
import { Products } from "../products/products.model";


const userChart = async (query: Record<string, any>) => {
    const userYear = query?.JoinYear ?? moment().year();
    const startOfUserYear = moment().year(userYear).startOf('year');
    const endOfUserYear = moment().year(userYear).endOf('year');

    const monthlyUser = await User.aggregate([
        {
            $match: {
                status: 1,
                createdAt: {
                    $gte: startOfUserYear.toDate(),
                    $lte: endOfUserYear.toDate(),
                },
            },
        },
        {
            $group: {
                _id: { month: { $month: '$createdAt' } },
                total: { $sum: 1 }, // Corrected to count the documents
            },
        },
        {
            $sort: { '_id.month': 1 },
        },
    ]);

    // Format monthly income to have an entry for each month
    const formattedMonthlyUsers = Array.from({ length: 12 }, (_, index) => ({
        month: moment().month(index).format('MMM'),
        total: 0,
    }));

    monthlyUser.forEach(entry => {
        formattedMonthlyUsers[entry._id.month - 1].total = Math.round(entry.total);
    });
    return formattedMonthlyUsers
}

const earningChart = async (query: Record<string, any>) => {
    const year = query.incomeYear ? query.incomeYear : moment().year();
    const startOfYear = moment().year(year).startOf('year');
    const endOfYear = moment().year(year).endOf('year');

    const monthlyIncome = await Payment.aggregate([
        {
            $match: {
                isPaid: true,
                createdAt: {
                    $gte: startOfYear.toDate(),
                    $lte: endOfYear.toDate(),
                },
            },
        },
        {
            $group: {
                _id: { month: { $month: '$createdAt' } },
                income: { $sum: '$total_amount' },
            },
        },
        {
            $sort: { '_id.month': 1 },
        },
    ]);

    // Format monthly income to have an entry for each month
    const formattedMonthlyIncome = Array.from({ length: 12 }, (_, index) => ({
        month: moment().month(index).format('MMM'),
        income: 0,
    }));

    monthlyIncome.forEach(entry => {
        formattedMonthlyIncome[entry._id.month - 1].income = Math.round(
            entry.income,
        );
    });

    return formattedMonthlyIncome
}

const countData = async () => {
    const totalUsers = await User.countDocuments({ status: 1 });

    const totalEarning = await Payment.aggregate([
        {
            $match: { isPaid: true }
        },
        {
            $group: {
                _id: null,
                totalAmount: { $sum: "$total_amount" }
            }
        }
    ]);

    const totalAmount = totalEarning.length > 0 ? totalEarning[0].totalAmount : 0;

    const totalProducts = await Products.countDocuments({isDeleted : false});

    return { totalEarnings: totalAmount.toFixed(2), totalUsers: totalUsers.toFixed(), totalProducts }
}

export const dashboardService = {
    userChart,
    earningChart,
    countData
}