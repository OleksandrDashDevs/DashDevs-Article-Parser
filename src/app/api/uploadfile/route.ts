import { NextRequest, NextResponse } from "next/server";
import { Octokit } from "octokit";

export async function POST(req: NextRequest) {
    const body = await req.json();
    const { fileName, commitMessage, content } = body;

    if (!fileName || !commitMessage || !content) {
        return NextResponse.json(
            { message: "Missing required fields" },
            { status: 400 },
        );
    }

    const octokit = new Octokit({
        auth: process.env.GITHUB_TOKEN_CLASSIC,
    });

    try {
        await octokit.request("GET /repos/{owner}/{repo}/contents/{path}", {
            owner: "dashdevs",
            repo: "fintech-garden-frontend",
            path: `content/news/${fileName}`,
            ref: "master",
        });

        return NextResponse.json({
            success: true,
            fileExists: true,
            message: "A file with this name already exists.",
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
        if (err.status === 404) {
            try {
                const createResponse = await octokit.request(
                    "PUT /repos/{owner}/{repo}/contents/{path}",
                    {
                        owner: "dashdevs",
                        repo: "fintech-garden-frontend",
                        path: `content/news/${fileName}`,
                        message: commitMessage,
                        content: Buffer.from(content).toString("base64"),
                        branch: "master",
                    },
                );
                return NextResponse.json({
                    success: true,
                    fileCreated: true,
                    data: createResponse.data,
                    message: "The file has been successfully uploaded to the repository.",
                });
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (createErr: any) {
                return NextResponse.json(
                    {
                        success: false,
                        error: createErr.response?.data || createErr.message,
                    },
                    { status: createErr.status || 500 },
                );
            }
        }

        return NextResponse.json(
            { success: false, error: err.response?.data || err.message },
            { status: err.status || 500 },
        );
    }
}
