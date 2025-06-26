import { pollBatchResults, submitBatch , getLanguageName} from "../src/libs/judge0.lib.js";
import { db } from "../src/libs/db.js";

export const executeCode  = async(req, res)=>{
    try {
        const {source_code, language_id, stdin, expected_outputs, problemId} = req.body;
        const userId = req.user.id;


        
        // Validate testcases
        if(
            !Array.isArray(stdin)||stdin.length === 0 ||
            !Array.isArray(expected_outputs)||expected_outputs.length === 0
        ){
            return res.status(400).json({
                error:"Invalid or missing testcases"
            })
        }
        // 2. Prepare each test cases for judge0 batch submission
        const submissions = stdin.map((input)=>({
            source_code,
            language_id,
            stdin: input,
        }));

        // 3. Send batch of submissions to judge0
        const submitResponse = await submitBatch(submissions);
        const tokens = submitResponse.map((res)=>res.token);

        // 4. Poll judge0 for results of all submitted test cases
        const results = await pollBatchResults(tokens);
            console.log("Result-------------");
            console.log(results);
        // Analyze test case results
        let allPassed = true;
        const detailedResults = results.map((result, i)=>{
            const stdout = result.stdout?.trim();
            const expected_output = expected_outputs[i]?.trim();
            const passed = stdout === expected_output;

            if(!passed) allPassed = false;

            return {
                testCase: i+1,
                passed,
                stdout,
                expected: expected_output,
                stderr: result.stderr || null,
                compile_output: result.compile_output || null,
                status: result.status.description,
                memory:result.memory ? `${result.memory}KB`:undefined,
                time: result.time ? `${result.time}s` : undefined
            }
    //               console.log(`Testcase #${i+1}`);
    //   console.log(`Input for testcase #${i+1}: ${stdin[i]}`)
    //   console.log(`Expected Output for testcase #${i+1}: ${expected_output}`)
    //   console.log(`Actual output for testcase #${i+1}: ${stdout}`)

    //   console.log(`Matched testcase #${i+1}: ${passed}`)
        })
        console.log(detailedResults);
                console.log("UserId:", userId);
                console.log("ProblemId:", problemId);

        // store submission summary
        const submission = await db.submission.create({
      data: {
        userId,
        problemId,
        sourceCode: source_code,
        language: getLanguageName(language_id),
        stdin: stdin.join("\n"),
        stdout: JSON.stringify(detailedResults.map((r) => r.stdout)),
        stderr: detailedResults.some((r) => r.stderr)
          ? JSON.stringify(detailedResults.map((r) => r.stderr))
          : null,
        compileOutput: detailedResults.some((r) => r.compile_output)
          ? JSON.stringify(detailedResults.map((r) => r.compile_output))
          : null,
        status: allPassed ? "Accepted" : "Wrong Answer",
        memory: detailedResults.some((r) => r.memory)
          ? JSON.stringify(detailedResults.map((r) => r.memory))
          : null,
        time: detailedResults.some((r) => r.time)
          ? JSON.stringify(detailedResults.map((r) => r.time))
          : null,
      },
    });
        // if all passed = true then mark problem as solved for the current user
        if(allPassed){
            await db.problemSolved.upsert({
                where:{
                    userId_problemId:{
                        userId, problemId
                    }
                },
                update:{},
                create:{
                    userId, problemId
                }
            })
        }
        // save individual testcase results using detailedResults
        const testCaseResults = detailedResults.map((result)=>({
            submissionId: submission.id,
            testCase: result.testCase,
            passed: result.passed,
            stdout: result.stdout,
            expected: result.expected,
            stderr: result.stderr,
            compileOutput: result.compile_output,
            status: result.status,
            memory: result.memory,
            time: result.time,
        }));

        await db.testCaseResult.createMany({
            data:testCaseResults,
        })
        
        const submissionsWithTestCase = await db.submission.findUnique({
            where:{
                id:submission.id,
            },
            include:{
                testCases:true
            }
        })
        res.status(200).json({
            sucess:true,
            message:"Code Executed Successfully",
            submission: submissionsWithTestCase
        })
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error:"Error while executing code",
            details: error.message
        })
    }
}