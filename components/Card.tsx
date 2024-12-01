'use client'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

interface CardProps{
    link:string,
    name:string,
    audio:string,
    description?:string
}
const Card:React.FC<CardProps> = ({
    link, name,description,
}) => {

  return (
    <Link 
        href={link} className='border transition hover:scale-110 bg-black 
        rounded-md w-60 h-60 border-zinc-300 overflow-hidden flex flex-col justify-between
        items-center gap-0.5 text-white'>

        <Image
            alt=""
            className='cover '
            width={150}
            height={150}
            src={`${link}.png`}
            />
        <h1 className='font-semibold text-lg'>{name}</h1>
        <p className='text-md'>{description}</p>
    </Link>
  )
}

export default Card