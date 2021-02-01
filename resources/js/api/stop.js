import React, { useState, useEffect } from 'react';
import Http from '../Http';

export const useStopPlanRetriever = () => {
    const [stopState, setStop] = useState([]);
    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const stopPlans = await fetchStopPlans();
                if (mounted) {
                    setStop(stopPlans);
                }
            } catch (error) {
                if (Http.isCancel(error)) {
                    console.error(error);
                } else {
                    console.error(error);
                }
            }
        })();
        return () => {
            mounted = false;
        };
    }, []);
    return [stopState, setStop];
};

export const fetchStopPlans = async () => {
    const response = await Http.get('/api/stop');
    const { data } = response;
    const stopPlans = data.map((item, index) => {
        return {
            key: index,
            ConstructionCode: item.ConstructionCode,
            HouseCode: item.NameCode,
            HouseType: item.ConstructionTypeName,
            StopDate: item.StoppedProcessingDate,
            ResumeDate: item.ResumedProcessingDate
        };
    });
    return stopPlans;
};
