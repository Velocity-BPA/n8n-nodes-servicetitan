/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodePropertyOptions } from 'n8n-workflow';

export const LICENSING_NOTICE = `[Velocity BPA Licensing Notice]

This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).

Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.

For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.`;

export const RESOURCES: INodePropertyOptions[] = [
	{ name: 'Appointment', value: 'appointment' },
	{ name: 'Booking', value: 'booking' },
	{ name: 'Campaign', value: 'campaign' },
	{ name: 'Customer', value: 'customer' },
	{ name: 'Dispatch', value: 'dispatch' },
	{ name: 'Estimate', value: 'estimate' },
	{ name: 'Inventory', value: 'inventory' },
	{ name: 'Invoice', value: 'invoice' },
	{ name: 'Job', value: 'job' },
	{ name: 'Lead', value: 'lead' },
	{ name: 'Location', value: 'location' },
	{ name: 'Membership', value: 'membership' },
	{ name: 'Payment', value: 'payment' },
	{ name: 'Pricebook', value: 'pricebook' },
	{ name: 'Report', value: 'report' },
	{ name: 'Technician', value: 'technician' },
	{ name: 'User', value: 'user' },
];

export const CUSTOMER_OPERATIONS: INodePropertyOptions[] = [
	{ name: 'Add Contact', value: 'addCustomerContact' },
	{ name: 'Add Note', value: 'addCustomerNote' },
	{ name: 'Create', value: 'createCustomer' },
	{ name: 'Get', value: 'getCustomer' },
	{ name: 'Get Contacts', value: 'getCustomerContacts' },
	{ name: 'Get Equipment', value: 'getCustomerEquipment' },
	{ name: 'Get Locations', value: 'getCustomerLocations' },
	{ name: 'Get Notes', value: 'getCustomerNotes' },
	{ name: 'List', value: 'listCustomers' },
	{ name: 'Update', value: 'updateCustomer' },
];

export const LOCATION_OPERATIONS: INodePropertyOptions[] = [
	{ name: 'Create', value: 'createLocation' },
	{ name: 'Get', value: 'getLocation' },
	{ name: 'Get Equipment', value: 'getLocationEquipment' },
	{ name: 'Get History', value: 'getLocationHistory' },
	{ name: 'List', value: 'listLocations' },
	{ name: 'Update', value: 'updateLocation' },
];

export const JOB_OPERATIONS: INodePropertyOptions[] = [
	{ name: 'Add Note', value: 'addJobNote' },
	{ name: 'Cancel', value: 'cancelJob' },
	{ name: 'Complete', value: 'completeJob' },
	{ name: 'Create', value: 'createJob' },
	{ name: 'Get', value: 'getJob' },
	{ name: 'Get Appointments', value: 'getJobAppointments' },
	{ name: 'Get History', value: 'getJobHistory' },
	{ name: 'Get Invoices', value: 'getJobInvoices' },
	{ name: 'Get Notes', value: 'getJobNotes' },
	{ name: 'List', value: 'listJobs' },
	{ name: 'Update', value: 'updateJob' },
];

export const APPOINTMENT_OPERATIONS: INodePropertyOptions[] = [
	{ name: 'Assign Technician', value: 'assignTechnician' },
	{ name: 'Cancel', value: 'cancelAppointment' },
	{ name: 'Complete', value: 'completeAppointment' },
	{ name: 'Create', value: 'createAppointment' },
	{ name: 'Get', value: 'getAppointment' },
	{ name: 'List', value: 'listAppointments' },
	{ name: 'Reschedule', value: 'rescheduleAppointment' },
	{ name: 'Unassign Technician', value: 'unassignTechnician' },
	{ name: 'Update', value: 'updateAppointment' },
];

export const BOOKING_OPERATIONS: INodePropertyOptions[] = [
	{ name: 'Convert to Job', value: 'convertToJob' },
	{ name: 'Create', value: 'createBooking' },
	{ name: 'Dismiss', value: 'dismissBooking' },
	{ name: 'Get', value: 'getBooking' },
	{ name: 'List', value: 'listBookings' },
	{ name: 'Update', value: 'updateBooking' },
];

