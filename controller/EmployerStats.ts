import Job from "../models/job.ts";
import jobApplication from "../models/jobApplication.ts";

export const getEmployerStats = async(req: any, res: any)=>{
    try{

        // step 1 
        const employerId = req.user.id;
        const now = new Date();

        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

       
        // step 2 
        const employerJobs = await Job.find({createdBy: employerId}).select("_id");
        const jobIds = employerJobs.map(job => job._id.toString());

        //    step 3
        
        const [
          totalJobs,
          prevTotalJobs,
          totalApplicants,
          prevTotalApplicants,
          interviews,
          prevInterviews,
          hires,
          prevHires,
        ] = await Promise.all([
          // Jobs (createdBy correct naming)
          Job.countDocuments({ createdBy: employerId }),
          Job.countDocuments({
            createdBy: employerId,
            createdAt: { $lt: thirtyDaysAgo}
          }),

          // Applicants
          jobApplication.countDocuments({ appId: { $in: jobIds } }),
          jobApplication.countDocuments({
            appId: { $in: jobIds },
            createdAt: { $lt: thirtyDaysAgo}
          }),

          // Interviews
          jobApplication.countDocuments({
            appId: { $in: jobIds },
            status: "interviewing",
          }),
          jobApplication.countDocuments({
            appId: { $in: jobIds },
            status: "interviewing",
            createdAt: { $lt: thirtyDaysAgo },
          }),

          // Hires
          jobApplication.countDocuments({
            appId: { $in: jobIds },
            status: "hired",
          }),
          jobApplication.countDocuments({
            appId: { $in: jobIds },
            status: "hired",
            createdAt: { $lt: thirtyDaysAgo },
          }),
        ]);
      
        
          // step 4

          const calculatePercentage = (current: number, previous: number) => {
            const curr = current || 0;
            const prev = previous || 0;

            if (prev === 0) return curr > 0 ? 100 : 0;

            const diff = ((curr - prev) / prev) * 100;
            const result = parseFloat(diff.toFixed(1));

            return isFinite(result) ? result : 0;
          };


        res.status(200).json({
          // main value
          totalJobs,
          totalApplicants,
          totalInterviews: interviews,
          totalHires: hires,

          //  Dynamic Percentage
          jobsPercentage: calculatePercentage(totalJobs, prevTotalJobs),
          applicantsPercentage: calculatePercentage(
            totalApplicants,
            prevTotalApplicants
          ),
          interviewsPercentage: calculatePercentage(interviews, prevInterviews),
          hiresPercentage: calculatePercentage(hires, prevHires),

          // Up/Down
          isJobUp: (totalJobs || 0) >= (prevTotalJobs || 0),
          isApplicantsUp: (totalApplicants || 0) >= (prevTotalApplicants || 0),
          isInterviewsUp: interviews >= prevInterviews,
          isHiresUp: (hires || 0) >= (prevHires || 0),
        });
    } catch(error){
        res.status(500).json({message: "Error fetching stats", error})
        console.error("Error in getEmployerStats:", error)
    }
}