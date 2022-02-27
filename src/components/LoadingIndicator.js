import { usePromiseTracker } from "react-promise-tracker";
import {ThreeDots} from 'react-loader-spinner';

const LoadingIndicator = (props) => {
    const { promiseInProgress } = usePromiseTracker({delay: 300});
    const loading = props.loading || null
    return (
        promiseInProgress && loading &&
        <div className="w-full h-full flex justify-center items-center">
            <ThreeDots color="#A393EB" height="100" width="100" />
        </div>
    );  
}

export default LoadingIndicator