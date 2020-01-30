interface KVV {
  [key: string]: string[];
}

export class SinkRequest {
  method = ''
  path = ''
  host = ''
  header: KVV = {}
  query: KVV = {}
  postForm: KVV = {}
  username = ''
  password = ''
  remoteAddress = ''
  rawBody = ''

  constructor (r: Partial<SinkRequest> = {}) {
    Object.assign(this, r)
  }
}

export class SinkResponse {
  status = 200
  header: KVV = {}
  body: unknown

  constructor (r: Partial<SinkResponse> = {}) {
    Object.assign(this, r)
  }
}
