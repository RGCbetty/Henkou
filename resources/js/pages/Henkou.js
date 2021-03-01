/* Utilities */
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import Http from '../Http';
/* API */
import { fetchProducts, useProductsRetriever } from '../api/products';
import { fetchDetails } from '../api/details';
import { useActivePlanStatus } from '../api/planstatus';
/* Components */
import HenkouContainer from '../components/HenkouComponents/HenkouContainer';

const Henkou = ({ title, ...rest }) => {
	useEffect(() => {
		document.title = title || '';
	}, [title]);
	const [product, setProduct] = useProductsRetriever();
	const [details, setDetail] = useState({});
	const [assessment, setAsssessment] = useState([]);
	const [planDetail, setPlanDetail] = useState([]);
	const [company, setCompany] = useState([]);
	const [status, setStatus] = useState([]);
	const handleEvent = async (constructionCode) => {
		const details = await fetchDetails(constructionCode);
		const assessment = await Http.get('/api/assessments');
		setAsssessment(assessment.data);
		setDetail(details);
		const instance = Http.create({
			baseURL: 'http://adminsql1/api',
			withCredentials: false,
			headers: {
				'master-api': 'db588403f0a1d3b897442a28724166b4'
			}
		});
		const company = await instance.get('/company/department/section/team/hrd');
		// setCompany(company.data);
		if (details) {
			const fetchStatus = await Http.get(`/api/status/${details.id}`);
			console.log(fetchStatus, '6969696969696');

			const products = fetchStatus.data.map((item) => {
				return {
					...item,
					department:
						company.data.length > 0
							? company.data.find((attr) => {
									const prod = product.find(
										(el) =>
											attr.DepartmentCode == el.department_id &&
											item.product_id == el.id
									);

									return prod ? attr.DepartmentCode == prod.department_id : false;
							  }).DepartmentName
							: null,
					section:
						company.data.length > 0
							? company.data.find((attr) => {
									const prod = product.find(
										(el) =>
											attr.SectionCode == el.section_id &&
											item.product_id == el.id
									);
									return prod ? attr.SectionCode == prod.section_id : false;
							  }).SectionName
							: null,
					team:
						company.data.length > 0
							? company.data.find((attr) => {
									const prod = product.find(
										(el) =>
											attr.TeamCode == el.team_id && item.product_id == el.id
									);
									return prod ? attr.TeamCode == prod.team_id : false;
							  }).TeamName
							: null,
					sequence:
						details.method == '2'
							? product.find((el) => el.id == item.product_id).waku_sequence
							: product.find((el) => el.id == item.product_id).jiku_sequence,
					product_name: product.find((el) => el.id == item.product_id).product_name
				};
			});
			const owner = products.filter((item, index) => {
				if (rest.userInfo.DesignationCode == '003') {
					if (
						rest.userInfo.DepartmentCode ==
							product.find((el) => el.id == item.product_id).department_id &&
						rest.userInfo.SectionCode ==
							product.find((el) => el.id == item.product_id).section_id
					) {
						return item;
					}
				} else {
					if (
						rest.userInfo.DepartmentCode ==
							product.find((el) => el.id == item.product_id).department_id &&
						rest.userInfo.SectionCode ==
							product.find((el) => el.id == item.product_id).section_id &&
						rest.userInfo.TeamCode ==
							product.find((el) => el.id == item.product_id).team_id
					) {
						return item;
					}
				}
			});
			console.log(owner, 'cqwrijqcwoirjqwoicrjqw');
			const sortBySequenceOwner = _.sortBy(owner, ['sequence']);
			let params = {};
			for (let i = 0; i < sortBySequenceOwner.length; i++) {
				params[`product_${i + 1}`] = owner[i].product_key;
			}
			console.log(params, 'paramssssssss');
			const supplierKeys = await Http.get(`api/supplier`, { params: params });
			const suppliers = supplierKeys.data.map((item) => {
				return {
					...item,
					products:
						products.length > 0
							? products.filter((el) => {
									return el.product_key == item.supplier_key;
							  })
							: null
				};
			});
			console.log(supplierKeys, 'suppllierrsss!!!!!!!!!!!!!');

			let concatenatedProducts = [];
			let supplier = [];
			console.log(sortBySequenceOwner, 'sortedOwner');
			for (let i = 0; i < sortBySequenceOwner.length; i++) {
				console.log(sortBySequenceOwner[i], 'each Ownerrrrrrrrrrr');
				for (let j = 0; j < suppliers.length; j++) {
					if (sortBySequenceOwner[i].product_key == suppliers[j].product_key) {
						for (let k = 0; k < suppliers[j].products.length; k++) {
							supplier.push(suppliers[j].products[k]);
						}
					}
				}
				const sortedSupplier = _.sortBy(supplier, ['sequence', 'product_name']);
				for (let l = 0; l < sortedSupplier.length; l++) {
					concatenatedProducts.push(sortedSupplier[l]);
				}
				supplier = [];
				concatenatedProducts.push(sortBySequenceOwner[i]);
			}
			const uniqueProducts = _.uniqBy(concatenatedProducts, (obj) => obj.product_key);
			console.log(concatenatedProducts, 'concatenated products!!!!!!!!!!!!');
			setStatus(uniqueProducts);

			if (details.method == '2') {
				const sortedProducts = _.sortBy(product, ['waku_sequence', 'product_name']);
				setProduct(sortedProducts);
			} else {
				const sortedProducts = _.sortBy(product, ['jiku_sequence', 'product_name']);
				setProduct(sortedProducts);
			}
			return 'found';
		} else {
			return 'not found';
		}
	};
	const handleUpdate = async (row, details, key) => {
		const { received_date, product_key, detail_id, ...attr } = row;

		if (key == 'finished_date') {
			status[status.findIndex((element) => element.product_id == row.id)] = row;
			status[
				status.findIndex((element) => element.product_id == row.id) + 1
			].received_date = received_date;
		} else {
			status[status.findIndex((element) => element.product_id == row.id)] = row;
		}
		const products = [...status];
		let updateStatus;
		if (key == 'finished_date') {
			updateStatus = await Http.post(`/api/status/${details.id}`, [
				products[status.findIndex((element) => element.product_id == row.id)],
				products[status.findIndex((element) => element.product_id == row.id) + 1]
			]);
		} else {
			updateStatus = await Http.post(`/api/status/${details.id}`, {
				products: products[status.findIndex((element) => element.product_id == row.id)]
			});
		}
		console.log(updateStatus.data);
		// setProduct(products);
		setStatus(products);
		setDetail(details);
		// setState({ details: state.details, products: state.products });
	};
	return (
		<HenkouContainer
			handleEvent={handleEvent}
			handleUpdate={handleUpdate}
			plandetail={planDetail}
			status={status}
			details={details}
			company={company}
			assessment={assessment}
			product={product}></HenkouContainer>
	);
};

const mapStateToProps = (state) => ({
	userInfo: state.auth.userInfo
});

export default connect(mapStateToProps)(Henkou);
