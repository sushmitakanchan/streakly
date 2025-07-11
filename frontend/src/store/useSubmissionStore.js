import {create} from 'zustand'
import { axiosInstance } from '../libs/axios'
import {toast} from 'react-hot-toast'


export const useSubmissionStore = create((set)=>({
    isLoading: null,
    submissions:[],
    submission:null,
    submissionCount:null,

    getAllSubmissions:async()=>{
        try {
            set({isLoading:true})
            const res = await axiosInstance.get("/submission/get-all-subnmissions")
            set({submissions:res.data.submissions})
            toast.success(res.data.message)
        } catch (error) {
            console.log("Error getting all submissions", error);
            toast.error("Error getting all submissions")
            
        }finally{
            set({isLoading:false})
        }
    },

    getSubmissionForProblem:async(problemId)=>{
        try {
            const res = await axiosInstance.get(`/submission/get-submission/${problemId}`)
            set({submission:res.data.submissions});
        } catch (error) {
            console.log("Error getting submissions for problem", error);
            toast.error("Error getting submissions for problem")
            
        }
    },

    getSubmissionCountForProblem:async(problemId)=>{
        try {
            const res = await axiosInstance.get(`/submission/get-submissions-count/${problemId}`)
            set({submissionCount:res.data.count})
        } catch (error) {
                        console.log("Error getting submissions for problem", error);
            toast.error("Error getting submissions for problem")
        }
    }
}))