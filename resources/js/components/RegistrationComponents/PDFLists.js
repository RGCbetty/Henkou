import React, { useState } from 'react';
import { List } from 'antd';

const PDFLists = ({ pdfLists }) => {
    // const data = [
    //     'Racing car sprays burning fuel into crowd.',
    //     'Japanese princess to wed commoner.',
    //     'Australian walks 100km after outback crash.',
    //     'Man charged over missing wedding girl.',
    //     'Los Angeles battles huge wildfires.'
    // ];
    const openPDF = fileDetails => {
        window.open(`${fileDetails.path}`, '_blank');
    };
    return (
        <>
            <List
                size="small"
                bordered
                dataSource={pdfLists}
                renderItem={item => (
                    <List.Item>
                        <a onClick={() => openPDF(item)}>{item.filename}</a>
                    </List.Item>
                )}
            />
        </>
    );
};

export default PDFLists;
