/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { serviceTitanApiRequest, serviceTitanApiRequestAllItems } from '../../transport/client';
import { API_PATHS } from '../../constants/constants';
import { cleanObject, buildQueryString, toExecutionData } from '../../utils/helpers';

export async function listInvoices(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const returnAll = this.getNodeParameter('returnAll', index) as boolean;
	const filters = this.getNodeParameter('filters', index, {}) as IDataObject;
	
	const qs = buildQueryString(filters);
	
	if (returnAll) {
		const data = await serviceTitanApiRequestAllItems.call(
			this,
			{ method: 'GET', endpoint: API_PATHS.invoices, qs },
			'data',
		);
		return toExecutionData(data);
	}
	
	const limit = this.getNodeParameter('limit', index) as number;
	qs.pageSize = limit;
	qs.page = 1;
	
	const response = await serviceTitanApiRequest.call(this, {
		method: 'GET',
		endpoint: API_PATHS.invoices,
		qs,
	}) as IDataObject;
	
	const data = (response.data as IDataObject[]) || [];
	return toExecutionData(data);
}

export async function getInvoice(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const invoiceId = this.getNodeParameter('invoiceId', index) as string;
	
	const response = await serviceTitanApiRequest.call(this, {
		method: 'GET',
		endpoint: `${API_PATHS.invoices}/${invoiceId}`,
	});
	
	return toExecutionData([response as IDataObject]);
}

export async function createInvoice(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const jobId = this.getNodeParameter('jobId', index) as string;
	const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;
	
	const body: IDataObject = {
		jobId: parseInt(jobId, 10),
		...cleanObject(additionalFields),
	};
	
	const response = await serviceTitanApiRequest.call(this, {
		method: 'POST',
		endpoint: API_PATHS.invoices,
		body,
	});
	
	return toExecutionData([response as IDataObject]);
}

export async function updateInvoice(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const invoiceId = this.getNodeParameter('invoiceId', index) as string;
	const updateFields = this.getNodeParameter('updateFields', index, {}) as IDataObject;
	
	const body = cleanObject(updateFields);
	
	const response = await serviceTitanApiRequest.call(this, {
		method: 'PATCH',
		endpoint: `${API_PATHS.invoices}/${invoiceId}`,
		body,
	});
	
	return toExecutionData([response as IDataObject]);
}

export async function getInvoiceItems(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const invoiceId = this.getNodeParameter('invoiceId', index) as string;
	
	const response = await serviceTitanApiRequest.call(this, {
		method: 'GET',
		endpoint: `${API_PATHS.invoices}/${invoiceId}/items`,
	}) as IDataObject;
	
	const data = (response.data as IDataObject[]) || [];
	return toExecutionData(data);
}

export async function addInvoiceItem(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const invoiceId = this.getNodeParameter('invoiceId', index) as string;
	const skuId = this.getNodeParameter('skuId', index) as string;
	const quantity = this.getNodeParameter('quantity', index) as number;
	const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;
	
	const body: IDataObject = {
		skuId: parseInt(skuId, 10),
		quantity,
		...cleanObject(additionalFields),
	};
	
	const response = await serviceTitanApiRequest.call(this, {
		method: 'POST',
		endpoint: `${API_PATHS.invoices}/${invoiceId}/items`,
		body,
	});
	
	return toExecutionData([response as IDataObject]);
}

export async function removeInvoiceItem(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const invoiceId = this.getNodeParameter('invoiceId', index) as string;
	const itemId = this.getNodeParameter('itemId', index) as string;
	
	await serviceTitanApiRequest.call(this, {
		method: 'DELETE',
		endpoint: `${API_PATHS.invoices}/${invoiceId}/items/${itemId}`,
	});
	
	return toExecutionData([{ success: true, invoiceId, itemId }]);
}

export async function emailInvoice(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const invoiceId = this.getNodeParameter('invoiceId', index) as string;
	const email = this.getNodeParameter('email', index) as string;
	const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;
	
	const body: IDataObject = {
		email,
		...cleanObject(additionalFields),
	};
	
	const response = await serviceTitanApiRequest.call(this, {
		method: 'POST',
		endpoint: `${API_PATHS.invoices}/${invoiceId}/email`,
		body,
	});
	
	return toExecutionData([response as IDataObject]);
}

export async function getInvoicePayments(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const invoiceId = this.getNodeParameter('invoiceId', index) as string;
	
	const response = await serviceTitanApiRequest.call(this, {
		method: 'GET',
		endpoint: API_PATHS.payments,
		qs: { invoiceId },
	}) as IDataObject;
	
	const data = (response.data as IDataObject[]) || [];
	return toExecutionData(data);
}
