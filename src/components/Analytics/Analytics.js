import { useEffect } from "react";  
import ReactGA from "react-ga";

const Analytics = () => {
    const pathName = window.location.pathname;
    useEffect(() => {
        if (process.env.NODE_ENV === "production") {
            ReactGA.initialize("308629029");
            ReactGA.set({ page: pathName });
            ReactGA.pageview(pathName);
        }
    }, [pathName]);
    return <></>;
}

export default Analytics;