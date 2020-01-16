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

const tpl = handlebars.compile(`import axios from 'axios'

/* eslint-disable */

// This is a generated file.
// See README.md file for update instructions

export default class {{className}} {
  constructor ({ baseURL, headers, jwt } = {}) {
    this.jwt = null
    this.baseURL = baseURL

    this.headers = {
      'Content-Type': 'application/json',
    }

    this.setHeaders(headers)

    if (this.isValidJWT(jwt)) {
      this.setJWT(jwt)
    }
  }

  setJWT(jwt) {
    if (this.isValidJWT(jwt)) {
      this.jwt = jwt
      this.headers['Authorization'] = 'Bearer ' + jwt
    } else {
      throw new Error('JWT value too short', { jwt })
    }

    return this
  }

  setHeaders (headers) {
    if (typeof headers === 'object') {
      this.headers = headers
    }

    return this
  }

  isValidJWT (jwt) {
    return jwt && jwt.length > 100
  }

  stdReject (reject) {
    return (error) => {
      reject(error)
    }
  }

  stdResolve (resolve, reject) {
    return (response) => {
      if (response.data.error) {
        reject(response.data.error)
      } else {
        resolve(response.data.response)
      }
    }
  }

  api () {
    return axios.create({
      withCredentials: true,
      baseURL: this.baseURL,
      headers: this.headers,
    })
  }

{{#endpoints}}
  // {{title}}{{#description}}
  // {{description}}{{/description}}
  async {{fname}} () {
    {{#if fargs}}const { {{#fargs}}{{.}},{{/fargs}} } = arguments[0] || {}{{/if}}
    {{#required}}
    if (!{{.}}) {
      console.error('{{../fname}} failed, field {{.}} is empty', arguments) // log error so we can debug/trace it
      throw Error('field {{.}} is empty')
    }{{/required}}
    
    let cfg = {
      method: '{{method}}',
      url: this.{{fname}}Endpoint({ {{#pathParams}}{{.}}, {{/pathParams}} }),
    }
    {{#hasParams}}cfg.params = { {{#params}}{{.}}, {{/params}} }{{/hasParams}}
    {{#hasData}}cfg.data = { {{#data}}{{.}}, {{/data}} }{{/hasData}}
    return new Promise((resolve, reject) => {
      this.api().request(cfg).then(this.stdResolve(resolve, reject), this.stdReject(reject))
    })
  }
  
  {{fname}}Endpoint ({{#if pathParams}}{ {{#pathParams}}{{.}},{{/pathParams}} } = {}{{/if}}) {
    return \`{{path}}\`
  }

{{/endpoints}}
}
`)

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
    gen = esformatter.format(gen, esFormatterOptions)
    gen = gen.replace(/[^\S\n]+$/gm, '')

    fs.writeFileSync(`${dst}/${namespace}.js`, gen)
  } catch (err) {
    console.error(err)
  }
})
