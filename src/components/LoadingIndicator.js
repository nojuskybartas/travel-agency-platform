import { usePromiseTracker } from "react-promise-tracker";
import {ThreeDots} from 'react-loader-spinner';
import LoadingSpinner from "./LoadingSpinner";

const LoadingIndicator = (props) => {
    const { promiseInProgress } = usePromiseTracker({delay: 300});
    const loading = props.loading || null
    return (promiseInProgress || loading) && <LoadingSpinner/>;
}

export default LoadingIndicator