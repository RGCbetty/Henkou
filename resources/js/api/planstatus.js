import React, { useState, useEffect } from 'react';
import Http from '../Http';

export const useActivePlanStatus = () => {
    const [productCategoriesPCMS, setProductCategoriesPCMS] = useState([]);
    useEffect(() => {
        let mounted = true;
        try {
            (async () => {
                const instance = Http.create({
                    baseURL: 'http://hrdapps71:4900/',
                    withCredentials: false
                });
                const response = await instance.get('get/getProductListActive?from=plugins');
                if (mounted) {
                    setProductCategoriesPCMS(response.data);
                }
            })();
        } catch (err) {
            console.error(err);
        }
        return () => {
            mounted = false;
        };
    }, []);
    return [productCategoriesPCMS, setProductCategoriesPCMS];
};
