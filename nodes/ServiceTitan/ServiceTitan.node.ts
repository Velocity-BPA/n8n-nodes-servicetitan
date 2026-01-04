/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

import {
	RESOURCES,
	CUSTOMER_OPERATIONS,
	LOCATION_OPERATIONS,
	JOB_OPERATIONS,
	APPOINTMENT_OPERATIONS,
	BOOKING_OPERATIONS,
	LEAD_OPERATIONS,
	INVOICE_OPERATIONS,
	PAYMENT_OPERATIONS,
	ESTIMATE_OPERATIONS,
	TECHNICIAN_OPERATIONS,
	DISPATCH_OPERATIONS,
	INVENTORY_OPERATIONS,
	PRICEBOOK_OPERATIONS,
	MEMBERSHIP_OPERATIONS,
	CAMPAIGN_OPERATIONS,
	REPORT_OPERATIONS,
	USER_OPERATIONS,
} from './constants/constants';

import * as customerActions from './actions/customers/customer.actions';
import * as locationActions from './actions/locations/location.actions';
import * as jobActions from './actions/jobs/job.actions';
import * as appointmentActions from './actions/appointments/appointment.actions';
import * as bookingActions from './actions/bookings/booking.actions';
import * as leadActions from './actions/leads/lead.actions';
import * as invoiceActions from './actions/invoices/invoice.actions';
import * as paymentActions from './actions/payments/payment.actions';
import * as estimateActions from './actions/estimates/estimate.actions';
import * as technicianActions from './actions/technicians/technician.actions';
import * as dispatchActions from './actions/dispatch/dispatch.actions';
import * as inventoryActions from './actions/inventory/inventory.actions';
import * as pricebookActions from './actions/pricebook/pricebook.actions';
import * as membershipActions from './actions/memberships/membership.actions';
import * as campaignActions from './actions/campaigns/campaign.actions';
import * as reportActions from './actions/reports/report.actions';
import * as userActions from './actions/users/user.actions';

