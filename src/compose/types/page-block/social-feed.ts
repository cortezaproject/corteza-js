import { PageBlock, RawPageBlock, Registry } from './base'
import { Apply, CortezaID, NoID } from '../../../cast'
import { Record } from '../record'

const kind = 'SocialFeed'
interface Options {
  moduleID: string;
  fields: unknown[];
  profileSourceField: string;
  profileUrl: string;
}

export class PageBlockSocialFeed extends PageBlock {
  readonly kind = kind

  options: Options = {
    moduleID: NoID,
    fields: [],
    profileSourceField: '',
    profileUrl: '',
  }

  constructor (i?: PageBlock | RawPageBlock) {
    super(i)
    this.applyOptions(i?.options as Options)
  }

  applyOptions (o?: Options): void {
    if (!o) return

    Apply(this.options, o, CortezaID, 'moduleID')
    Apply(this.options, o, String, 'profileSourceField', 'profileUrl')

    if (o.fields) {
      this.options.fields = o.fields
    }
  }
}

export function getTwitterHandle (url: string): string {
  const twitterUnpacked = url.split('/')
  // the fourth item should be the handle
  if (twitterUnpacked.length === 4) {
    return twitterUnpacked[3]
  } else {
    // something strange with this twitter url
    return ''
  }
}

export function extractSocialUrl (profileSourceField: string, profileUrl: string, record?: Record): object {
  let url = ''
  let socialNetwork = ''
  let twitterHandle = ''
  // check if we have a profileSourceField
  if (profileSourceField && profileSourceField.length > 0 && record) {
    const v = record.values[profileSourceField]
    url = (Array.isArray(v) && v.length > 0 ? v[0] : v) as string
  } else {
    // see if we can fail back to profileUrl
    if (profileUrl && profileUrl.length > 0) {
      url = profileUrl
    }
  }

  // is this a twitter url?
  if (url && url.indexOf('twitter.com')) {
    twitterHandle = getTwitterHandle(url)
    if (twitterHandle === '') {
      // failed to get twitter handle from the url
      twitterHandle = ''
      socialNetwork = ''
    } else {
      socialNetwork = 'Twitter'
    }
  } else {
    // this was not a twitter url
    url = ''
    socialNetwork = ''
  }

  return {
    url,
    socialNetwork,
    twitterHandle,
  }
}

Registry.set(kind, PageBlockSocialFeed)
