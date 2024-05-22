import { whyUsContent } from '@/constants'
import React from 'react'


const Why = () => {

    return (
        <div className=' bg-slate-50'>
            <div className='container
            '>
                {
                    whyUsContent.scenarios.map((feature, index) => (
                        <div className="flex flex-col justify-center py-12 " key={index}>
                            <p
                                className='text-lg font-semibold text-left text-gray-600 tracking-wider mb-2'
                            > When...
                            </p>
                            <h2 className="text-3xl font-bold text-indigo-600">{feature.when}</h2>
                            <p>
                                But...
                            </p>
                            <h2 className="text-3xl font-bold text-indigo-600">{feature.but}</h2>
                            <p className="text-lg text-center text-gray-600 mt-4">{feature.description}</p>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default Why