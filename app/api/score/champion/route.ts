import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient()


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
        where: { champion:champion },
        orderBy: { score: 'desc' }
    });
    if (!score){
        return null
    }
    return NextResponse.json(score);

}