export class ServiceTitan implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'ServiceTitan',
		name: 'serviceTitan',
		icon: 'file:servicetitan.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with ServiceTitan API for field service management',
		defaults: {
			name: 'ServiceTitan',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'serviceTitanApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: RESOURCES,
				default: 'customer',
			},
			// Customer Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['customer'],
					},
				},
				options: CUSTOMER_OPERATIONS,
				default: 'listCustomers',
			},
			// Location Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['location'],
					},
				},
				options: LOCATION_OPERATIONS,
				default: 'listLocations',
			},
			// Job Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['job'],
					},
				},
				options: JOB_OPERATIONS,
				default: 'listJobs',
			},
			// Appointment Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['appointment'],
					},
				},
				options: APPOINTMENT_OPERATIONS,
				default: 'listAppointments',
			},
			// Booking Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['booking'],
					},
				},
				options: BOOKING_OPERATIONS,
				default: 'listBookings',
			},
			// Lead Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['lead'],
					},
				},
				options: LEAD_OPERATIONS,
				default: 'listLeads',
			},
			// Invoice Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['invoice'],
					},
				},
				options: INVOICE_OPERATIONS,
				default: 'listInvoices',
			},
			// Payment Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['payment'],
					},
				},
				options: PAYMENT_OPERATIONS,
				default: 'listPayments',
			},
			// Estimate Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['estimate'],
					},
				},
				options: ESTIMATE_OPERATIONS,
				default: 'listEstimates',
			},
			// Technician Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['technician'],
					},
				},
				options: TECHNICIAN_OPERATIONS,
				default: 'listTechnicians',
			},
			// Dispatch Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['dispatch'],
					},
				},
				options: DISPATCH_OPERATIONS,
				default: 'getDispatchBoard',
			},
			// Inventory Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['inventory'],
					},
				},
				options: INVENTORY_OPERATIONS,
				default: 'listInventory',
			},
			// Pricebook Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['pricebook'],
					},
				},
				options: PRICEBOOK_OPERATIONS,
				default: 'listServices',
			},
			// Membership Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['membership'],
					},
				},
				options: MEMBERSHIP_OPERATIONS,
				default: 'listMemberships',
			},
			// Campaign Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['campaign'],
					},
				},
				options: CAMPAIGN_OPERATIONS,
				default: 'listCampaigns',
			},
			// Report Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['report'],
					},
				},
				options: REPORT_OPERATIONS,
				default: 'getRevenueReport',
			},
			// User Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['user'],
					},
				},
				options: USER_OPERATIONS,
				default: 'listUsers',
			},
			// Common fields for list operations
			{
				displayName: 'Return All',
				name: 'returnAll',
				type: 'boolean',
				default: false,
				description: 'Whether to return all results or only up to a given limit',
				displayOptions: {
					show: {
						operation: [
							'listCustomers', 'listLocations', 'listJobs', 'listAppointments',
							'listBookings', 'listLeads', 'listInvoices', 'listPayments',
							'listEstimates', 'listTechnicians', 'listInventory', 'listPurchaseOrders',
							'listVendors', 'listServices', 'listMaterials', 'listEquipment',
							'listMemberships', 'listCampaigns', 'listUsers',
						],
					},
				},
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				default: 50,
				description: 'Max number of results to return',
				typeOptions: {
					minValue: 1,
					maxValue: 100,
				},
				displayOptions: {
					show: {
						operation: [
							'listCustomers', 'listLocations', 'listJobs', 'listAppointments',
							'listBookings', 'listLeads', 'listInvoices', 'listPayments',
							'listEstimates', 'listTechnicians', 'listInventory', 'listPurchaseOrders',
							'listVendors', 'listServices', 'listMaterials', 'listEquipment',
							'listMemberships', 'listCampaigns', 'listUsers',
						],
						returnAll: [false],
					},
				},
			},
			// ID fields for various operations
			{
				displayName: 'Customer ID',
				name: 'customerId',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['customer'],
						operation: ['getCustomer', 'updateCustomer', 'getCustomerContacts', 'addCustomerContact', 'getCustomerLocations', 'getCustomerNotes', 'addCustomerNote', 'getCustomerEquipment'],
					},
				},
			},
			{
				displayName: 'Customer ID',
				name: 'customerId',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['location'],
						operation: ['createLocation'],
					},
				},
			},
			{
				displayName: 'Customer ID',
				name: 'customerId',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['job'],
						operation: ['createJob'],
					},
				},
			},
			{
				displayName: 'Customer ID',
				name: 'customerId',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['membership'],
						operation: ['createMembership'],
					},
				},
			},
			{
				displayName: 'Location ID',
				name: 'locationId',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['location'],
						operation: ['getLocation', 'updateLocation', 'getLocationEquipment', 'getLocationHistory'],
					},
				},
			},
			{
				displayName: 'Location ID',
				name: 'locationId',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['job'],
						operation: ['createJob'],
					},
				},
			},
			{
				displayName: 'Location ID',
				name: 'locationId',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['membership'],
						operation: ['createMembership'],
					},
				},
			},
			{
				displayName: 'Job ID',
				name: 'jobId',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['job'],
						operation: ['getJob', 'updateJob', 'cancelJob', 'completeJob', 'getJobAppointments', 'getJobInvoices', 'getJobHistory', 'getJobNotes', 'addJobNote'],
					},
				},
			},
			{
				displayName: 'Job ID',
				name: 'jobId',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['appointment'],
						operation: ['createAppointment'],
					},
				},
			},
			{
				displayName: 'Job ID',
				name: 'jobId',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['invoice'],
						operation: ['createInvoice'],
					},
				},
			},
			{
				displayName: 'Job ID',
				name: 'jobId',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['estimate'],
						operation: ['createEstimate'],
					},
				},
			},
			{
				displayName: 'Job Type ID',
				name: 'jobTypeId',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['job'],
						operation: ['createJob'],
					},
				},
			},
			{
				displayName: 'Job Type ID',
				name: 'jobTypeId',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['booking', 'lead'],
						operation: ['convertToJob', 'convertLead'],
					},
				},
			},
			{
				displayName: 'Appointment ID',
				name: 'appointmentId',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['appointment'],
						operation: ['getAppointment', 'updateAppointment', 'rescheduleAppointment', 'cancelAppointment', 'assignTechnician', 'unassignTechnician', 'completeAppointment'],
					},
				},
			},
			{
				displayName: 'Booking ID',
				name: 'bookingId',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['booking'],
						operation: ['getBooking', 'updateBooking', 'convertToJob', 'dismissBooking'],
					},
				},
			},
			{
				displayName: 'Lead ID',
				name: 'leadId',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['lead'],
						operation: ['getLead', 'updateLead', 'convertLead', 'dismissLead', 'addFollowUp'],
					},
				},
			},
			{
				displayName: 'Invoice ID',
				name: 'invoiceId',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['invoice'],
						operation: ['getInvoice', 'updateInvoice', 'getInvoiceItems', 'addInvoiceItem', 'removeInvoiceItem', 'emailInvoice', 'getInvoicePayments'],
					},
				},
			},
			{
				displayName: 'Invoice ID',
				name: 'invoiceId',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['payment'],
						operation: ['createPayment'],
					},
				},
			},
			{
				displayName: 'Payment ID',
				name: 'paymentId',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['payment'],
						operation: ['getPayment', 'refundPayment', 'voidPayment'],
					},
				},
			},
			{
				displayName: 'Estimate ID',
				name: 'estimateId',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['estimate'],
						operation: ['getEstimate', 'updateEstimate', 'approveEstimate', 'declineEstimate', 'convertToInvoice', 'emailEstimate'],
					},
				},
			},
			{
				displayName: 'Technician ID',
				name: 'technicianId',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['technician'],
						operation: ['getTechnician', 'updateTechnician', 'getTechnicianSchedule', 'getTechnicianCapacity', 'getTechnicianPerformance'],
					},
				},
			},
			{
				displayName: 'Technician ID',
				name: 'technicianId',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['appointment'],
						operation: ['assignTechnician', 'unassignTechnician'],
					},
				},
			},
			{
				displayName: 'Membership ID',
				name: 'membershipId',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['membership'],
						operation: ['getMembership', 'updateMembership', 'cancelMembership', 'getMembershipLocations'],
					},
				},
			},
			{
				displayName: 'Membership Type ID',
				name: 'membershipTypeId',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['membership'],
						operation: ['createMembership'],
					},
				},
			},
			{
				displayName: 'Campaign ID',
				name: 'campaignId',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['campaign'],
						operation: ['getCampaign', 'getCampaignMetrics'],
					},
				},
			},
			{
				displayName: 'User ID',
				name: 'userId',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['user'],
						operation: ['getUser', 'getUserRoles', 'getUserPermissions'],
					},
				},
			},
			// Name fields
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['customer'],
						operation: ['createCustomer'],
					},
				},
				description: 'Customer name',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['booking', 'lead'],
						operation: ['createBooking', 'createLead'],
					},
				},
				description: 'Contact name',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['estimate'],
						operation: ['createEstimate'],
					},
				},
				description: 'Estimate name',
			},
			// Phone field
			{
				displayName: 'Phone',
				name: 'phone',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['booking', 'lead'],
						operation: ['createBooking', 'createLead'],
					},
				},
				description: 'Contact phone number',
			},
			// Address fields
			{
				displayName: 'Street',
				name: 'street',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['location'],
						operation: ['createLocation'],
					},
				},
			},
			{
				displayName: 'City',
				name: 'city',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['location'],
						operation: ['createLocation'],
					},
				},
			},
			{
				displayName: 'State',
				name: 'state',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['location'],
						operation: ['createLocation'],
					},
				},
			},
			{
				displayName: 'ZIP',
				name: 'zip',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['location'],
						operation: ['createLocation'],
					},
				},
			},
			// Date/Time fields
			{
				displayName: 'Start',
				name: 'start',
				type: 'dateTime',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['appointment'],
						operation: ['createAppointment', 'rescheduleAppointment'],
					},
				},
				description: 'Appointment start time',
			},
			{
				displayName: 'End',
				name: 'end',
				type: 'dateTime',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['appointment'],
						operation: ['createAppointment', 'rescheduleAppointment'],
					},
				},
				description: 'Appointment end time',
			},
			{
				displayName: 'Date',
				name: 'date',
				type: 'dateTime',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['dispatch'],
						operation: ['getDispatchBoard', 'getCapacity', 'optimizeRoutes'],
					},
				},
			},
			{
				displayName: 'Date',
				name: 'date',
				type: 'dateTime',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['technician'],
						operation: ['getTechnicianCapacity'],
					},
				},
			},
			{
				displayName: 'Start Date',
				name: 'startDate',
				type: 'dateTime',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['technician'],
						operation: ['getTechnicianSchedule', 'getTechnicianPerformance'],
					},
				},
			},
			{
				displayName: 'End Date',
				name: 'endDate',
				type: 'dateTime',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['technician'],
						operation: ['getTechnicianSchedule', 'getTechnicianPerformance'],
					},
				},
			},
			{
				displayName: 'Start Date',
				name: 'startDate',
				type: 'dateTime',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['report'],
						operation: ['getRevenueReport', 'getTechnicianReport', 'getCallReport', 'getConversionReport'],
					},
				},
			},
			{
				displayName: 'End Date',
				name: 'endDate',
				type: 'dateTime',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['report'],
						operation: ['getRevenueReport', 'getTechnicianReport', 'getCallReport', 'getConversionReport'],
					},
				},
			},
			{
				displayName: 'Start Date',
				name: 'startDate',
				type: 'dateTime',
				default: '',
				displayOptions: {
					show: {
						resource: ['campaign'],
						operation: ['getCampaignMetrics'],
					},
				},
			},
			{
				displayName: 'End Date',
				name: 'endDate',
				type: 'dateTime',
				default: '',
				displayOptions: {
					show: {
						resource: ['campaign'],
						operation: ['getCampaignMetrics'],
					},
				},
			},
			{
				displayName: 'Follow-Up Date',
				name: 'followUpDate',
				type: 'dateTime',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['lead'],
						operation: ['addFollowUp'],
					},
				},
			},
			// Technician fields
			{
				displayName: 'First Name',
				name: 'firstName',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['technician'],
						operation: ['createTechnician'],
					},
				},
			},
			{
				displayName: 'Last Name',
				name: 'lastName',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['technician'],
						operation: ['createTechnician'],
					},
				},
			},
			// Contact fields
			{
				displayName: 'Contact Type',
				name: 'contactType',
				type: 'options',
				options: [
					{ name: 'Email', value: 'Email' },
					{ name: 'Phone', value: 'Phone' },
					{ name: 'Mobile', value: 'MobilePhone' },
					{ name: 'Fax', value: 'Fax' },
				],
				required: true,
				default: 'Phone',
				displayOptions: {
					show: {
						resource: ['customer'],
						operation: ['addCustomerContact'],
					},
				},
			},
			{
				displayName: 'Contact Value',
				name: 'contactValue',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['customer'],
						operation: ['addCustomerContact'],
					},
				},
			},
			// Note fields
			{
				displayName: 'Note Text',
				name: 'noteText',
				type: 'string',
				typeOptions: {
					rows: 4,
				},
				required: true,
				default: '',
				displayOptions: {
					show: {
						operation: ['addCustomerNote', 'addJobNote'],
					},
				},
			},
			{
				displayName: 'Note',
				name: 'note',
				type: 'string',
				typeOptions: {
					rows: 4,
				},
				default: '',
				displayOptions: {
					show: {
						resource: ['lead'],
						operation: ['addFollowUp'],
					},
				},
			},
			// Payment fields
			{
				displayName: 'Amount',
				name: 'amount',
				type: 'number',
				required: true,
				default: 0,
				displayOptions: {
					show: {
						resource: ['payment'],
						operation: ['createPayment', 'refundPayment'],
					},
				},
			},
			{
				displayName: 'Payment Type ID',
				name: 'paymentTypeId',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['payment'],
						operation: ['createPayment'],
					},
				},
			},
			// Invoice item fields
			{
				displayName: 'SKU ID',
				name: 'skuId',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['invoice'],
						operation: ['addInvoiceItem'],
					},
				},
			},
			{
				displayName: 'Quantity',
				name: 'quantity',
				type: 'number',
				required: true,
				default: 1,
				displayOptions: {
					show: {
						resource: ['invoice'],
						operation: ['addInvoiceItem'],
					},
				},
			},
			{
				displayName: 'Item ID',
				name: 'itemId',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['invoice'],
						operation: ['removeInvoiceItem'],
					},
				},
			},
			// Inventory fields
			{
				displayName: 'Item ID',
				name: 'itemId',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['inventory'],
						operation: ['getInventoryItem', 'updateInventoryQuantity'],
					},
				},
			},
			{
				displayName: 'Warehouse ID',
				name: 'warehouseId',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['inventory'],
						operation: ['updateInventoryQuantity', 'createPurchaseOrder', 'getWarehouseQuantities'],
					},
				},
			},
			{
				displayName: 'Quantity',
				name: 'quantity',
				type: 'number',
				required: true,
				default: 0,
				displayOptions: {
					show: {
						resource: ['inventory'],
						operation: ['updateInventoryQuantity'],
					},
				},
			},
			{
				displayName: 'Adjustment Type',
				name: 'adjustmentType',
				type: 'options',
				options: [
					{ name: 'Add', value: 'Add' },
					{ name: 'Remove', value: 'Remove' },
					{ name: 'Set', value: 'Set' },
				],
				required: true,
				default: 'Add',
				displayOptions: {
					show: {
						resource: ['inventory'],
						operation: ['updateInventoryQuantity'],
					},
				},
			},
			{
				displayName: 'Vendor ID',
				name: 'vendorId',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['inventory'],
						operation: ['createPurchaseOrder'],
					},
				},
			},
			{
				displayName: 'Items',
				name: 'items',
				type: 'fixedCollection',
				typeOptions: {
					multipleValues: true,
				},
				default: {},
				displayOptions: {
					show: {
						resource: ['inventory'],
						operation: ['createPurchaseOrder'],
					},
				},
				options: [
					{
						name: 'item',
						displayName: 'Item',
						values: [
							{
								displayName: 'Material ID',
								name: 'materialId',
								type: 'string',
								default: '',
							},
							{
								displayName: 'Quantity',
								name: 'quantity',
								type: 'number',
								default: 1,
							},
							{
								displayName: 'Unit Cost',
								name: 'unitCost',
								type: 'number',
								default: 0,
							},
						],
					},
				],
			},
			// Pricebook fields
			{
				displayName: 'Service ID',
				name: 'serviceId',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['pricebook'],
						operation: ['getService'],
					},
				},
			},
			{
				displayName: 'Material ID',
				name: 'materialId',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['pricebook'],
						operation: ['getMaterial'],
					},
				},
			},
			{
				displayName: 'Equipment ID',
				name: 'equipmentId',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['pricebook'],
						operation: ['getEquipment'],
					},
				},
			},
			// Report fields
			{
				displayName: 'Report ID',
				name: 'reportId',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['report'],
						operation: ['getCustomReport'],
					},
				},
			},
			{
				displayName: 'Parameters',
				name: 'parameters',
				type: 'collection',
				placeholder: 'Add Parameter',
				default: {},
				displayOptions: {
					show: {
						resource: ['report'],
						operation: ['getCustomReport'],
					},
				},
				options: [
					{
						displayName: 'Start Date',
						name: 'startDate',
						type: 'dateTime',
						default: '',
					},
					{
						displayName: 'End Date',
						name: 'endDate',
						type: 'dateTime',
						default: '',
					},
				],
			},
			// Email fields
			{
				displayName: 'Email',
				name: 'email',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						operation: ['emailInvoice', 'emailEstimate'],
					},
				},
			},
			// Reason fields
			{
				displayName: 'Reason',
				name: 'reason',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						operation: ['refundPayment', 'voidPayment', 'declineEstimate', 'updateInventoryQuantity'],
					},
				},
			},
			{
				displayName: 'Cancel Reason ID',
				name: 'cancelReasonId',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						operation: ['cancelJob', 'cancelAppointment', 'cancelMembership'],
					},
				},
			},
			{
				displayName: 'Dismiss Reason ID',
				name: 'dismissReasonId',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						operation: ['dismissBooking', 'dismissLead'],
					},
				},
			},
			{
				displayName: 'Memo',
				name: 'memo',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						operation: ['cancelJob', 'cancelAppointment', 'cancelMembership', 'dismissBooking', 'dismissLead'],
					},
				},
			},
			// Filters
			{
				displayName: 'Filters',
				name: 'filters',
				type: 'collection',
				placeholder: 'Add Filter',
				default: {},
				displayOptions: {
					show: {
						operation: [
							'listCustomers', 'listLocations', 'listJobs', 'listAppointments',
							'listBookings', 'listLeads', 'listInvoices', 'listPayments',
							'listEstimates', 'listTechnicians', 'listInventory', 'listPurchaseOrders',
							'listVendors', 'listServices', 'listMaterials', 'listEquipment',
							'listMemberships', 'listCampaigns', 'listUsers', 'getLocationHistory',
						],
					},
				},
				options: [
					{
						displayName: 'Active Only',
						name: 'active',
						type: 'boolean',
						default: true,
					},
					{
						displayName: 'Created After',
						name: 'createdOnOrAfter',
						type: 'dateTime',
						default: '',
					},
					{
						displayName: 'Created Before',
						name: 'createdOnOrBefore',
						type: 'dateTime',
						default: '',
					},
					{
						displayName: 'Modified After',
						name: 'modifiedOnOrAfter',
						type: 'dateTime',
						default: '',
					},
					{
						displayName: 'Modified Before',
						name: 'modifiedOnOrBefore',
						type: 'dateTime',
						default: '',
					},
					{
						displayName: 'Search',
						name: 'search',
						type: 'string',
						default: '',
					},
				],
			},
			// Additional Fields
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						operation: [
							'createCustomer', 'addCustomerContact', 'addCustomerNote', 'createLocation',
							'createJob', 'addJobNote', 'completeJob', 'createAppointment', 'rescheduleAppointment',
							'assignTechnician', 'completeAppointment', 'createBooking', 'createLead', 'addFollowUp',
							'createInvoice', 'addInvoiceItem', 'emailInvoice', 'createPayment', 'refundPayment',
							'createEstimate', 'approveEstimate', 'convertToInvoice', 'emailEstimate',
							'createTechnician', 'getDispatchBoard', 'getCapacity', 'optimizeRoutes',
							'createPurchaseOrder', 'createMembership', 'getRevenueReport', 'getTechnicianReport',
							'getCallReport', 'getConversionReport', 'convertToJob', 'convertLead',
						],
					},
				},
				options: [
					{
						displayName: 'Email',
						name: 'email',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Phone',
						name: 'phone',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Notes',
						name: 'notes',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Priority',
						name: 'priority',
						type: 'options',
						options: [
							{ name: 'Low', value: 'Low' },
							{ name: 'Normal', value: 'Normal' },
							{ name: 'High', value: 'High' },
							{ name: 'Urgent', value: 'Urgent' },
						],
						default: 'Normal',
					},
					{
						displayName: 'Campaign ID',
						name: 'campaignId',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Business Unit ID',
						name: 'businessUnitId',
						type: 'string',
						default: '',
					},
				],
			},
			// Update Fields
			{
				displayName: 'Update Fields',
				name: 'updateFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						operation: [
							'updateCustomer', 'updateLocation', 'updateJob', 'updateAppointment',
							'updateBooking', 'updateLead', 'updateInvoice', 'updateEstimate',
							'updateTechnician', 'updateMembership',
						],
					},
				},
				options: [
					{
						displayName: 'Name',
						name: 'name',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Email',
						name: 'email',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Phone',
						name: 'phone',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Notes',
						name: 'notes',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Active',
						name: 'active',
						type: 'boolean',
						default: true,
					},
				],
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			try {
				const resource = this.getNodeParameter('resource', i) as string;
				const operation = this.getNodeParameter('operation', i) as string;

				let result: INodeExecutionData[] = [];

				switch (resource) {
					case 'customer':
						result = await executeCustomerOperation.call(this, operation, i);
						break;
					case 'location':
						result = await executeLocationOperation.call(this, operation, i);
						break;
					case 'job':
						result = await executeJobOperation.call(this, operation, i);
						break;
					case 'appointment':
						result = await executeAppointmentOperation.call(this, operation, i);
						break;
					case 'booking':
						result = await executeBookingOperation.call(this, operation, i);
						break;
					case 'lead':
						result = await executeLeadOperation.call(this, operation, i);
						break;
					case 'invoice':
						result = await executeInvoiceOperation.call(this, operation, i);
						break;
					case 'payment':
						result = await executePaymentOperation.call(this, operation, i);
						break;
					case 'estimate':
						result = await executeEstimateOperation.call(this, operation, i);
						break;
					case 'technician':
						result = await executeTechnicianOperation.call(this, operation, i);
						break;
					case 'dispatch':
						result = await executeDispatchOperation.call(this, operation, i);
						break;
					case 'inventory':
						result = await executeInventoryOperation.call(this, operation, i);
						break;
					case 'pricebook':
						result = await executePricebookOperation.call(this, operation, i);
						break;
					case 'membership':
						result = await executeMembershipOperation.call(this, operation, i);
						break;
					case 'campaign':
						result = await executeCampaignOperation.call(this, operation, i);
						break;
					case 'report':
						result = await executeReportOperation.call(this, operation, i);
						break;
					case 'user':
						result = await executeUserOperation.call(this, operation, i);
						break;
					default:
						throw new NodeOperationError(this.getNode(), `Unknown resource: ${resource}`);
				}

				returnData.push(...result);
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: {
							error: (error as Error).message,
						},
						pairedItem: { item: i },
					});
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}

