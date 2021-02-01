import React, { useState, useEffect } from 'react';
import Http from '../Http';

export const useMasterDetails = () => {
    const [info, setInfo] = useState({
        types: [],
        reasons: [],
        products: []
    });

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const responseReasons = await Http.get(`/api/reasons`);
                const responseTypes = await Http.get(`/api/types`);
                const responseProducts = await Http.get('/api/products');
                if (mounted) {
                    setInfo({
                        types: responseTypes.data,
                        reasons: responseReasons.data,
                        products: responseProducts.data
                    });
                }
            } catch (err) {
                console.error(err);
            }
        })();
        return () => {
            mounted = false;
        };
    }, []);
    return [info, setInfo];
};
