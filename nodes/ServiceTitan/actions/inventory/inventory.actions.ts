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

export async function listInventory(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const returnAll = this.getNodeParameter('returnAll', index) as boolean;
	const filters = this.getNodeParameter('filters', index, {}) as IDataObject;
	
	const qs = buildQueryString(filters);
	
	// Use materials endpoint for inventory items
	if (returnAll) {
		const data = await serviceTitanApiRequestAllItems.call(
			this,
			{ method: 'GET', endpoint: API_PATHS.materials, qs },
			'data',
		);
		return toExecutionData(data);
	}
	
	const limit = this.getNodeParameter('limit', index) as number;
	qs.pageSize = limit;
	qs.page = 1;
	
	const response = await serviceTitanApiRequest.call(this, {
		method: 'GET',
		endpoint: API_PATHS.materials,
		qs,
	}) as IDataObject;
	
	const data = (response.data as IDataObject[]) || [];
	return toExecutionData(data);
}

export async function getInventoryItem(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const itemId = this.getNodeParameter('itemId', index) as string;
	
	const response = await serviceTitanApiRequest.call(this, {
		method: 'GET',
		endpoint: `${API_PATHS.materials}/${itemId}`,
	});
	
	return toExecutionData([response as IDataObject]);
}

export async function updateInventoryQuantity(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const itemId = this.getNodeParameter('itemId', index) as string;
	const warehouseId = this.getNodeParameter('warehouseId', index) as string;
	const quantity = this.getNodeParameter('quantity', index) as number;
	const adjustmentType = this.getNodeParameter('adjustmentType', index) as string;
	const reason = this.getNodeParameter('reason', index, '') as string;
	
	const body: IDataObject = {
		materialId: parseInt(itemId, 10),
		warehouseId: parseInt(warehouseId, 10),
		quantity,
		adjustmentType,
	};
	
	if (reason) {
		body.reason = reason;
	}
	
	const response = await serviceTitanApiRequest.call(this, {
		method: 'POST',
		endpoint: API_PATHS.inventory,
		body,
	});
	
	return toExecutionData([response as IDataObject]);
}

export async function listPurchaseOrders(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const returnAll = this.getNodeParameter('returnAll', index) as boolean;
	const filters = this.getNodeParameter('filters', index, {}) as IDataObject;
	
	const qs = buildQueryString(filters);
	
	if (returnAll) {
		const data = await serviceTitanApiRequestAllItems.call(
			this,
			{ method: 'GET', endpoint: API_PATHS.purchaseOrders, qs },
			'data',
		);
		return toExecutionData(data);
	}
	
	const limit = this.getNodeParameter('limit', index) as number;
	qs.pageSize = limit;
	qs.page = 1;
	
	const response = await serviceTitanApiRequest.call(this, {
		method: 'GET',
		endpoint: API_PATHS.purchaseOrders,
		qs,
	}) as IDataObject;
	
	const data = (response.data as IDataObject[]) || [];
	return toExecutionData(data);
}

export async function createPurchaseOrder(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const vendorId = this.getNodeParameter('vendorId', index) as string;
	const warehouseId = this.getNodeParameter('warehouseId', index) as string;
	const items = this.getNodeParameter('items', index) as IDataObject[];
	const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;
	
	const body: IDataObject = {
		vendorId: parseInt(vendorId, 10),
		warehouseId: parseInt(warehouseId, 10),
		items: items.map((item) => ({
			materialId: parseInt(item.materialId as string, 10),
			quantity: item.quantity,
			unitCost: item.unitCost,
		})),
		...cleanObject(additionalFields),
	};
	
	const response = await serviceTitanApiRequest.call(this, {
		method: 'POST',
		endpoint: API_PATHS.purchaseOrders,
		body,
	});
	
	return toExecutionData([response as IDataObject]);
}

export async function listVendors(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const returnAll = this.getNodeParameter('returnAll', index) as boolean;
	const filters = this.getNodeParameter('filters', index, {}) as IDataObject;
	
	const qs = buildQueryString(filters);
	
	if (returnAll) {
		const data = await serviceTitanApiRequestAllItems.call(
			this,
			{ method: 'GET', endpoint: API_PATHS.vendors, qs },
			'data',
		);
		return toExecutionData(data);
	}
	
	const limit = this.getNodeParameter('limit', index) as number;
	qs.pageSize = limit;
	qs.page = 1;
	
	const response = await serviceTitanApiRequest.call(this, {
		method: 'GET',
		endpoint: API_PATHS.vendors,
		qs,
	}) as IDataObject;
	
	const data = (response.data as IDataObject[]) || [];
	return toExecutionData(data);
}

export async function getWarehouseQuantities(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const warehouseId = this.getNodeParameter('warehouseId', index) as string;
	const filters = this.getNodeParameter('filters', index, {}) as IDataObject;
	
	const qs = buildQueryString({
		...filters,
		warehouseId,
	});
	
	const response = await serviceTitanApiRequest.call(this, {
		method: 'GET',
		endpoint: `${API_PATHS.warehouses}/${warehouseId}/quantities`,
		qs,
	}) as IDataObject;
	
	const data = (response.data as IDataObject[]) || [];
	return toExecutionData(data);
}
