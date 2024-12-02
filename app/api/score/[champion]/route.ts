import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";

interface IParams {
    champion?: string;
}

export async function POST(request: Request, { params }: { params: IParams }) {
    try {
        // Parse the request body
        const body = await request.json();
        const { champion } = params; // Destructure from params

        // Check if the 'champion' is valid
        if (!champion || typeof champion !== 'string') {
            return NextResponse.json({ error: 'Invalid champion ID' }, { status: 400 });
        }

        // Fetch scores from the database
        const scores = await prisma.score.findMany({
            where: {
                champion,
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        // Return the scores as a response
        return NextResponse.json(scores);

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
    }
}
