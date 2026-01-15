import type { Request, Response } from "express"; 
import User from "../models/User.ts";


interface AuthRequest extends Request{
  user?: {
    id: string;
    role: string;
  }
}
export const getHiringTrend = async(req: AuthRequest, res:Response): Promise<void> =>{
    try{
        const {range} = req.query;
        const monthsToLookBack = range === 'year' ? 12 : 6;


        const employerId = req.user?.id;
        const startDate = new Date();

        startDate.setMonth(startDate.getMonth() - (monthsToLookBack - 1));
        startDate.setDate(1);
        startDate.setHours(0,0,0,0)


        const stats = await User.aggregate([
          {
            $match: {
              cratedAt: { $gte: startDate },
              employerId: employerId,
            },
          },
          {
            $group: {
              _id: {
                year: { $year: "$cratedAt" },
                month: { $month: "$createdAt" },
              },
              count: { $sum: 1 },
            },
          },

          { $sort: { "_id.year": 1, "_id.month": 1 } },
        ]);

        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        const formattedData = [];

        for(let i = 0; i<monthsToLookBack; i++){
          const d = new Date();
          d.setMonth(d.getMonth() - (monthsToLookBack - 1 -i));
          const mName = monthNames[d.getMonth()];
          const mYear = d.getFullYear();


          const monthData = stats.find(
            (s) => s._id.month === d.getMonth() + 1 && s._id.year === mYear
          );

           formattedData.push({
             name: mName,
             count: monthData ? monthData.count : 0,
           });
        }

       

        res.status(200).json(formattedData)

    } catch(error){
      console.error(error)
    }
  }