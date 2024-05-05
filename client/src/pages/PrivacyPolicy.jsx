import React from 'react'
import { privacyPolicyData } from '@/constants/privacyPolicy'
import Markdown from 'markdown-to-jsx';
import Header from '@/components/common/Header';

const PrivacyPolicy = () => {
    return (
       <>
       <Header/>
            <div className='container flex justify-center w-full '>
                <Markdown
                    className="prose max-w-none w-4/5 p-4 bg-white "
                >
                    {privacyPolicyData}
                </Markdown>
            </div>
       </>
    )
}

export default PrivacyPolicy