async function executeCustomerOperation(
	this: IExecuteFunctions,
	operation: string,
	index: number,
): Promise<INodeExecutionData[]> {
	switch (operation) {
		case 'listCustomers':
			return customerActions.listCustomers.call(this, index);
		case 'getCustomer':
			return customerActions.getCustomer.call(this, index);
		case 'createCustomer':
			return customerActions.createCustomer.call(this, index);
		case 'updateCustomer':
			return customerActions.updateCustomer.call(this, index);
		case 'getCustomerContacts':
			return customerActions.getCustomerContacts.call(this, index);
		case 'addCustomerContact':
			return customerActions.addCustomerContact.call(this, index);
		case 'getCustomerLocations':
			return customerActions.getCustomerLocations.call(this, index);
		case 'getCustomerNotes':
			return customerActions.getCustomerNotes.call(this, index);
		case 'addCustomerNote':
			return customerActions.addCustomerNote.call(this, index);
		case 'getCustomerEquipment':
			return customerActions.getCustomerEquipment.call(this, index);
		default:
			throw new NodeOperationError(this.getNode(), `Unknown customer operation: ${operation}`);
	}
}

async function executeLocationOperation(
	this: IExecuteFunctions,
	operation: string,
	index: number,
): Promise<INodeExecutionData[]> {
	switch (operation) {
		case 'listLocations':
			return locationActions.listLocations.call(this, index);
		case 'getLocation':
			return locationActions.getLocation.call(this, index);
		case 'createLocation':
			return locationActions.createLocation.call(this, index);
		case 'updateLocation':
			return locationActions.updateLocation.call(this, index);
		case 'getLocationEquipment':
			return locationActions.getLocationEquipment.call(this, index);
		case 'getLocationHistory':
			return locationActions.getLocationHistory.call(this, index);
		default:
			throw new NodeOperationError(this.getNode(), `Unknown location operation: ${operation}`);
	}
}

