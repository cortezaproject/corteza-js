export const template = `
/* eslint-disable padded-blocks */

// This is a generated file.
// See README.md file for update instructions

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'

interface KV { 
  [header: string]: unknown; 
}

interface Headers { 
  [header: string]: string; 
}

interface Ctor {
  baseURL?: string;
  jwt?: string;
  headers?: Headers;
}

interface CortezaResponse {
  error?: string;
  response?: unknown;
}

function stdResolve (response: AxiosResponse<CortezaResponse>): KV|Promise<never> {
  if (response.data.error) {
    return Promise.reject(response.data.error)
  } else {
    return response.data.response as KV
  }
}

export default class {{className}} {
  protected baseURL?: string
  protected jwt?: string
  protected headers: Headers = {}

  constructor ({ baseURL, headers, jwt }: Ctor) {
    this.baseURL = baseURL

    this.headers = {
      'Content-Type': 'application/json',
    }

    this.setHeaders(headers)

    if (this.isValidJWT(jwt)) {
      this.setJWT(jwt)
    }
  }

  setJWT (jwt?: string): {{className}} {
    if (this.isValidJWT(jwt)) {
      this.jwt = jwt
      this.headers.Authorization = 'Bearer ' + jwt
    } else {
      throw new Error('JWT value too short')
    }

    return this
  }

  setHeaders (headers?: Headers): {{className}} {
    if (typeof headers === 'object') {
      this.headers = headers
    }

    return this
  }

  isValidJWT (jwt?: string): boolean {
    return !!jwt && jwt.length > 100
  }

  api (): AxiosInstance {
    return axios.create({
      withCredentials: true,
      baseURL: this.baseURL,
      headers: this.headers,
    })
  }

{{#endpoints}}
  // {{title}}{{#description}}
  // {{description}}{{/description}}
  async {{fname}} ({{#if fargs}}a: KV{{/if}}): Promise<KV> {
    {{#if fargs}}const { 
      {{#fargs}}
      {{.}},
      {{/fargs}} 
    } = (a as KV) || {}{{/if}}
    {{#required}}
    if (!{{.}}) {
      throw Error('field {{.}} is empty')
    }
    {{/required}}
    const cfg: AxiosRequestConfig = {
      method: '{{method}}',
      url: this.{{fname}}Endpoint({{#if pathParams}}{ 
        {{#pathParams}}{{.}}, {{/pathParams}} 
      }{{/if}}),
    }
    {{#hasParams}}cfg.params = { 
      {{#params}}
      {{.}}, 
      {{/params}} 
    }
    {{/hasParams}}{{#hasData}}cfg.data = { 
      {{#data}}
      {{.}},
      {{/data}} 
    }{{/hasData}}
    return this.api().request(cfg).then(result => stdResolve(result))
  }
  
  {{fname}}Endpoint ({{#if pathParams}}a: KV{{/if}}): string {
  {{#if pathParams}}
    const { 
      {{#pathParams}}
      {{.}},
      {{/pathParams}} 
    } = a || {}
    return \`{{path}}\`
  {{else}}
    return '{{path}}'
  {{/if}}
  }

{{/endpoints}}
}
`
