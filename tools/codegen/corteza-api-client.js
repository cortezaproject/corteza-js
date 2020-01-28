import { camelCase } from 'lodash'
import fs from 'fs'
import handlebars from 'handlebars'
import esformatter from 'esformatter'
import esFormatterOptions from 'esformatter/lib/preset/default'

let path
if (process.argv.length >= 3) {
  path = process.argv[2]
} else {
  // Assume "standard" dev environment
  // where corteza server source could be found
  // next to this lib
  path = '../corteza-server'
}

const dst = `${__dirname}/../../src/api-clients`

const namespaces = [
  {
    path: `${path}/api/system/spec.json`,
    namespace: 'system',
    className: 'System',
  },
  {
    path: `${path}/api/compose/spec.json`,
    namespace: 'compose',
    className: 'Compose',
  },
  {
    path: `${path}/api/messaging/spec.json`,
    namespace: 'messaging',
    className: 'Messaging',
  },
]

const tpl = handlebars.compile(`
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
      console.error('{{../fname}} failed, field {{.}} is empty', a)
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
`.trimStart())

esFormatterOptions.plugins = ['esformatter-add-trailing-commas']
esFormatterOptions.whiteSpace.after = {
  MethodDefinitionName: 1,
  MethodDefinitionOpeningBrace: 0,
  MethodDefinition: 0,
}

namespaces.forEach(({ path, namespace, className }) => {
  console.log(`Generating '${className}' from specs file '${path}'`)

  let spec

  try {
    spec = JSON.parse(fs.readFileSync(path))
  } catch (err) {
    switch (err.code) {
      case 'ENOENT':
        console.error('Could not find specs file')
        return
    }

    throw err
  }

  const endpoints = [].concat.apply([], spec.map(e => {
    const { get = [], post = [], path = [] } = e.parameters || {}
    const parentGet = get
    const parentPost = post
    const parentPath = path

    return e.apis.map(a => {
      let { get = [], post = [], path = [] } = a.parameters || {}

      path = [...parentPath, ...path]
      get = [...parentGet, ...get]
      post = [...parentPost, ...post]

      const allvars = [...path, ...get, ...post]

      return {
        title: a.title,
        description: a.description,

        fname: camelCase(e.entrypoint + ' ' + a.name),
        fargs: allvars.map(v => v.name),

        pathParams: path.map(v => v.name),

        required: allvars.filter(v => v.required).map(v => v.name),

        method: a.method.toLowerCase(),
        path: (e.path + a.path).replace(/\{/g, '${'),

        hasParams: get.length > 0,
        params: get ? get.map(p => p.name) : [],

        hasData: post.length > 0,
        data: post ? post.map(p => p.name) : [],
      }
    })
  }))

  try {
    let gen = tpl({ endpoints, className, namespace })
    // gen = esformatter.format(gen, esFormatterOptions)
    gen = gen.replace(/[^\S\n]+$/gm, '')

    fs.writeFileSync(`${dst}/${namespace}.ts`, gen)
  } catch (err) {
    console.error(err)
  }
})