async function executeJobOperation(
	this: IExecuteFunctions,
	operation: string,
	index: number,
): Promise<INodeExecutionData[]> {
	switch (operation) {
		case 'listJobs':
			return jobActions.listJobs.call(this, index);
		case 'getJob':
			return jobActions.getJob.call(this, index);
		case 'createJob':
			return jobActions.createJob.call(this, index);
		case 'updateJob':
			return jobActions.updateJob.call(this, index);
		case 'cancelJob':
			return jobActions.cancelJob.call(this, index);
		case 'completeJob':
			return jobActions.completeJob.call(this, index);
		case 'getJobAppointments':
			return jobActions.getJobAppointments.call(this, index);
		case 'getJobInvoices':
			return jobActions.getJobInvoices.call(this, index);
		case 'getJobHistory':
			return jobActions.getJobHistory.call(this, index);
		case 'getJobNotes':
			return jobActions.getJobNotes.call(this, index);
		case 'addJobNote':
			return jobActions.addJobNote.call(this, index);
		default:
			throw new NodeOperationError(this.getNode(), `Unknown job operation: ${operation}`);
	}
}

async function executeAppointmentOperation(
	this: IExecuteFunctions,
	operation: string,
	index: number,
): Promise<INodeExecutionData[]> {
	switch (operation) {
		case 'listAppointments':
			return appointmentActions.listAppointments.call(this, index);
		case 'getAppointment':
			return appointmentActions.getAppointment.call(this, index);
		case 'createAppointment':
			return appointmentActions.createAppointment.call(this, index);
		case 'updateAppointment':
			return appointmentActions.updateAppointment.call(this, index);
		case 'rescheduleAppointment':
			return appointmentActions.rescheduleAppointment.call(this, index);
		case 'cancelAppointment':
			return appointmentActions.cancelAppointment.call(this, index);
		case 'assignTechnician':
			return appointmentActions.assignTechnician.call(this, index);
		case 'unassignTechnician':
			return appointmentActions.unassignTechnician.call(this, index);
		case 'completeAppointment':
			return appointmentActions.completeAppointment.call(this, index);
		default:
			throw new NodeOperationError(this.getNode(), `Unknown appointment operation: ${operation}`);
	}
}

