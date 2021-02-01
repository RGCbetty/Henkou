import React, { useState, useEffect } from 'react';
import Http from '../Http';

export const useThPlansRetriever = () => {
    const [tableState, setTable] = useState({
        plans: [],
        pagination: {
            current: 1,
            pageSize: 10
        },
        loading: false
    });

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const response = await fetchThPlans(setTable, tableState.pagination);
                const { henkouPlans, pagination, total } = response;
                if (mounted) {
                    setTable({
                        loading: false,
                        plans: henkouPlans,
                        pagination: {
                            ...pagination,
                            total: total,
                            showTotal: total => `Total ${total} items`
                            // 200 is mock data, you should read it from server
                            // total: data.totalCount,
                        }
                    });
                }
            } catch (error) {
                if (Http.isCancel(error)) {
                    console.error(error);
                } else {
                    throw error;
                }
            }
        })();
        return () => {
            mounted = false;
        };
    }, []);
    return [tableState, setTable];
};

export const fetchThPlans = async (setTable, pagination) => {
    setTable({ loading: true });
    const response = await Http.get(`/api/plans`, {
        params: pagination
    });
    const { data, total } = response.data;
    let henkouPlans = data.map((item, index) => {
        return {
            key: index,
            thview: 'view PDF',
            assessment: ['plan detail', 'location', 'plan detail & location', 'PEL', 'Denki TH'],
            start: 'Start Date',
            action: ['Cancel', 'For CIP', 'Borrow Form', 'Release'],
            reason: 'View Reason',
            ...item
        };
    });

    return { henkouPlans, pagination, total };
};
