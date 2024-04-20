import { Container } from '@/components/common/Container'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import EmbeddingsService from '@/services/EmbeddingsService'
import { PaperAirplaneIcon } from '@heroicons/react/24/solid'
import React, { useEffect, useState } from 'react'

const RAGPage = () => {
    const [displayArray, setDisplayArray] = useState([]) //[{videoSourceId, videoTitle, videoSourceType, , score, youtubeThumbnail, text: [{text, referenceTimeRange}]]


    const turnIntoDisplayArray = (resultArray) => {
        if (resultArray.length > 0) {
            const videos = []
            for (const result of resultArray) {
                const { videoSourceId, videoTitle, videoSourceType, text, referenceTimeRange } = result
                console.log(result);
                // add to displayArray
                // if youtube, get thumbnail with https://img.youtube.com/vi/${sourceId}/0.jpg
                const youtubeThumbnail = `https://img.youtube.com/vi/${videoSourceId}/0.jpg`
                const video = { videoSourceId, videoTitle, videoSourceType, youtubeThumbnail, text: [{ text, referenceTimeRange }] }
                videos.push(video)
            }
            setDisplayArray(videos)
        }
    }


    const [queryText, setQueryText] = useState('')

    const handleVectorSearch = async (e) => {
        e.preventDefault()
        const result = await EmbeddingsService.vectorSearch({ query: queryText })
        turnIntoDisplayArray(result)
    }



    return (
        <Container >
            <form onSubmit={handleVectorSearch} className={"py-8 h-screen flex flex-col"}>
                <div className='w-full text-center'>
                    <h2 className="mx-auto max-w-4xl text-5xl font-display font-medium tracking-tight text-slate-900 sm:text-6xl text-center">RAG search</h2>
                </div>
                <div className=' h-1/2 flex-1 overflow-auto'>
                    {displayArray.map((video,index) => (
                        <Card key={index} >
                            <CardHeader>
                                <CardTitle>{video.videoTitle}</CardTitle>
                                <CardDescription>{video.videoSourceType}</CardDescription>
                            </CardHeader>
                            <CardContent className="flex gap-x-4">
                                <img className='h-40 w-auto aspect-auto' src={video.youtubeThumbnail} alt={video.videoSourceTitle} />
                                <ul>
                                    {video.text.map((text, index) => (
                                        <li key={index} className='flex flex-col'>
                                            <p className=' text-blue-600'>{text.referenceTimeRange}</p>
                                            <p className=' line-clamp-6'>{text.text}</p >
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                            <CardFooter>
                                <Button variant='outline' className='border-indigo-600 text-indigo-600'>Watch Video</Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
                <div className='flex  gap-x-2 border-t-2 pt-6 border-t-indigo-600'>
                    <Input
                        value={queryText}
                        onChange={(e) => setQueryText(e.target.value)}
                        placeholder="Search Video" className="w-full relative bottom-0" />
                    <Button
                        type='submit'
                        variant='outline'
                        className="border-indigo-600 text-indigo-600 border-2"
                    ><PaperAirplaneIcon className='w-6 h-6' /></Button>
                </div>
            </form>
        </Container>
    )
}

export default RAGPage