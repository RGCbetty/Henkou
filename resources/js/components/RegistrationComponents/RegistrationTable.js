import React from 'react';
import { Table } from 'antd';

const RegistrationTable = props => {
    const { plans, loading, headers, event, pagination } = props;
    let plansTotal = 0;
    if (plans) {
        plansTotal = plans.length;
    }

    return (
        <Table
            // onRow={(record, rowIndex) => {
            //     return {
            //         onClick: event => {
            //             console.log(record);
            //             console.log(event);
            //             //         Http.get(`http://hrdapps36:3100/nodexjloc?searchDate=${moment(rec.importDate).format(
            //             //             "YYYY-MM-DD"
            //             //           )}&constructionCode=${rec.planCode}&henkoutype="japan"
            //             //   `)
            //         }, // click row
            //         onDoubleClick: event => {}, // double click row
            //         onContextMenu: event => {}, // right button click row
            //         onMouseEnter: event => {}, // mouse enter row
            //         onMouseLeave: event => {} // mouse leave row
            //     };
            // }}
            size="small"
            columns={headers}
            loading={loading}
            bordered
            pagination={pagination}
            dataSource={plans}
            scroll={{ x: 'max-content', y: 'calc(100vh - 20em)' }}
            onChange={event}
        />
    );
};

export default RegistrationTable;
