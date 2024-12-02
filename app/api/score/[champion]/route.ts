import { NextResponse } from 'next/server';
import prisma from '@/app/libs/prismadb';


export async function POST(
    request: Request,

) {
    const body = await request.json();
    const {
        champion,
    } = body;

    if (!champion || typeof champion !== 'string') {
        throw new Error('Invalid ID');
    }


    const score = await prisma.score.findMany({
        where: { champion },
        orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(score);

}
