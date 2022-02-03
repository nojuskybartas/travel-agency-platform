import { useEffect, useState } from "react";
import { getExperienceReviews, getUserDetails } from "../lib/storage";
import { StarIcon as StarIconSolid } from "@heroicons/react/solid"
import { StarIcon as StarIconOutline } from "@heroicons/react/outline"
import { timeSince } from "../lib/date";

function ReviewSection({experienceId}) {

    const [reviews, setReviews] = useState([])
    
    useEffect(() => {
        setReviews([])
        getExperienceReviews(experienceId).then(res => {
            res.forEach(review => {
                const data = review.data()
                getUserDetails(data.authorId).then(author => {
                    data.author = author.data()
                    setReviews(reviews => [...reviews, data])
                })
            })
        })
        console.log(reviews)
    }, [])

    return (
        <div className='w-full h-fit py-5'>
            <h1 className="text-2xl font-bold">User Reviews 👌</h1>
            {reviews.length === 0 && <h2 className="text-gray-700 text-lg italic">There are no reviews for this activity yet</h2>}
            <div className="w-full h-fit space-y-2 flex flex-col mt-5">
                {reviews.map((review, i) => (    
                                
                    <div className="w-full h-fit flex rounded-lg p-6 bg-gray-200 relative" key={i}>
                        <div className="w-fit h-full space-y-3">
                            <div className="flex justify-between">
                                <div className="flex justify-end items-center space-x-4">
                                    <img src={review.author.picture} className='w-8 h-8 object-cover rounded-full' />
                                    <h1>{review.author.name}</h1>
                                </div>
                            </div>
                            <h1 className="font-semibold text-2xl">{review.reviewTitle}</h1>
                            <h2 className="text-lg mt-3">{review.reviewDescription}</h2>
                        </div>
                        <div className="w-fit h-fit flex flex-col absolute right-6 top-6 space-y-3">
                            <div className="flex items-center w-fit h-full">
                                {Array(review.rating).fill().map((_, i) => (<p key={i}><StarIconSolid className="w-6 h-6"/></p>))}
                                {Array(5-review.rating).fill().map((_, i) => (<p key={i}><StarIconOutline className="w-6 h-6"/></p>))}
                            </div>
                            <h1 className="w-full h-full text-right">{timeSince(review.postedOn)} ago</h1>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ReviewSection;
