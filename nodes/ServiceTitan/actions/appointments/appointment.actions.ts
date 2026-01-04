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

export async function listAppointments(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const returnAll = this.getNodeParameter('returnAll', index) as boolean;
	const filters = this.getNodeParameter('filters', index, {}) as IDataObject;
	
	const qs = buildQueryString(filters);
	
	if (returnAll) {
		const data = await serviceTitanApiRequestAllItems.call(
			this,
			{ method: 'GET', endpoint: API_PATHS.appointments, qs },
			'data',
		);
		return toExecutionData(data);
	}
	
	const limit = this.getNodeParameter('limit', index) as number;
	qs.pageSize = limit;
	qs.page = 1;
	
	const response = await serviceTitanApiRequest.call(this, {
		method: 'GET',
		endpoint: API_PATHS.appointments,
		qs,
	}) as IDataObject;
	
	const data = (response.data as IDataObject[]) || [];
	return toExecutionData(data);
}

export async function getAppointment(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const appointmentId = this.getNodeParameter('appointmentId', index) as string;
	
	const response = await serviceTitanApiRequest.call(this, {
		method: 'GET',
		endpoint: `${API_PATHS.appointments}/${appointmentId}`,
	});
	
	return toExecutionData([response as IDataObject]);
}

export async function createAppointment(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const jobId = this.getNodeParameter('jobId', index) as string;
	const start = this.getNodeParameter('start', index) as string;
	const end = this.getNodeParameter('end', index) as string;
	const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;
	
	const body: IDataObject = {
		jobId: parseInt(jobId, 10),
		start,
		end,
		...cleanObject(additionalFields),
	};
	
	const response = await serviceTitanApiRequest.call(this, {
		method: 'POST',
		endpoint: API_PATHS.appointments,
		body,
	});
	
	return toExecutionData([response as IDataObject]);
}

export async function updateAppointment(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const appointmentId = this.getNodeParameter('appointmentId', index) as string;
	const updateFields = this.getNodeParameter('updateFields', index, {}) as IDataObject;
	
	const body = cleanObject(updateFields);
	
	const response = await serviceTitanApiRequest.call(this, {
		method: 'PATCH',
		endpoint: `${API_PATHS.appointments}/${appointmentId}`,
		body,
	});
	
	return toExecutionData([response as IDataObject]);
}

export async function rescheduleAppointment(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const appointmentId = this.getNodeParameter('appointmentId', index) as string;
	const start = this.getNodeParameter('start', index) as string;
	const end = this.getNodeParameter('end', index) as string;
	const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;
	
	const body: IDataObject = {
		start,
		end,
		...cleanObject(additionalFields),
	};
	
	const response = await serviceTitanApiRequest.call(this, {
		method: 'POST',
		endpoint: `${API_PATHS.appointments}/${appointmentId}/reschedule`,
		body,
	});
	
	return toExecutionData([response as IDataObject]);
}

export async function cancelAppointment(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const appointmentId = this.getNodeParameter('appointmentId', index) as string;
	const cancelReasonId = this.getNodeParameter('cancelReasonId', index, null) as string | null;
	const memo = this.getNodeParameter('memo', index, '') as string;
	
	const body: IDataObject = {};
	
	if (cancelReasonId) {
		body.cancelReasonId = parseInt(cancelReasonId, 10);
	}
	
	if (memo) {
		body.memo = memo;
	}
	
	const response = await serviceTitanApiRequest.call(this, {
		method: 'POST',
		endpoint: `${API_PATHS.appointments}/${appointmentId}/cancel`,
		body,
	});
	
	return toExecutionData([response as IDataObject]);
}

export async function assignTechnician(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const appointmentId = this.getNodeParameter('appointmentId', index) as string;
	const technicianId = this.getNodeParameter('technicianId', index) as string;
	const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;
	
	const body: IDataObject = {
		technicianId: parseInt(technicianId, 10),
		...cleanObject(additionalFields),
	};
	
	const response = await serviceTitanApiRequest.call(this, {
		method: 'POST',
		endpoint: `${API_PATHS.appointments}/${appointmentId}/assign`,
		body,
	});
	
	return toExecutionData([response as IDataObject]);
}

export async function unassignTechnician(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const appointmentId = this.getNodeParameter('appointmentId', index) as string;
	const technicianId = this.getNodeParameter('technicianId', index) as string;
	
	const body: IDataObject = {
		technicianId: parseInt(technicianId, 10),
	};
	
	const response = await serviceTitanApiRequest.call(this, {
		method: 'POST',
		endpoint: `${API_PATHS.appointments}/${appointmentId}/unassign`,
		body,
	});
	
	return toExecutionData([response as IDataObject]);
}

export async function completeAppointment(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const appointmentId = this.getNodeParameter('appointmentId', index) as string;
	const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;
	
	const body = cleanObject(additionalFields);
	
	const response = await serviceTitanApiRequest.call(this, {
		method: 'POST',
		endpoint: `${API_PATHS.appointments}/${appointmentId}/complete`,
		body,
	});
	
	return toExecutionData([response as IDataObject]);
}
