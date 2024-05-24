import { homeContents } from '@/constants'
import React from 'react'


const Why = () => {

    return (
        <div className=' bg-slate-50'>
            <div className='container
            '>
                <h2
                    className="text-4xl font-bold text-center text-indigo-800 pt-12"
                >
                    {homeContents.headline}
                </h2>
                {
                    homeContents.why.map((feature, index) => (
                        <div className="flex flex-col justify-center py-12 " key={index}>
                            <h2 className="text-3xl font-bold text-gray-800">{feature.title}</h2>
                            <p className="text-lg text-gray-600 mt-4 max-w-2xl">{feature.description}</p>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default Why