async function executeBookingOperation(
	this: IExecuteFunctions,
	operation: string,
	index: number,
): Promise<INodeExecutionData[]> {
	switch (operation) {
		case 'listBookings':
			return bookingActions.listBookings.call(this, index);
		case 'getBooking':
			return bookingActions.getBooking.call(this, index);
		case 'createBooking':
			return bookingActions.createBooking.call(this, index);
		case 'updateBooking':
			return bookingActions.updateBooking.call(this, index);
		case 'convertToJob':
			return bookingActions.convertToJob.call(this, index);
		case 'dismissBooking':
			return bookingActions.dismissBooking.call(this, index);
		default:
			throw new NodeOperationError(this.getNode(), `Unknown booking operation: ${operation}`);
	}
}

async function executeLeadOperation(
	this: IExecuteFunctions,
	operation: string,
	index: number,
): Promise<INodeExecutionData[]> {
	switch (operation) {
		case 'listLeads':
			return leadActions.listLeads.call(this, index);
		case 'getLead':
			return leadActions.getLead.call(this, index);
		case 'createLead':
			return leadActions.createLead.call(this, index);
		case 'updateLead':
			return leadActions.updateLead.call(this, index);
		case 'convertLead':
			return leadActions.convertLead.call(this, index);
		case 'dismissLead':
			return leadActions.dismissLead.call(this, index);
		case 'addFollowUp':
			return leadActions.addFollowUp.call(this, index);
		default:
			throw new NodeOperationError(this.getNode(), `Unknown lead operation: ${operation}`);
	}
}

