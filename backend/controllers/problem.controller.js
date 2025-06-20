import {db} from "../src/libs/db.js"
import { submitBatch, getJudge0LanguageId, pollBatchResults } from "../src/libs/judge0.lib.js";

export const createProblem = async(req, res)=>{
    // get all the data from req body
    const {title, description, difficulty, tags, examples, constraints, testcases, codeSnippets, referenceSolutions } = req.body
    // check user role
    if(req.user.role !=="ADMIN"){
        return res.status(403).json({error: "You are not allowed to create a problem"})
    }
    // loop through each reference solution for different languages
    try {
        for(const [language, solutionCode] of Object.entries(referenceSolutions)){
            const languageId = getJudge0LanguageId(language);
            if(!languageId){
                return res.status(400).json({
                    error: `Language ${language} is not supported`
                })
            }
            const submissions = testcases.map(({input, output})=>({
                source_code: solutionCode,
                language_id: languageId,
                stdin: input,
                expected_output:output
            }))
            const submissionResults = await submitBatch(submissions)

            const tokens = submissionResults.map((res)=>res.token);
            const results = await pollBatchResults(tokens);

            for(let i=0; i<results.length; i++){
                
                const result = results[i]
                console.log("Result-----", result);
                // console.log(
                //     `Testcase ${i+1} and Language ${language} ---- result ${JSON.stringify(result.status.description)}`
                // );
                
            
                 
                if(result.status.id !== 3){
                    return res.status(400).json({error: `Testcase ${i+1} failed for language ${language}`})
                }
            }
            // save the problem to db

            const newProblem = await db.problem.create({
                data:{title, description, difficulty, tags, examples, constraints, testcases, codeSnippets, referenceSolutions, userId:req.user.id}
            })
            return res.status(201).json({
                success: true,
                message: "Message created successfully",
                problem: newProblem
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error:"Error while creating problem",
            details: error.message
        })
        
        
    }

}

export const getAllProblems = async(req, res)=>{}

export const getProblemById = async(req, res)=>{}

export const updateProblem = async(req, res)=>{}

export const deleteProblem = async(req, res)=>{}

export const getAllProblemsSolvedByUser = async(req, res)=>{}