import { db } from "../src/libs/db.js"

export const getAllSubmissions = async(req , res) =>{
    try {
        const userId = req.user.id;
        const submissions = await db.submissions.findMany({
            where:{
                userId:userId
            }
        })

        res.status(200).json({
            success:true,
            message:"Submissions fetched successfully",
            submissions
        })
    } catch (error) {
        console.error("Fetch Submission Error:", error.message);
        res.status(500).json({message:"Failed to fetch submissions"});
        
    }
}

export const getSubmissionForProblem = async(req, res)=>{
    try {
        const userId =  req.user.id;
        const problemId = req.params.problemId;
        const submissions = await db.submission.findMany({
            where:{
                userId:userId,
                problemId:problemId
            }
        })
        res.status(200).json({
            success:true,
            message:"Submission Fetched Successfully",
            submissions
        })
    } catch (error) {
        console.error("Fetch Submission Error:", error.message);
        res.status(500).json({message:"Failed to fetch submissions"});
    }

}

export const getAllTheSubmissionsForProblem = async(req, res)=>{
    try {
        const problemId = req.params.problemId;
        const submission = await db.submission.count({
            where:{
                problemId:problemId
            }
        })
        res.status(200).json({
            success: true,
            message:"Submissions Fetched Successfully",
            count: submission
        })
    } catch (error) {
        console.error("Fetch Submission Error:", error.message);
        res.status(500).json({message:"Failed to fetch submissions"});
        
    }
}