/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
	IAuthenticateGeneric,
	ICredentialDataDecryptedObject,
	ICredentialTestRequest,
	ICredentialType,
	IHttpRequestHelper,
	INodeProperties,
} from 'n8n-workflow';

export class ServiceTitanApi implements ICredentialType {
	name = 'serviceTitanApi';
	displayName = 'ServiceTitan API';
	documentationUrl = 'https://developer.servicetitan.io/docs/';
	
	properties: INodeProperties[] = [
		{
			displayName: 'Environment',
			name: 'environment',
			type: 'options',
			options: [
				{
					name: 'Production',
					value: 'production',
				},
				{
					name: 'Sandbox',
					value: 'sandbox',
				},
			],
			default: 'production',
			description: 'The ServiceTitan environment to connect to',
		},
		{
			displayName: 'Client ID',
			name: 'clientId',
			type: 'string',
			default: '',
			required: true,
			description: 'The Client ID from your ServiceTitan application',
		},
		{
			displayName: 'Client Secret',
			name: 'clientSecret',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
			description: 'The Client Secret from your ServiceTitan application',
		},
		{
			displayName: 'Tenant ID',
			name: 'tenantId',
			type: 'string',
			default: '',
			required: true,
			description: 'Your ServiceTitan Tenant ID (company identifier)',
		},
		{
			displayName: 'API Host',
			name: 'apiHost',
			type: 'string',
			default: 'api.servicetitan.io',
			required: true,
			description: 'The API hostname provided by ServiceTitan',
		},
		{
			displayName: 'Auth Host',
			name: 'authHost',
			type: 'string',
			default: 'auth.servicetitan.io',
			required: true,
			description: 'The authentication hostname (usually auth.servicetitan.io)',
		},
	];

	async preAuthentication(
		this: IHttpRequestHelper,
		credentials: ICredentialDataDecryptedObject,
	): Promise<ICredentialDataDecryptedObject> {
		const authHost = credentials.authHost as string || 'auth.servicetitan.io';
		const tokenUrl = `https://${authHost}/connect/token`;
		
		const response = await this.helpers.httpRequest({
			method: 'POST',
			url: tokenUrl,
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: new URLSearchParams({
				grant_type: 'client_credentials',
				client_id: credentials.clientId as string,
				client_secret: credentials.clientSecret as string,
			}).toString(),
			json: true,
		});

		return {
			...credentials,
			accessToken: response.access_token,
			tokenExpiry: Date.now() + (response.expires_in * 1000),
		};
	}

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.accessToken}}',
				'ST-App-Key': '={{$credentials.clientId}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '=https://{{$credentials.apiHost}}',
			url: '=/settings/v2/tenant/{{$credentials.tenantId}}/employees',
			qs: {
				page: 1,
				pageSize: 1,
			},
		},
	};
}