export const LEAD_OPERATIONS: INodePropertyOptions[] = [
	{ name: 'Add Follow-Up', value: 'addFollowUp' },
	{ name: 'Convert', value: 'convertLead' },
	{ name: 'Create', value: 'createLead' },
	{ name: 'Dismiss', value: 'dismissLead' },
	{ name: 'Get', value: 'getLead' },
	{ name: 'List', value: 'listLeads' },
	{ name: 'Update', value: 'updateLead' },
];

export const INVOICE_OPERATIONS: INodePropertyOptions[] = [
	{ name: 'Add Item', value: 'addInvoiceItem' },
	{ name: 'Create', value: 'createInvoice' },
	{ name: 'Email', value: 'emailInvoice' },
	{ name: 'Get', value: 'getInvoice' },
	{ name: 'Get Items', value: 'getInvoiceItems' },
	{ name: 'Get Payments', value: 'getInvoicePayments' },
	{ name: 'List', value: 'listInvoices' },
	{ name: 'Remove Item', value: 'removeInvoiceItem' },
	{ name: 'Update', value: 'updateInvoice' },
];

export const PAYMENT_OPERATIONS: INodePropertyOptions[] = [
	{ name: 'Create', value: 'createPayment' },
	{ name: 'Get', value: 'getPayment' },
	{ name: 'List', value: 'listPayments' },
	{ name: 'Refund', value: 'refundPayment' },
	{ name: 'Void', value: 'voidPayment' },
];

export const ESTIMATE_OPERATIONS: INodePropertyOptions[] = [
	{ name: 'Approve', value: 'approveEstimate' },
	{ name: 'Convert to Invoice', value: 'convertToInvoice' },
	{ name: 'Create', value: 'createEstimate' },
	{ name: 'Decline', value: 'declineEstimate' },
	{ name: 'Email', value: 'emailEstimate' },
	{ name: 'Get', value: 'getEstimate' },
	{ name: 'List', value: 'listEstimates' },
	{ name: 'Update', value: 'updateEstimate' },
];

export const TECHNICIAN_OPERATIONS: INodePropertyOptions[] = [
	{ name: 'Create', value: 'createTechnician' },
	{ name: 'Get', value: 'getTechnician' },
	{ name: 'Get Capacity', value: 'getTechnicianCapacity' },
	{ name: 'Get Performance', value: 'getTechnicianPerformance' },
	{ name: 'Get Schedule', value: 'getTechnicianSchedule' },
	{ name: 'List', value: 'listTechnicians' },
	{ name: 'Update', value: 'updateTechnician' },
];

export const DISPATCH_OPERATIONS: INodePropertyOptions[] = [
	{ name: 'Get Capacity', value: 'getCapacity' },
	{ name: 'Get Dispatch Board', value: 'getDispatchBoard' },
	{ name: 'Get Zones', value: 'getZones' },
	{ name: 'Optimize Routes', value: 'optimizeRoutes' },
];

export const INVENTORY_OPERATIONS: INodePropertyOptions[] = [
	{ name: 'Create Purchase Order', value: 'createPurchaseOrder' },
	{ name: 'Get Item', value: 'getInventoryItem' },
	{ name: 'Get Warehouse Quantities', value: 'getWarehouseQuantities' },
	{ name: 'List', value: 'listInventory' },
	{ name: 'List Purchase Orders', value: 'listPurchaseOrders' },
	{ name: 'List Vendors', value: 'listVendors' },
	{ name: 'Update Quantity', value: 'updateInventoryQuantity' },
];

export const PRICEBOOK_OPERATIONS: INodePropertyOptions[] = [
	{ name: 'Get Equipment', value: 'getEquipment' },
	{ name: 'Get Material', value: 'getMaterial' },
	{ name: 'Get Service', value: 'getService' },
	{ name: 'List Equipment', value: 'listEquipment' },
	{ name: 'List Materials', value: 'listMaterials' },
	{ name: 'List Services', value: 'listServices' },
];

export const MEMBERSHIP_OPERATIONS: INodePropertyOptions[] = [
	{ name: 'Cancel', value: 'cancelMembership' },
	{ name: 'Create', value: 'createMembership' },
	{ name: 'Get', value: 'getMembership' },
	{ name: 'Get Locations', value: 'getMembershipLocations' },
	{ name: 'List', value: 'listMemberships' },
	{ name: 'Update', value: 'updateMembership' },
];

