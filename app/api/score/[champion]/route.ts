import { NextResponse } from 'next/server';
import prisma from "@/app/libs/prismadb";

interface IParams {
    champion?: string;
}



export async function POST(
    request: Request, //obligatoire 
    { params }: { params: IParams }
) {
    const body =request.json()
    const { champion } = params;
    if (!champion || typeof champion !== 'string') {
        throw new Error('Invalid ID');
    }

    const score = await prisma.score.findMany({
        where: {
            champion,
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    return NextResponse.json(score);
}