async function executeInvoiceOperation(
	this: IExecuteFunctions,
	operation: string,
	index: number,
): Promise<INodeExecutionData[]> {
	switch (operation) {
		case 'listInvoices':
			return invoiceActions.listInvoices.call(this, index);
		case 'getInvoice':
			return invoiceActions.getInvoice.call(this, index);
		case 'createInvoice':
			return invoiceActions.createInvoice.call(this, index);
		case 'updateInvoice':
			return invoiceActions.updateInvoice.call(this, index);
		case 'getInvoiceItems':
			return invoiceActions.getInvoiceItems.call(this, index);
		case 'addInvoiceItem':
			return invoiceActions.addInvoiceItem.call(this, index);
		case 'removeInvoiceItem':
			return invoiceActions.removeInvoiceItem.call(this, index);
		case 'emailInvoice':
			return invoiceActions.emailInvoice.call(this, index);
		case 'getInvoicePayments':
			return invoiceActions.getInvoicePayments.call(this, index);
		default:
			throw new NodeOperationError(this.getNode(), `Unknown invoice operation: ${operation}`);
	}
}

async function executePaymentOperation(
	this: IExecuteFunctions,
	operation: string,
	index: number,
): Promise<INodeExecutionData[]> {
	switch (operation) {
		case 'listPayments':
			return paymentActions.listPayments.call(this, index);
		case 'getPayment':
			return paymentActions.getPayment.call(this, index);
		case 'createPayment':
			return paymentActions.createPayment.call(this, index);
		case 'refundPayment':
			return paymentActions.refundPayment.call(this, index);
		case 'voidPayment':
			return paymentActions.voidPayment.call(this, index);
		default:
			throw new NodeOperationError(this.getNode(), `Unknown payment operation: ${operation}`);
	}
}

