import { NextResponse } from 'next/server';
import prisma from "@/app/libs/prismadb";


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

