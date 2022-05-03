import React from 'react'
import { ThreeDots } from "react-loader-spinner"

function LoadingSpinner() {

    return (
        <div className="w-full h-full block fixed backdrop-blur-md top-0 left-0 bottom-0 right-0 z-[100]">
            <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
                <ThreeDots color="#587355" height="100" width="100"/>
            </div>
        </div> 
    )
}

export default LoadingSpinner