async function executeEstimateOperation(
	this: IExecuteFunctions,
	operation: string,
	index: number,
): Promise<INodeExecutionData[]> {
	switch (operation) {
		case 'listEstimates':
			return estimateActions.listEstimates.call(this, index);
		case 'getEstimate':
			return estimateActions.getEstimate.call(this, index);
		case 'createEstimate':
			return estimateActions.createEstimate.call(this, index);
		case 'updateEstimate':
			return estimateActions.updateEstimate.call(this, index);
		case 'approveEstimate':
			return estimateActions.approveEstimate.call(this, index);
		case 'declineEstimate':
			return estimateActions.declineEstimate.call(this, index);
		case 'convertToInvoice':
			return estimateActions.convertToInvoice.call(this, index);
		case 'emailEstimate':
			return estimateActions.emailEstimate.call(this, index);
		default:
			throw new NodeOperationError(this.getNode(), `Unknown estimate operation: ${operation}`);
	}
}

async function executeTechnicianOperation(
	this: IExecuteFunctions,
	operation: string,
	index: number,
): Promise<INodeExecutionData[]> {
	switch (operation) {
		case 'listTechnicians':
			return technicianActions.listTechnicians.call(this, index);
		case 'getTechnician':
			return technicianActions.getTechnician.call(this, index);
		case 'createTechnician':
			return technicianActions.createTechnician.call(this, index);
		case 'updateTechnician':
			return technicianActions.updateTechnician.call(this, index);
		case 'getTechnicianSchedule':
			return technicianActions.getTechnicianSchedule.call(this, index);
		case 'getTechnicianCapacity':
			return technicianActions.getTechnicianCapacity.call(this, index);
		case 'getTechnicianPerformance':
			return technicianActions.getTechnicianPerformance.call(this, index);
		default:
			throw new NodeOperationError(this.getNode(), `Unknown technician operation: ${operation}`);
	}
}

