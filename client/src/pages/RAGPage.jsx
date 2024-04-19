import { Container } from '@/components/common/Container'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {PaperAirplaneIcon} from '@heroicons/react/24/solid'
import React from 'react'

const RAGPage = () => {
    return (
        <Container className={"py-8 h-screen flex flex-col"}>
            <div className='w-full text-center h-1/2 flex-1'>
                <h1 className="mx-auto max-w-4xl text-5xl font-display font-medium tracking-tight text-slate-900 sm:text-7xl text-center">RAG Search</h1>
                <p>Search Video you have watched</p>
    
    
            </div>
            <div className='flex  gap-x-2'>
                <Input placeholder="Search Video" className="w-full relative bottom-0"/>
                <Button variant='outline' className="border-indigo-600 text-indigo-600 border-2"><PaperAirplaneIcon className='w-6 h-6'/></Button>
            </div>
        </Container>
    )
}

export default RAGPage