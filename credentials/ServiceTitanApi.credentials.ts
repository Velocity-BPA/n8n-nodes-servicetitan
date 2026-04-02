import {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class ServiceTitanApi implements ICredentialType {
	name = 'serviceTitanApi';
	displayName = 'ServiceTitan API';
	documentationUrl = 'https://developer.servicetitan.io/';
	properties: INodeProperties[] = [
		{
			displayName: 'API Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://api.servicetitan.io',
			required: true,
		},
		{
			displayName: 'Tenant ID',
			name: 'tenantId',
			type: 'string',
			default: '',
			required: true,
			description: 'Your ServiceTitan tenant identifier',
		},
		{
			displayName: 'Client ID',
			name: 'clientId',
			type: 'string',
			default: '',
			required: true,
		},
		{
			displayName: 'Client Secret',
			name: 'clientSecret',
			type: 'password',
			default: '',
			required: true,
		},
		{
			displayName: 'App Key',
			name: 'appKey',
			type: 'password',
			default: '',
			required: true,
			description: 'Application key from ServiceTitan Developer Portal',
		},
	];
}