async function executeDispatchOperation(
	this: IExecuteFunctions,
	operation: string,
	index: number,
): Promise<INodeExecutionData[]> {
	switch (operation) {
		case 'getDispatchBoard':
			return dispatchActions.getDispatchBoard.call(this, index);
		case 'getZones':
			return dispatchActions.getZones.call(this, index);
		case 'getCapacity':
			return dispatchActions.getCapacity.call(this, index);
		case 'optimizeRoutes':
			return dispatchActions.optimizeRoutes.call(this, index);
		default:
			throw new NodeOperationError(this.getNode(), `Unknown dispatch operation: ${operation}`);
	}
}

async function executeInventoryOperation(
	this: IExecuteFunctions,
	operation: string,
	index: number,
): Promise<INodeExecutionData[]> {
	switch (operation) {
		case 'listInventory':
			return inventoryActions.listInventory.call(this, index);
		case 'getInventoryItem':
			return inventoryActions.getInventoryItem.call(this, index);
		case 'updateInventoryQuantity':
			return inventoryActions.updateInventoryQuantity.call(this, index);
		case 'listPurchaseOrders':
			return inventoryActions.listPurchaseOrders.call(this, index);
		case 'createPurchaseOrder':
			return inventoryActions.createPurchaseOrder.call(this, index);
		case 'listVendors':
			return inventoryActions.listVendors.call(this, index);
		case 'getWarehouseQuantities':
			return inventoryActions.getWarehouseQuantities.call(this, index);
		default:
			throw new NodeOperationError(this.getNode(), `Unknown inventory operation: ${operation}`);
	}
}

async function executePricebookOperation(
	this: IExecuteFunctions,
	operation: string,
	index: number,
): Promise<INodeExecutionData[]> {
	switch (operation) {
		case 'listServices':
			return pricebookActions.listServices.call(this, index);
		case 'getService':
			return pricebookActions.getService.call(this, index);
		case 'listMaterials':
			return pricebookActions.listMaterials.call(this, index);
		case 'getMaterial':
			return pricebookActions.getMaterial.call(this, index);
		case 'listEquipment':
			return pricebookActions.listEquipment.call(this, index);
		case 'getEquipment':
			return pricebookActions.getEquipment.call(this, index);
		default:
			throw new NodeOperationError(this.getNode(), `Unknown pricebook operation: ${operation}`);
	}
}

async function executeMembershipOperation(
	this: IExecuteFunctions,
	operation: string,
	index: number,
): Promise<INodeExecutionData[]> {
	switch (operation) {
		case 'listMemberships':
			return membershipActions.listMemberships.call(this, index);
		case 'getMembership':
			return membershipActions.getMembership.call(this, index);
		case 'createMembership':
			return membershipActions.createMembership.call(this, index);
		case 'updateMembership':
			return membershipActions.updateMembership.call(this, index);
		case 'cancelMembership':
			return membershipActions.cancelMembership.call(this, index);
		case 'getMembershipLocations':
			return membershipActions.getMembershipLocations.call(this, index);
		default:
			throw new NodeOperationError(this.getNode(), `Unknown membership operation: ${operation}`);
	}
}

async function executeCampaignOperation(
	this: IExecuteFunctions,
	operation: string,
	index: number,
): Promise<INodeExecutionData[]> {
	switch (operation) {
		case 'listCampaigns':
			return campaignActions.listCampaigns.call(this, index);
		case 'getCampaign':
			return campaignActions.getCampaign.call(this, index);
		case 'getCampaignMetrics':
			return campaignActions.getCampaignMetrics.call(this, index);
		default:
			throw new NodeOperationError(this.getNode(), `Unknown campaign operation: ${operation}`);
	}
}

async function executeReportOperation(
	this: IExecuteFunctions,
	operation: string,
	index: number,
): Promise<INodeExecutionData[]> {
	switch (operation) {
		case 'getRevenueReport':
			return reportActions.getRevenueReport.call(this, index);
		case 'getTechnicianReport':
			return reportActions.getTechnicianReport.call(this, index);
		case 'getCallReport':
			return reportActions.getCallReport.call(this, index);
		case 'getConversionReport':
			return reportActions.getConversionReport.call(this, index);
		case 'getCustomReport':
			return reportActions.getCustomReport.call(this, index);
		default:
			throw new NodeOperationError(this.getNode(), `Unknown report operation: ${operation}`);
	}
}

async function executeUserOperation(
	this: IExecuteFunctions,
	operation: string,
	index: number,
): Promise<INodeExecutionData[]> {
	switch (operation) {
		case 'listUsers':
			return userActions.listUsers.call(this, index);
		case 'getUser':
			return userActions.getUser.call(this, index);
		case 'getUserRoles':
			return userActions.getUserRoles.call(this, index);
		case 'getUserPermissions':
			return userActions.getUserPermissions.call(this, index);
		default:
			throw new NodeOperationError(this.getNode(), `Unknown user operation: ${operation}`);
	}
}
