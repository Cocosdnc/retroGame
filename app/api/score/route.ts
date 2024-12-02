import { NextResponse } from 'next/server';

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
export async function POST(
    request: Request
) {

    const body = await request.json();
    const {
        pseudo,
        champion,
        score,
    } = body;

    await prisma.score.create({
        data: {
            pseudo,
            champion,
            score,
        }
    })
    return NextResponse.json("ok");



}

