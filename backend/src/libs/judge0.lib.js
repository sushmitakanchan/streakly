import axios from "axios"

export const getJudge0LanguageId = (language) => {
    const languageMap = {
        "PYTHON": 71,
        "JAVASCRIPT": 63,
        "JAVA": 62,
        "TYPESCRIPT": 74
    }

    return languageMap[language.toUpperCase()]
}

const judge0 = axios.create({
    baseURL: "https://judge0-ce.p.rapidapi.com",
    headers: {
        "Content-Type": "application/json",
        "x-rapidapi-key": process.env.RAPID_API_KEY,
        "x-rapidapi-host": process.env.RAPID_API_HOST
    }
})

export const submitBatch = async (submissions) => {
    const { data } = await judge0.post(
        "/submissions/batch?base64_encoded=false",
        {
            submissions
        }
    )

    console.log("Submissions result:", data)

    return data
}

const sleep = (ms) =>
    new Promise((resolve) => setTimeout(resolve, ms))

export const pollBatchResults = async (tokens, maxRetries = 20) => {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
        const { data } = await judge0.get(
            "/submissions/batch",
            {
                params: {
                    tokens: tokens.join(","),
                    base64_encoded: false
                }
            }
        )

        const results = data.submissions

        const isAllDone = results.every(
            (r) => r.status.id !== 1 && r.status.id !== 2
        )

        if (isAllDone) return results

        await sleep(1000)
    }

    throw new Error("Judge0 polling timed out after 20 seconds")
}

export function getLanguageName(languageId) {
    const LANGUAGE_NAMES = {
        74: "TypeScript",
        63: "JavaScript",
        71: "Python",
        62: "Java"
    }

    return LANGUAGE_NAMES[languageId] || "Unknown"
}