export const CAMPAIGN_OPERATIONS: INodePropertyOptions[] = [
	{ name: 'Get', value: 'getCampaign' },
	{ name: 'Get Metrics', value: 'getCampaignMetrics' },
	{ name: 'List', value: 'listCampaigns' },
];

export const REPORT_OPERATIONS: INodePropertyOptions[] = [
	{ name: 'Get Call Report', value: 'getCallReport' },
	{ name: 'Get Conversion Report', value: 'getConversionReport' },
	{ name: 'Get Custom Report', value: 'getCustomReport' },
	{ name: 'Get Revenue Report', value: 'getRevenueReport' },
	{ name: 'Get Technician Report', value: 'getTechnicianReport' },
];

export const USER_OPERATIONS: INodePropertyOptions[] = [
	{ name: 'Get', value: 'getUser' },
	{ name: 'Get Permissions', value: 'getUserPermissions' },
	{ name: 'Get Roles', value: 'getUserRoles' },
	{ name: 'List', value: 'listUsers' },
];

export const TRIGGER_EVENTS: INodePropertyOptions[] = [
	{ name: 'Appointment Completed', value: 'appointmentCompleted' },
	{ name: 'Appointment Scheduled', value: 'appointmentScheduled' },
	{ name: 'Customer Created', value: 'customerCreated' },
	{ name: 'Estimate Approved', value: 'estimateApproved' },
	{ name: 'Invoice Created', value: 'invoiceCreated' },
	{ name: 'Job Completed', value: 'jobCompleted' },
	{ name: 'Job Created', value: 'jobCreated' },
	{ name: 'Lead Created', value: 'leadCreated' },
	{ name: 'Membership Created', value: 'membershipCreated' },
	{ name: 'Payment Received', value: 'paymentReceived' },
];

export const API_VERSION = 'v2';

export const API_PATHS = {
	// CRM endpoints
	customers: 'crm/v2/tenant/{tenant}/customers',
	locations: 'crm/v2/tenant/{tenant}/locations',
	contacts: 'crm/v2/tenant/{tenant}/contacts',
	
	// Job Management endpoints
	jobs: 'jpm/v2/tenant/{tenant}/jobs',
	appointments: 'jpm/v2/tenant/{tenant}/appointments',
	bookings: 'crm/v2/tenant/{tenant}/booking-provider/bookings',
	leads: 'crm/v2/tenant/{tenant}/leads',
	
	// Accounting endpoints
	invoices: 'accounting/v2/tenant/{tenant}/invoices',
	payments: 'accounting/v2/tenant/{tenant}/payments',
	estimates: 'sales/v2/tenant/{tenant}/estimates',
	
	// Settings endpoints
	technicians: 'settings/v2/tenant/{tenant}/technicians',
	employees: 'settings/v2/tenant/{tenant}/employees',
	users: 'settings/v2/tenant/{tenant}/users',
	
	// Dispatch endpoints
	dispatch: 'dispatch/v2/tenant/{tenant}',
	zones: 'dispatch/v2/tenant/{tenant}/zones',
	
	// Inventory endpoints
	inventory: 'inventory/v2/tenant/{tenant}/adjustments',
	purchaseOrders: 'inventory/v2/tenant/{tenant}/purchase-orders',
	vendors: 'inventory/v2/tenant/{tenant}/vendors',
	warehouses: 'inventory/v2/tenant/{tenant}/warehouses',
	
	// Pricebook endpoints
	services: 'pricebook/v2/tenant/{tenant}/services',
	materials: 'pricebook/v2/tenant/{tenant}/materials',
	equipment: 'pricebook/v2/tenant/{tenant}/equipment',
	
	// Memberships endpoints
	memberships: 'memberships/v2/tenant/{tenant}/memberships',
	membershipTypes: 'memberships/v2/tenant/{tenant}/membership-types',
	
	// Marketing endpoints
	campaigns: 'marketing/v2/tenant/{tenant}/campaigns',
	
	// Reporting endpoints
	reports: 'reporting/v2/tenant/{tenant}/reports',
};
