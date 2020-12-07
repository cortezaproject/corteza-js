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

export default class Federation {
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

  setJWT (jwt?: string): Federation {
    if (this.isValidJWT(jwt)) {
      this.jwt = jwt
      this.headers.Authorization = 'Bearer ' + jwt
    } else {
      throw new Error('JWT value too short')
    }

    return this
  }

  setHeaders (headers?: Headers): Federation {
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

  // Initialize the handshake step with node B
  async nodeHandshakeInitialize (a: KV): Promise<KV> {
    const {
      nodeID,
      pairToken,
      sharedNodeID,
      authToken,
    } = (a as KV) || {}
    if (!nodeID) {
      throw Error('field nodeID is empty')
    }
    if (!pairToken) {
      throw Error('field pairToken is empty')
    }
    if (!sharedNodeID) {
      throw Error('field sharedNodeID is empty')
    }
    if (!authToken) {
      throw Error('field authToken is empty')
    }
    const cfg: AxiosRequestConfig = {
      method: 'post',
      url: this.nodeHandshakeInitializeEndpoint({
        nodeID,
      }),
    }
    cfg.data = {
      pairToken,
      sharedNodeID,
      authToken,
    }
    return this.api().request(cfg).then(result => stdResolve(result))
  }

  nodeHandshakeInitializeEndpoint (a: KV): string {
    const {
      nodeID,
    } = a || {}
    return `/nodes/${nodeID}/handshake`
  }

  // Search federated nodes
  async nodeSearch (a: KV): Promise<KV> {
    const {
      query,
      status,
    } = (a as KV) || {}
    const cfg: AxiosRequestConfig = {
      method: 'get',
      url: this.nodeSearchEndpoint(),
    }
    cfg.params = {
      query,
      status,
    }

    return this.api().request(cfg).then(result => stdResolve(result))
  }

  nodeSearchEndpoint (): string {
    return '/nodes/'
  }

  // Create a new federation node
  async nodeCreate (a: KV): Promise<KV> {
    const {
      baseURL,
      name,
      pairingURI,
    } = (a as KV) || {}
    const cfg: AxiosRequestConfig = {
      method: 'post',
      url: this.nodeCreateEndpoint(),
    }
    cfg.data = {
      baseURL,
      name,
      pairingURI,
    }
    return this.api().request(cfg).then(result => stdResolve(result))
  }

  nodeCreateEndpoint (): string {
    return '/nodes/'
  }

  // Read a federation node
  async nodeRead (a: KV): Promise<KV> {
    const {
      nodeID,
    } = (a as KV) || {}
    if (!nodeID) {
      throw Error('field nodeID is empty')
    }
    const cfg: AxiosRequestConfig = {
      method: 'get',
      url: this.nodeReadEndpoint({
        nodeID,
      }),
    }

    return this.api().request(cfg).then(result => stdResolve(result))
  }

  nodeReadEndpoint (a: KV): string {
    const {
      nodeID,
    } = a || {}
    return `/nodes/${nodeID}`
  }

  // Creates new sharable federation URI
  async nodeGenerateUri (a: KV): Promise<KV> {
    const {
      nodeID,
    } = (a as KV) || {}
    if (!nodeID) {
      throw Error('field nodeID is empty')
    }
    const cfg: AxiosRequestConfig = {
      method: 'post',
      url: this.nodeGenerateUriEndpoint({
        nodeID,
      }),
    }

    return this.api().request(cfg).then(result => stdResolve(result))
  }

  nodeGenerateUriEndpoint (a: KV): string {
    const {
      nodeID,
    } = a || {}
    return `/nodes/${nodeID}/uri`
  }

  // Updates existing node
  async nodeUpdate (a: KV): Promise<KV> {
    const {
      nodeID,
      name,
      baseURL,
    } = (a as KV) || {}
    if (!nodeID) {
      throw Error('field nodeID is empty')
    }
    const cfg: AxiosRequestConfig = {
      method: 'post',
      url: this.nodeUpdateEndpoint({
        nodeID,
      }),
    }
    cfg.data = {
      name,
      baseURL,
    }
    return this.api().request(cfg).then(result => stdResolve(result))
  }

  nodeUpdateEndpoint (a: KV): string {
    const {
      nodeID,
    } = a || {}
    return `/nodes/${nodeID}`
  }

  // Deletes node
  async nodeDelete (a: KV): Promise<KV> {
    const {
      nodeID,
    } = (a as KV) || {}
    if (!nodeID) {
      throw Error('field nodeID is empty')
    }
    const cfg: AxiosRequestConfig = {
      method: 'delete',
      url: this.nodeDeleteEndpoint({
        nodeID,
      }),
    }

    return this.api().request(cfg).then(result => stdResolve(result))
  }

  nodeDeleteEndpoint (a: KV): string {
    const {
      nodeID,
    } = a || {}
    return `/nodes/${nodeID}`
  }

  // Undeletes a node
  async nodeUndelete (a: KV): Promise<KV> {
    const {
      nodeID,
    } = (a as KV) || {}
    if (!nodeID) {
      throw Error('field nodeID is empty')
    }
    const cfg: AxiosRequestConfig = {
      method: 'post',
      url: this.nodeUndeleteEndpoint({
        nodeID,
      }),
    }

    return this.api().request(cfg).then(result => stdResolve(result))
  }

  nodeUndeleteEndpoint (a: KV): string {
    const {
      nodeID,
    } = a || {}
    return `/nodes/${nodeID}/undelete`
  }

  // Initialize the pairing process between the two nodes
  async nodePair (a: KV): Promise<KV> {
    const {
      nodeID,
    } = (a as KV) || {}
    if (!nodeID) {
      throw Error('field nodeID is empty')
    }
    const cfg: AxiosRequestConfig = {
      method: 'post',
      url: this.nodePairEndpoint({
        nodeID,
      }),
    }

    return this.api().request(cfg).then(result => stdResolve(result))
  }

  nodePairEndpoint (a: KV): string {
    const {
      nodeID,
    } = a || {}
    return `/nodes/${nodeID}/pair`
  }

  // Confirm the requested handshake
  async nodeHandshakeConfirm (a: KV): Promise<KV> {
    const {
      nodeID,
    } = (a as KV) || {}
    if (!nodeID) {
      throw Error('field nodeID is empty')
    }
    const cfg: AxiosRequestConfig = {
      method: 'post',
      url: this.nodeHandshakeConfirmEndpoint({
        nodeID,
      }),
    }

    return this.api().request(cfg).then(result => stdResolve(result))
  }

  nodeHandshakeConfirmEndpoint (a: KV): string {
    const {
      nodeID,
    } = a || {}
    return `/nodes/${nodeID}/handshake-confirm`
  }

  // Complete the handshake
  async nodeHandshakeComplete (a: KV): Promise<KV> {
    const {
      nodeID,
      authToken,
    } = (a as KV) || {}
    if (!nodeID) {
      throw Error('field nodeID is empty')
    }
    if (!authToken) {
      throw Error('field authToken is empty')
    }
    const cfg: AxiosRequestConfig = {
      method: 'post',
      url: this.nodeHandshakeCompleteEndpoint({
        nodeID,
      }),
    }
    cfg.data = {
      authToken,
    }
    return this.api().request(cfg).then(result => stdResolve(result))
  }

  nodeHandshakeCompleteEndpoint (a: KV): string {
    const {
      nodeID,
    } = a || {}
    return `/nodes/${nodeID}/handshake-complete`
  }

  // Exposed settings for module
  async manageStructureReadExposed (a: KV): Promise<KV> {
    const {
      nodeID,
      moduleID,
    } = (a as KV) || {}
    if (!nodeID) {
      throw Error('field nodeID is empty')
    }
    if (!moduleID) {
      throw Error('field moduleID is empty')
    }
    const cfg: AxiosRequestConfig = {
      method: 'get',
      url: this.manageStructureReadExposedEndpoint({
        nodeID, moduleID,
      }),
    }

    return this.api().request(cfg).then(result => stdResolve(result))
  }

  manageStructureReadExposedEndpoint (a: KV): string {
    const {
      nodeID,
      moduleID,
    } = a || {}
    return `/nodes/${nodeID}/modules/${moduleID}/exposed`
  }

  // Add module to federation
  async manageStructureCreateExposed (a: KV): Promise<KV> {
    const {
      nodeID,
      composeModuleID,
      composeNamespaceID,
      name,
      handle,
      fields,
    } = (a as KV) || {}
    if (!nodeID) {
      throw Error('field nodeID is empty')
    }
    if (!composeModuleID) {
      throw Error('field composeModuleID is empty')
    }
    if (!composeNamespaceID) {
      throw Error('field composeNamespaceID is empty')
    }
    if (!name) {
      throw Error('field name is empty')
    }
    if (!handle) {
      throw Error('field handle is empty')
    }
    const cfg: AxiosRequestConfig = {
      method: 'put',
      url: this.manageStructureCreateExposedEndpoint({
        nodeID,
      }),
    }
    cfg.data = {
      composeModuleID,
      composeNamespaceID,
      name,
      handle,
      fields,
    }
    return this.api().request(cfg).then(result => stdResolve(result))
  }

  manageStructureCreateExposedEndpoint (a: KV): string {
    const {
      nodeID,
    } = a || {}
    return `/nodes/${nodeID}/modules/`
  }

  // Update already exposed module
  async manageStructureUpdateExposed (a: KV): Promise<KV> {
    const {
      nodeID,
      moduleID,
      composeModuleID,
      composeNamespaceID,
      name,
      handle,
      fields,
    } = (a as KV) || {}
    if (!nodeID) {
      throw Error('field nodeID is empty')
    }
    if (!moduleID) {
      throw Error('field moduleID is empty')
    }
    if (!composeModuleID) {
      throw Error('field composeModuleID is empty')
    }
    if (!composeNamespaceID) {
      throw Error('field composeNamespaceID is empty')
    }
    if (!name) {
      throw Error('field name is empty')
    }
    if (!handle) {
      throw Error('field handle is empty')
    }
    const cfg: AxiosRequestConfig = {
      method: 'post',
      url: this.manageStructureUpdateExposedEndpoint({
        nodeID, moduleID,
      }),
    }
    cfg.data = {
      composeModuleID,
      composeNamespaceID,
      name,
      handle,
      fields,
    }
    return this.api().request(cfg).then(result => stdResolve(result))
  }

  manageStructureUpdateExposedEndpoint (a: KV): string {
    const {
      nodeID,
      moduleID,
    } = a || {}
    return `/nodes/${nodeID}/modules/${moduleID}/exposed`
  }

  // Remove from federation
  async manageStructureRemoveExposed (a: KV): Promise<KV> {
    const {
      nodeID,
      moduleID,
    } = (a as KV) || {}
    if (!nodeID) {
      throw Error('field nodeID is empty')
    }
    if (!moduleID) {
      throw Error('field moduleID is empty')
    }
    const cfg: AxiosRequestConfig = {
      method: 'delete',
      url: this.manageStructureRemoveExposedEndpoint({
        nodeID, moduleID,
      }),
    }

    return this.api().request(cfg).then(result => stdResolve(result))
  }

  manageStructureRemoveExposedEndpoint (a: KV): string {
    const {
      nodeID,
      moduleID,
    } = a || {}
    return `/nodes/${nodeID}/modules/${moduleID}/exposed`
  }

  // Shared settings for module
  async manageStructureReadShared (a: KV): Promise<KV> {
    const {
      nodeID,
      moduleID,
    } = (a as KV) || {}
    if (!nodeID) {
      throw Error('field nodeID is empty')
    }
    if (!moduleID) {
      throw Error('field moduleID is empty')
    }
    const cfg: AxiosRequestConfig = {
      method: 'get',
      url: this.manageStructureReadSharedEndpoint({
        nodeID, moduleID,
      }),
    }

    return this.api().request(cfg).then(result => stdResolve(result))
  }

  manageStructureReadSharedEndpoint (a: KV): string {
    const {
      nodeID,
      moduleID,
    } = a || {}
    return `/nodes/${nodeID}/modules/${moduleID}/shared`
  }

  // Add fields mappings to federated module
  async manageStructureCreateMappings (a: KV): Promise<KV> {
    const {
      nodeID,
      moduleID,
      composeModuleID,
      composeNamespaceID,
      fields,
    } = (a as KV) || {}
    if (!nodeID) {
      throw Error('field nodeID is empty')
    }
    if (!moduleID) {
      throw Error('field moduleID is empty')
    }
    if (!composeModuleID) {
      throw Error('field composeModuleID is empty')
    }
    if (!composeNamespaceID) {
      throw Error('field composeNamespaceID is empty')
    }
    const cfg: AxiosRequestConfig = {
      method: 'put',
      url: this.manageStructureCreateMappingsEndpoint({
        nodeID, moduleID,
      }),
    }
    cfg.data = {
      composeModuleID,
      composeNamespaceID,
      fields,
    }
    return this.api().request(cfg).then(result => stdResolve(result))
  }

  manageStructureCreateMappingsEndpoint (a: KV): string {
    const {
      nodeID,
      moduleID,
    } = a || {}
    return `/nodes/${nodeID}/modules/${moduleID}/mapped`
  }

  // Fields mappings for module
  async manageStructureReadMappings (a: KV): Promise<KV> {
    const {
      nodeID,
      moduleID,
    } = (a as KV) || {}
    if (!nodeID) {
      throw Error('field nodeID is empty')
    }
    if (!moduleID) {
      throw Error('field moduleID is empty')
    }
    const cfg: AxiosRequestConfig = {
      method: 'get',
      url: this.manageStructureReadMappingsEndpoint({
        nodeID, moduleID,
      }),
    }

    return this.api().request(cfg).then(result => stdResolve(result))
  }

  manageStructureReadMappingsEndpoint (a: KV): string {
    const {
      nodeID,
      moduleID,
    } = a || {}
    return `/nodes/${nodeID}/modules/${moduleID}/mapped`
  }

  // List of shared/exposed modules
  async manageStructureListAll (a: KV): Promise<KV> {
    const {
      nodeID,
      shared,
      exposed,
    } = (a as KV) || {}
    if (!nodeID) {
      throw Error('field nodeID is empty')
    }
    const cfg: AxiosRequestConfig = {
      method: 'get',
      url: this.manageStructureListAllEndpoint({
        nodeID,
      }),
    }
    cfg.params = {
      shared,
      exposed,
    }

    return this.api().request(cfg).then(result => stdResolve(result))
  }

  manageStructureListAllEndpoint (a: KV): string {
    const {
      nodeID,
    } = a || {}
    return `/nodes/${nodeID}/modules/`
  }

  // List all exposed modules changes
  async syncStructureReadExposedAll (a: KV): Promise<KV> {
    const {
      nodeID,
      lastSync,
      query,
      limit,
      pageCursor,
      sort,
    } = (a as KV) || {}
    if (!nodeID) {
      throw Error('field nodeID is empty')
    }
    const cfg: AxiosRequestConfig = {
      method: 'get',
      url: this.syncStructureReadExposedAllEndpoint({
        nodeID,
      }),
    }
    cfg.params = {
      lastSync,
      query,
      limit,
      pageCursor,
      sort,
    }

    return this.api().request(cfg).then(result => stdResolve(result))
  }

  syncStructureReadExposedAllEndpoint (a: KV): string {
    const {
      nodeID,
    } = a || {}
    return `/nodes/${nodeID}/modules/exposed/`
  }

  // List all record changes
  async syncDataReadExposedAll (a: KV): Promise<KV> {
    const {
      nodeID,
      lastSync,
      query,
      limit,
      pageCursor,
      sort,
    } = (a as KV) || {}
    if (!nodeID) {
      throw Error('field nodeID is empty')
    }
    const cfg: AxiosRequestConfig = {
      method: 'get',
      url: this.syncDataReadExposedAllEndpoint({
        nodeID,
      }),
    }
    cfg.params = {
      lastSync,
      query,
      limit,
      pageCursor,
      sort,
    }

    return this.api().request(cfg).then(result => stdResolve(result))
  }

  syncDataReadExposedAllEndpoint (a: KV): string {
    const {
      nodeID,
    } = a || {}
    return `/nodes/${nodeID}/modules/exposed/records/`
  }

  // List all records per module
  async syncDataReadExposed (a: KV): Promise<KV> {
    const {
      nodeID,
      moduleID,
      lastSync,
      query,
      limit,
      pageCursor,
      sort,
    } = (a as KV) || {}
    if (!nodeID) {
      throw Error('field nodeID is empty')
    }
    if (!moduleID) {
      throw Error('field moduleID is empty')
    }
    const cfg: AxiosRequestConfig = {
      method: 'get',
      url: this.syncDataReadExposedEndpoint({
        nodeID, moduleID,
      }),
    }
    cfg.params = {
      lastSync,
      query,
      limit,
      pageCursor,
      sort,
    }

    return this.api().request(cfg).then(result => stdResolve(result))
  }

  syncDataReadExposedEndpoint (a: KV): string {
    const {
      nodeID,
      moduleID,
    } = a || {}
    return `/nodes/${nodeID}/modules/${moduleID}/records/`
  }

}
