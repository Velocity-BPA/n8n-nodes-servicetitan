/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
	IHookFunctions,
	IWebhookFunctions,
	INodeType,
	INodeTypeDescription,
	IWebhookResponseData,
	IDataObject,
} from 'n8n-workflow';

import { LICENSING_NOTICE } from './constants/constants';

let licensingNoticeLogged = false;

export class ServiceTitanTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'ServiceTitan Trigger',
		name: 'serviceTitanTrigger',
		icon: 'file:servicetitan.svg',
		group: ['trigger'],
		version: 1,
		subtitle: '={{$parameter["event"]}}',
		description: 'Handle ServiceTitan webhook events for field service management',
		defaults: {
			name: 'ServiceTitan Trigger',
		},
		inputs: [],
		outputs: ['main'],
		credentials: [
			{
				name: 'serviceTitanApi',
				required: true,
			},
		],
		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: 'webhook',
			},
		],
		properties: [
			{
				displayName: 'Event',
				name: 'event',
				type: 'options',
				noDataExpression: true,
				required: true,
				default: 'jobCreated',
				options: [
					{
						name: 'Appointment Completed',
						value: 'appointmentCompleted',
						description: 'Triggered when an appointment is marked complete',
					},
					{
						name: 'Appointment Scheduled',
						value: 'appointmentScheduled',
						description: 'Triggered when an appointment is booked',
					},
					{
						name: 'Customer Created',
						value: 'customerCreated',
						description: 'Triggered when a new customer is created',
					},
					{
						name: 'Estimate Approved',
						value: 'estimateApproved',
						description: 'Triggered when an estimate is approved',
					},
					{
						name: 'Invoice Created',
						value: 'invoiceCreated',
						description: 'Triggered when an invoice is created',
					},
					{
						name: 'Job Completed',
						value: 'jobCompleted',
						description: 'Triggered when a job is completed',
					},
					{
						name: 'Job Created',
						value: 'jobCreated',
						description: 'Triggered when a new job is created',
					},
					{
						name: 'Lead Created',
						value: 'leadCreated',
						description: 'Triggered when a new lead/booking is created',
					},
					{
						name: 'Membership Created',
						value: 'membershipCreated',
						description: 'Triggered when a membership is sold',
					},
					{
						name: 'Payment Received',
						value: 'paymentReceived',
						description: 'Triggered when a payment is received',
					},
				],
			},
			{
				displayName: 'Options',
				name: 'options',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				options: [
					{
						displayName: 'Include Raw Data',
						name: 'includeRawData',
						type: 'boolean',
						default: false,
						description: 'Whether to include the raw webhook payload',
					},
				],
			},
		],
	};

	webhookMethods = {
		default: {
			async checkExists(this: IHookFunctions): Promise<boolean> {
				// Log licensing notice once
				if (!licensingNoticeLogged) {
					console.warn(LICENSING_NOTICE);
					licensingNoticeLogged = true;
				}

				// ServiceTitan webhooks are managed through their portal
				// This checks if the webhook URL has been registered
				const webhookUrl = this.getNodeWebhookUrl('default');
				const webhookData = this.getWorkflowStaticData('node');

				if (webhookData.webhookUrl === webhookUrl) {
					return true;
				}

				return false;
			},
			async create(this: IHookFunctions): Promise<boolean> {
				const webhookUrl = this.getNodeWebhookUrl('default');
				const webhookData = this.getWorkflowStaticData('node');
				const event = this.getNodeParameter('event') as string;

				// Store webhook configuration
				webhookData.webhookUrl = webhookUrl;
				webhookData.event = event;

				// Note: ServiceTitan webhooks must be configured in their portal
				// This node provides the endpoint URL for receiving events
				console.info(`ServiceTitan Trigger: Configure webhook in ServiceTitan portal`);
				console.info(`Webhook URL: ${webhookUrl}`);
				console.info(`Event Type: ${event}`);

				return true;
			},
			async delete(this: IHookFunctions): Promise<boolean> {
				const webhookData = this.getWorkflowStaticData('node');

				// Clear stored webhook data
				delete webhookData.webhookUrl;
				delete webhookData.event;

				return true;
			},
		},
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const req = this.getRequestObject();
		const event = this.getNodeParameter('event') as string;
		const options = this.getNodeParameter('options') as { includeRawData?: boolean };

		const body = req.body;
		const headers = req.headers;

		// Validate the event type matches (if ServiceTitan provides it)
		const receivedEventType = headers['x-servicetitan-event'] || body.eventType;

		// Build response data
		const responseData: IDataObject = {
			event: receivedEventType || event,
			timestamp: new Date().toISOString(),
			webhookId: headers['x-servicetitan-webhook-id'] || null,
			data: body.data || body,
		};

		// Include raw data if requested
		if (options.includeRawData) {
			responseData.rawPayload = body;
			responseData.headers = headers;
		}

		// Extract common fields based on event type
		if (body.data) {
			const data = body.data;
			switch (event) {
				case 'jobCreated':
				case 'jobCompleted':
					responseData.jobId = data.id || data.jobId;
					responseData.jobNumber = data.jobNumber;
					responseData.customerId = data.customerId;
					responseData.locationId = data.locationId;
					responseData.status = data.status;
					break;

				case 'appointmentScheduled':
				case 'appointmentCompleted':
					responseData.appointmentId = data.id || data.appointmentId;
					responseData.jobId = data.jobId;
					responseData.technicianId = data.technicianId;
					responseData.scheduledStart = data.start;
					responseData.scheduledEnd = data.end;
					break;

				case 'customerCreated':
					responseData.customerId = data.id || data.customerId;
					responseData.customerName = data.name;
					responseData.email = data.email;
					responseData.phone = data.phone;
					break;

				case 'invoiceCreated':
					responseData.invoiceId = data.id || data.invoiceId;
					responseData.invoiceNumber = data.number;
					responseData.jobId = data.jobId;
					responseData.total = data.total;
					responseData.balance = data.balance;
					break;

				case 'paymentReceived':
					responseData.paymentId = data.id || data.paymentId;
					responseData.invoiceId = data.invoiceId;
					responseData.amount = data.amount;
					responseData.paymentType = data.type;
					break;

				case 'leadCreated':
					responseData.leadId = data.id || data.leadId;
					responseData.customerName = data.customerName;
					responseData.source = data.source;
					responseData.campaignId = data.campaignId;
					break;

				case 'membershipCreated':
					responseData.membershipId = data.id || data.membershipId;
					responseData.membershipType = data.membershipTypeId;
					responseData.customerId = data.customerId;
					responseData.locationId = data.locationId;
					break;

				case 'estimateApproved':
					responseData.estimateId = data.id || data.estimateId;
					responseData.jobId = data.jobId;
					responseData.total = data.total;
					responseData.approvedAt = data.approvedAt;
					break;
			}
		}

		return {
			workflowData: [this.helpers.returnJsonArray([responseData])],
		};
	}
}
