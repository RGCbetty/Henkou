import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Table, Tag, BackTop } from 'antd';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import update from 'immutability-helper';
import DraggableHeaders from './DraggableHeaders';
const type = 'DragableBodyRow';

const DragableBodyRow = ({ index, moveRow, className, style, ...restProps }) => {
	const ref = useRef();
	const [{ isOver, dropClassName }, drop] = useDrop({
		accept: type,
		collect: (monitor) => {
			const { index: dragIndex } = monitor.getItem() || {};
			if (dragIndex === index) {
				return {};
			}
			return {
				isOver: monitor.isOver(),
				dropClassName: dragIndex < index ? ' drop-over-downward' : ' drop-over-upward'
			};
		},
		drop: (item) => {
			moveRow(item.index, index);
		}
	});
	const [, drag] = useDrag({
		type,
		item: { index },
		collect: (monitor) => ({
			isDragging: monitor.isDragging()
		})
	});
	drop(drag(ref));

	return (
		<tr
			ref={ref}
			className={`${className}${isOver ? dropClassName : ''}`}
			style={{ cursor: 'move', ...style }}
			{...restProps}
		/>
	);
};

const DragSortingTable = ({ loading, props }) => {
	const { affectedProducts, setState } = props;
	const components = {
		body: {
			row: DragableBodyRow
		}
	};

	const moveRow = useCallback(
		(dragIndex, hoverIndex) => {
			const dragRow = affectedProducts[dragIndex];

			setState((prevState) => {
				return {
					...prevState,
					affectedProducts: update(affectedProducts, {
						$splice: [
							[dragIndex, 1],
							[hoverIndex, 0, dragRow]
						]
					})
				};
			});
		},
		[affectedProducts]
	);
	return (
		<>
			<DndProvider backend={HTML5Backend}>
				<Table
					pagination={false}
					rowKey={(record) => record?.product_key}
					className={'draggable'}
					bordered
					size="large"
					loading={loading}
					columns={DraggableHeaders()}
					dataSource={affectedProducts.map((item, index) => {
						return {
							...item,
							sequence: index + 1
						};
					})}
					components={components}
					onRow={(record, index) => ({
						index,
						moveRow
					})}
				/>
			</DndProvider>
		</>
	);
};

export default DragSortingTable;
