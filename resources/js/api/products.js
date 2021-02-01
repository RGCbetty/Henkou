import React, { useState, useEffect } from 'react';
import Http from '../Http';
import moment from 'moment';

export const useProductsRetriever = () => {
    const [productState, setProduct] = useState([]);
    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const products = await fetchProducts();
                if (mounted) {
                    setProduct(products);
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
    return [productState, setProduct];
};
export const fetchProducts = async (details = null) => {
    const response = await Http.get('/api/products');
    const fetchAssessment = await Http.get('/api/assessments');
    const { data } = response;
    if (details) {
        let result = data.map((item, index) => {
            const items =
                index == 0
                    ? {
                          ...item,
                          received_date: moment(details.created_at).format('YYYY-MM-DD HH:mm:ss'),
                          assessment: fetchAssessment.data
                      }
                    : {
                          ...item,
                          assessment: fetchAssessment.data
                      };
            return items;
        });
        return result;
    } else {
        return data;
    }
};
