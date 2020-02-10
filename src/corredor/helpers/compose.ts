/* eslint-disable */

import { extractID, genericPermissionUpdater, isFresh, PermissionRule, kv, ListResponse } from './shared'
import { Attachment } from '../../shared'
import { Compose as ComposeAPI } from '../../api-clients'
import { Namespace, Record, Module, Page } from '../../compose'
import { Values } from '../../compose/types/record'

const emailStyle = `
body { -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; color: #3A393C; font-family: Verdana,Arial,sans-serif; font-size: 14px; height: 100%; margin: 0; padding: 0; width: 100% !important; }
table { margin: 20px auto; background: #ffffff; border-collapse: collapse; max-width: 100%; }
table tr { height: 40px; }
table td { padding-top: 10px; padding-left: 20px; width:100%; max-width:100%; min-width:100%; width:100%; vertical-align: top; }
table tbody { border-top: 3px solid #808080; }
tbody tr:nth-child(even) { background-color: #F3F3F4; }
tbody td:first-child { width: 30%; color: #808080; }
tbody td:nth-child(2) { width: 70%; }
h2, p { padding: 10px 20px; }
p { text-align: justify; line-height: 1.4;}
`

interface ComposeContext {
  ComposeAPI: ComposeAPI;
  $namespace?: Namespace;
  $module?: Module;
  $record?: Record;
}

interface PageListFilter {
  [key: string]: string|number|undefined;
  namespaceID?: string;
  selfID?: string;
  query?: string;
  handle?: string;
  page?: number;
  perPage?: number;
  sort?: string;
}

interface RecordListFilter {
  [key: string]: string|number|undefined;
  namespaceID?: string;
  moduleID?: string;
  filter?: string;
  page?: number;
  perPage?: number;
  sort?: string;
}

interface ModuleListFilter {
  [key: string]: string|undefined;
  query?: string;
}

interface NamespaceListFilter {
  [key: string]: string|number|undefined;
  query?: string;
  slug?: string;
  page?: number;
  perPage?: number;
  sort?: number;
}

/**
 * ComposeHelper provides layer over Compose API and utilities that simplify automation script writing
 *
 * Initiated as Compose object and provides a few handy shortcuts and fallback that will enable you
 * to rapidly develop your automation scripts.
 */
export class Compose {
  private ComposeAPI: ComposeAPI;
  private $namespace?: Namespace;
  private $module?: Module;
  private $record?: Record;

  /**
   * @param {Namespace} ctx.$namespace - Current namespace
   * @param {Module} ctx.$module - Current module
   * @param {Record} ctx.$record - Current record
   */
  constructor (ctx: ComposeContext) {
    this.ComposeAPI = ctx.ComposeAPI
    this.$namespace = ctx.$namespace
    this.$module = ctx.$module
    this.$record = ctx.$record
  }

  /**
   * Creates new Page object
   *
   * <p>
   *   Created page is "in-memory" only. To store it, use savePage() method
   * </p>
   *
   * @example
   * // Simple page creation new page on current namespace
   * let myPage = await Compose.makePage({ title: 'My Amazing Page!' })
   *
   * @param {Object} values
   * @param {Namespace} ns - defaults to current $namespace
   * @return {Promise<Page>}
   */
  async makePage (values: Partial<Page> = {}, ns: Namespace|undefined = this.$namespace): Promise<Page> {
    return this.resolveNamespace(ns).then(ns => {
      return new Page({ ...values, namespaceID: ns.namespaceID })
    })
  }

  /**
   * Creates/updates Page
   *
   * @param {Promise<*>|Page} page
   * @returns {Promise<Page>}
   */
  async savePage (page: Promise<Page>|Page|Partial<Page>): Promise<Page> {
    return Promise.resolve(page).then(page => {
      if (!(page instanceof Page)) {
         throw Error('expecting Page type')
      }

      if (isFresh(page.pageID)) {
        return this.ComposeAPI.pageCreate(kv(page)).then(page => new Page(page))
      } else {
        return this.ComposeAPI.pageUpdate(kv(page)).then(page => new Page(page))
      }
    })
  }

  /**
   * Deletes a page
   *
   * @example
   * Compose.deletePage(myPage)
   *
   * @param {Page} page
   * @returns {Promise<void>}
   */
  async deletePage (page: Page): Promise<unknown> {
    return Promise.resolve(page).then(page => {
      if (!(page instanceof Page)) {
        throw Error('expecting Page type')
      }

      if (!isFresh(page.pageID)) {
        return this.ComposeAPI.pageDelete(kv(page))
      }
    })
  }

  /**
   * Searches for pages
   *
   * @private
   * @param {string|Object} filter
   * @param {Promise<*>|string|Namespace|Object} ns
   * @returns {Promise<ListResponse<PageListFilter, Page[]>>}
   */
  async findPages (filter: string|PageListFilter = {}, ns: Namespace|undefined = this.$namespace): Promise<ListResponse<PageListFilter, Page[]>> {
    if (typeof filter === 'string') {
      filter = { query: filter }
    }

    return this.resolveNamespace(ns).then(ns => {
      const namespaceID = extractID(ns, 'namespaceID')
        return this.ComposeAPI.pageList({ namespaceID, ...filter as object }).then(res => {
          if (!Array.isArray(res.set) || res.set.length === 0) {
            throw new Error('pages not found')
          }

          // Casting all we got to to Page
          res.set = res.set.map(m => new Page(m))
          return res as unknown as ListResponse<PageListFilter, Page[]>
        })
    })
  }

  /**
   * Finds page by ID
   *
   * @example
   * // Explicitly load page and do something with it
   * Compose.finePageByID('2039248239042').then(myPage => {
   *   // do something with myPage
   *   myPage.title = 'My More Amazing Page!'
   *   return myPage
   * }).then(Compose.savePage)
   *
   * @param {string|Page} page - accepts Page, pageID (when string string)
   * @param {string|Namespace|Object} ns - namespace, defaults to current $namespace
   * @returns {Promise<Page>}
   */
  async findPageByID (page: string|Page, ns: Namespace|undefined = this.$namespace): Promise<Page> {
    return this.resolveNamespace(ns).then((ns) => {
      const pageID = extractID(page, 'pageID')
      const namespaceID = extractID(ns, 'namespaceID')

      return this.ComposeAPI.pageRead({ namespaceID, pageID }).then(page => new Page(page))
    })
  }

  /**
   * Creates new Record object
   *
   * <p>
   *   Created record is "in-memory" only. To store it, use saveRecord() method
   * </p>
   *
   * @example
   * // Simple record creation (new record of current module - $module)
   * let myLead = await Compose.makeRecord()
   * myLead.values.Title = 'My Lead Title'
   *
   * // Create record of type Lead and copy values from another Record
   * // This will copy only values that have the same name in both modules
   * let myLead = await Compose.makeRecord(myContact, 'Lead')
   *
   * // Or use promises:
   * Compose.makeRecord(myContact, 'Lead').then(myLead => {
   *   myLead.values.Title = 'My Lead Title'
   *
   *   // ...
   *
   *   // return record when finished
   *   return myLead
   * }).catch(err => {
   *   // solve the problem
   *   console.error(err)
   * })
   *
   * @param {Object} values
   * @param {Module} module - defaults to current $module
   * @return {Promise<Record>}
   */
  async makeRecord (values: Values = {}, module: Module|null = null): Promise<Record> {
    return this.resolveModule(module, this.$module).then(module => {
      const record = new Record(module)

      // Set record values
      record.setValues(values)

      return record
    })
  }

  /**
   * Saves a record
   *
   * Please note that there is no need to explicitly save (current record) on before/after events,
   * internal systems take care of that.
   *
   * @example
   * // Quick example how to make and save new Lead:
   * let mySavedLead = await Compose.saveRecord(Compose.makeRecord({Title: 'Lead title'}, 'Lead'))
   * if (mySavedLead) {
   *   console.log('Record saved, new ID', mySavedLead.recordID)
   * } else {
   *   // solve the problem
   *   console.error(err)
   * }
   *
   * // Or with promises:
   * Compose.makeRecord({Title: 'Lead title'}, 'Lead')).then(myLead => {
   *   return Compose.saveRecord(myLead)
   * }).then(mySavedLead => {
   *   console.log('Record saved, new ID', mySavedLead.recordID)
   * }).catch(err => {
   *   // solve the problem
   *   console.error(err)
   * })
   *
   * @param {Record|Promise<Record>} record
   * @return {Promise<Record>}
   */
  async saveRecord (record: Record|Promise<Record>): Promise<Record> {
    return Promise.resolve(record).then(record => {
      if (!(record instanceof Record)) {
        throw Error('expecting Record type')
      }

      if (isFresh(record.recordID)) {
        return this.ComposeAPI.recordCreate(kv(record)).then(r => new Record(record.module, r))
      } else {
        return this.ComposeAPI.recordUpdate(kv(record)).then(r => new Record(record.module, r))
      }
    })
  }

  /**
   * Deletes a record
   *
   * Please note that there is no need to explicitly delete (current record) on before/after events.
   *
   * @example
   * Compose.deleteRecord(myLead)
   *
   * @param {Record} record
   * @returns {Promise<void>}
   */
  async deleteRecord (record: Record): Promise<unknown> {
    return Promise.resolve(record).then(record => {
      if (!(record instanceof Record)) {
        throw Error('expecting Record type')
      }

      if (!isFresh(record.recordID)) {
        return this.ComposeAPI.recordDelete(kv(record))
      }
    })
  }

  /**
   * Searches for records of a specific record
   *
   * @example
   * // Find all records (of the current module)
   * Compose.findRecords()
   *
   * // Find Projects where ROI is more than 15%
   * // (assuming we have Project module with netProfit and totalInvestment numeric fields)
   * Compose.findRecords('netProfit / totalInvestment > 0.15', 'Project')
   *
   * // Find Projects where ROI is more than 15%
   * // (assuming we have Project module with netProfit and totalInvestment numeric fields)
   * Compose.findRecords('netProfit / totalInvestment > 0.15', 'Project')
   *
   * // More complex query with sorting:
   * // Returns top 5 Projects with more than 15% ROI in the last year
   * Compose.findRecords({
   *   filter: '(netProfit / totalInvestment > 0.15) AND (YEAR(createdAt) = YEAR(NOW()) - 1)'
   *   sort: 'netProfit / totalInvestment DESC',
   *   perPage: 5,
   * }, 'Project')
   *
   * // Accessing returned records
   * Compose.findRecords().then(({ set, filter }) => {
   *    // set: array of records
   *    // filter: object with filter specs, aso returns `count` with total number of all records that accross all pages
   *
   *    Use internal Array functions
   *    set.forEach(r => {
   *      // r, one of the records each iteration
   *    })
   *
   *    // Or standard for-loop
   *    for (let r of set) {
   *       // r...
   *    }
   * })
   *
   * @param {string|Object} filter - filter object (or filtering conditions when string)
   * @property {string} filter.filter - filtering conditions
   * @property {string} filter.sort - sorting rules
   * @property {number} filter.perPage - max returned records per page
   * @property {number} filter.page - page to return (1-based)
   * @param {Module} [module] - if not set, defaults to $module
   * @returns {Promise<ListResponse<RecordListFilter, Record[]>>}
   */
  async findRecords (filter: string|RecordListFilter = '', module: Module|undefined = this.$module): Promise<ListResponse<RecordListFilter, Record[]>> {
    return this.resolveModule(module).then(module => {
      const { moduleID, namespaceID } = module

      let params = {
        moduleID,
        namespaceID,
      } as { moduleID: string, namespaceID: string, filter: string}

      if (typeof filter === 'string') {
        params.filter = filter
      } else if (typeof filter === 'object') {
        params = { ...params, ...filter }
      }

      return this.ComposeAPI.recordList(params).then(res => {
        if (!Array.isArray(res.set) || res.set.length === 0) {
          throw new Error('records not found')
        }

        // Casting all we got to to Record
        res.set = res.set.map(m => new Record(module, m))
        return res as unknown as ListResponse<RecordListFilter, Record[]>
      })
    })
  }

  /**
   * Finds last (created) record in the module
   *
   * @example
   * Compose.findLastRecord('Settings').then(lastSettingRecord => {
   *   // handle lastSettingRecord
   * })
   *
   * @param {Module} module
   * @returns {Promise<Record>}
   */
  async findLastRecord (module: Module|undefined = this.$module): Promise<Record> {
    return this.findRecords({ sort: 'recordID DESC', page: 1, perPage: 1 }, module).then(res => {
      if (!Array.isArray(res.set) || res.set.length === 0) {
        throw new Error('records not found')
      }

      return new Record(res.set[0])
    })
  }

  /**
   * Finds first (created) record in the module
   *
   * @example
   * Compose.findFirstRecord('Settings').then(firstSettingRecord => {
   *   // handle this firstSettingRecord
   * })
   *
   * @param {Module} module
   * @returns {Promise<Record>}
   */
  async findFirstRecord (module: Module|undefined = this.$module): Promise<Record> {
    return this.findRecords({ sort: 'recordID ASC', page: 1, perPage: 1 }, module).then(res => {
      if (!Array.isArray(res.set) || res.set.length === 0) {
        throw new Error('records not found')
      }

      return new Record(res.set[0])
    })
  }

  /**
   * Finds one record by ID
   *
   * @example
   * Compose.findRecordByID("23957823957").then(specificRecord => {
   *   // handle this specificRecord
   * })
   *
   * @param {string|Object|Record} record
   * @param {Module} module
   * @returns {Promise<Record>}
   */
  async findRecordByID (record: string|object|Record, module: Module|null = null): Promise<Record>{
    // We're handling module default a bit differently here
    // because we want to allow users to use record's module
    return this.resolveModule(module, (record as Record || {}).module, this.$module).then((module) => {
      const { moduleID, namespaceID } = module
      return this.ComposeAPI.recordRead({
        moduleID,
        namespaceID,

        recordID: extractID(record, 'recordID'),
      }).then(r => new Record(module, r))
    })
  }

  /**
   * Finds a single attachment
   *
   * @param {string|Object|Attachment} attachment Attachment to find
   * @param {Promise<Attachment>} ns
   */
  async findAttachmentByID (attachment: string|object|Attachment, ns: Namespace|undefined = this.$namespace): Promise<Attachment> {
    return this.resolveNamespace(ns).then(namespace => {
      const { namespaceID } = namespace
      return this.ComposeAPI.attachmentRead({
        kind: 'original',
        attachmentID: extractID(attachment, 'attachmentID'),
        namespaceID,
      }).then(att => new Attachment(att))
    })
  }

  /**
   * Helper to determine field's name from it's label
   * @param {String} label Field's label
   * @returns {String}
   */
  moduleFieldNameFromLabel (label: string): string {
    return label.split(/[^a-zA-Z0-9_]/g)
      .filter(p => !!p)
      .map(p => `${p[0].toUpperCase()}${p.slice(1)}`)
      .join('')
  }

  /**
   * Creates new Module object
   *
   * @param {Promise<*>|Module} module
   * @param {string|Object|Namespace} ns, defaults to current $namespace
   * @returns {Promise<Module>}
   */
  async makeModule (module: Promise<Module>|Module = {} as Module, ns: Namespace|undefined = this.$namespace): Promise<Module> {
    return this.resolveNamespace(ns).then((ns) => {
      return new Module({ ...module, namespaceID: ns.namespaceID })
    })
  }

  /**
   * Creates/updates Module
   *
   * @param {Promise<*>|Module} module
   * @returns {Promise<Module>}
   */
  async saveModule (module: Promise<Module>|Module): Promise<Module> {
    return Promise.resolve(module).then(module => {
      if (!(module instanceof Module)) {
        throw new Error('expecting Module type')
      }

      if (isFresh(module.moduleID)) {
        return this.ComposeAPI.moduleCreate(kv(module)).then(m => new Module(m))
      } else {
        return this.ComposeAPI.moduleUpdate(kv(module)).then(m => new Module(m))
      }
    })
  }

  /**
   * Searches for modules
   *
   * @private
   * @param {string|Object} filter
   * @param {Promise<*>|string|Namespace|Object} ns
   * @returns {Promise<ListResponse<ModuleListFilter, Module[]>>}
   */
  async findModules (filter: string|ModuleListFilter = '', ns: Namespace|undefined = this.$namespace): Promise<ListResponse<ModuleListFilter, Module[]>> {
    if (typeof filter === 'string') {
      filter = { query: filter }
    }

    return this.resolveNamespace(ns).then((ns) => {
      const namespaceID = extractID(ns, 'namespaceID')

      return this.ComposeAPI.moduleList({ namespaceID, ...filter as object }).then(res => {
        if (!Array.isArray(res.set) || res.set.length === 0) {
          throw new Error('modules not found')
        }

        // Casting all we got to to Module
        res.set = res.set.map(m => new Module(m))
        return res as unknown as ListResponse<ModuleListFilter, Module[]>
      })
    })
  }

  /**
   * Finds module by ID
   *
   * @example
   * // Explicitly load module and do something with it
   * Compose.findModuleByID('2039248239042').then(myModule => {
   *   // do something with myModule
   *   return Compose.findLastRecord(myModule)
   * }).then((lastRecord) => {})
   *
   * // or
   * Compose.findLastRecord(Compose.findModuleByID('2039248239042')).then(....)
   *
   * // even shorter
   * Compose.findLastRecord('2039248239042').then(....)
   *
   * @param {string|Module|Record} module - accepts Module, moduleID (when string string) or Record
   * @param {string|Namespace|Object} ns - namespace, defaults to current $namespace
   * @returns {Promise<Module>}
   */
  async findModuleByID (module: string|Module|Record, ns: Namespace|undefined = this.$namespace): Promise<Module> {
    return this.resolveNamespace(ns).then((ns) => {
      const moduleID = extractID(module, 'moduleID')
      const namespaceID = extractID(ns, 'namespaceID')

      return this.ComposeAPI.moduleRead({ namespaceID, moduleID }).then(m => new Module(m))
    })
  }

  /**
   * Finds module by name
   *
   * @example
   * // Explicitly load module and do something with it
   * Compose.findModuleByName('SomeModule').then(myModule => {
   *   // do something with myModule
   *   return Compose.findLastRecord(myModule)
   * }).then((lastRecord) => {})
   *
   * // or
   * Compose.findLastRecord(Compose.findModuleByName('SomeModule')).then(....)
   *
   * // even shorter
   * Compose.findLastRecord('SomeModule').then(....)
   *
   * @param {string} name - name of the module
   * @param {null|string|Namespace|Object} ns - defaults to current $namespace
   * @returns {Promise<Module>}
   */
  async findModuleByName (name: string, ns: string|Namespace|object|undefined = this.$namespace): Promise<Module>{
    return this.resolveNamespace(ns).then((ns) => {
      const namespaceID = extractID(ns, 'namespaceID')
      return this.ComposeAPI.moduleList({ namespaceID, name }).then(res => {
        if (!Array.isArray(res.set) || res.set.length === 0) {
          throw new Error('module not found')
        }

        return new Module(res.set[0])
      })
    })
  }

  /**
   * Finds module by handle
   *
   * @example
   * // Explicitly load module and do something with it
   * Compose.findModuleByHandle('SomeModule').then(myModule => {
   *   // do something with myModule
   *   return Compose.findLastRecord(myModule)
   * }).then((lastRecord) => {})
   *
   * // or
   * Compose.findLastRecord(Compose.findModuleByHandle('SomeModule')).then(....)
   *
   * // even shorter
   * Compose.findLastRecord('SomeModule').then(....)
   *
   * @param {string} name - handle of the module
   * @param {null|string|Namespace|Object} ns - defaults to current $namespace
   * @returns {Promise<Module>}
   */
  async findModuleByHandle (handle: string, ns: string|Namespace|object|undefined = this.$namespace): Promise<Module> {
    return this.resolveNamespace(ns).then((ns) => {
      const namespaceID = extractID(ns, 'namespaceID')
      return this.ComposeAPI.moduleList({ namespaceID, handle }).then(res => {
        if (!Array.isArray(res.set) || res.set.length === 0) {
          throw new Error('module not found')
        }

        return new Module(res.set[0])
      })
    })
  }

  /**
   * Creates new Namespace object
   *
   * @example
   * // Creates enabled (!) namespace with slug & name
   * Compose.saveNamespace(Compose.makeNamespace({
   *   slug: 'my-namespace',
   *   name: 'My Namespace',
   * }))
   *
   * @param {Promise<*>|Namespace} namespace
   * @param {string|Object|Namespace} namespace, defaults to current $namespace
   * @returns {Promise<Namespace>}
   */
  async makeNamespace (namespace: Promise<Namespace>|Namespace = {} as Namespace): Promise<Namespace> {
    return new Namespace({
      name: (namespace as Namespace).name || (namespace as Namespace).slug,
      meta: {},
      enabled: true,
      ...namespace,
    })
  }

  /**
   * Creates/updates Namespace
   *
   * @example
   * Compose.saveNamespace(myNamespace)
   *
   * @param {Promise<*>|Namespace} namespace
   * @returns {Promise<Namespace>}
   */
  async saveNamespace (namespace: Promise<Namespace>|Namespace): Promise<Namespace> {
    return Promise.resolve(namespace).then(namespace => {
      if (!(namespace instanceof Namespace)) {
        throw Error('expecting Namespace type')
      }

      if (isFresh(namespace.namespaceID)) {
        return this.ComposeAPI.namespaceCreate(kv(namespace)).then(n => new Namespace(n))
      } else {
        return this.ComposeAPI.namespaceUpdate(kv(namespace)).then(n => new Namespace(n))
      }
    })
  }

  /**
   * Searches for namespaces
   *
   * @private
   * @param {string|Object} filter
   * @returns {Promise<ListResponse<NamespaceListFilter, Namespace[]>>}
   */
  async findNamespaces (filter: string|NamespaceListFilter = ''): Promise<ListResponse<NamespaceListFilter, Namespace[]>> {
    if (typeof filter === 'string') {
      filter = { query: filter }
    }

    return this.ComposeAPI.namespaceList({ ...filter }).then(res => {
      if (!Array.isArray(res.set) || res.set.length === 0) {
        throw new Error('namespaces not found')
      }

      // Casting all we got to to Namespace
      res.set = res.set.map(m => new Namespace(m))
      return res as unknown as ListResponse<NamespaceListFilter, Namespace[]>
    })
  }

  /**
   * Finds namespace by ID
   *
   * @example
   * // Explicitly load namespace and do something with it
   * Compose.findNamespaceByID('2039248239042').then(myNamespace => {
   *   // do something with myNamespace
   *   return Compose.findModules(myNamespace)
   * }).then(modules => {})
   *
   * // even shorter
   * Compose.findModules('2039248239042').then(....)
   *
   * @param {string|Namespace|Record} ns - accepts Namespace, namespaceID (when string string) or Record
   * @returns {Promise<Namespace>}
   */
  async findNamespaceByID (ns: string|Namespace|Record|undefined = this.$namespace): Promise<Namespace> {
    const namespaceID = extractID(ns, 'namespaceID')

    return this.ComposeAPI.namespaceRead({ namespaceID }).then(m => new Namespace(m))
  }

  /**
   * Finds namespace by name
   *
   * @example
   * // Explicitly load namespace and do something with it
   * Compose.findNamespaceBySlug('SomeNamespace').then(myNamespace => {
   *   // do something with myNamespace
   *   return Compose.findModules(myNamespace)
   * }).then(modules => {})
   *
   * // even shorter
   * Compose.findModules('SomeNamespace').then(....)
   *
   * @param {string} slug - name of the namespace
   * @returns {Promise<Namespace>}
   */
  async findNamespaceBySlug (slug: string): Promise<Namespace> {
    return this.ComposeAPI.namespaceList({ slug }).then(res => {
      if (!Array.isArray(res.set) || res.set.length === 0) {
        throw new Error('namespace not found')
      }

      return new Namespace(res.set[0])
    })
  }

  /**
   * Sends a simple email message
   *
   * @example
   * Compose.sendMail('some-address@domain.tld', 'subject...', { html: 'Hello!' })
   *
   * @param {string|string[]} to - Recipient(s)
   * @param {string} subject - Mail subject
   * @param {Object} body
   * @property {string} body.html - HTML body to be sent
   * @param {string|string[]} Any additional addresses we want this to be sent to (carbon-copy)
   * @returns {Promise<void>}
   */
  async sendMail (to: string|string[], subject: string, { html = '' }: { html?: string } = {}, { cc = [] }: { cc?: string|string[] } = {} ): Promise<unknown> {
    if (!to) {
      throw Error('expecting to email address')
    }

    if (!subject) {
      throw Error('expecting subject')
    }

    if (!html) {
      throw Error('expecting HTML body')
    }

    return this.ComposeAPI.notificationEmailSend({
      to: Array.isArray(to) ? to : [to],
      cc: Array.isArray(cc) ? cc : [cc],
      subject,
      content: { html },
    })
  }

  /**
   * Generates HTML with all records fields and sends it to
   *
   * @example
   * // Simplified version, sends current email with generated
   * // subject (<module name> + 'record' +  'update'/'created')
   * Compose.sendRecordToMail('example@domain.tld')
   *
   * // Complex notification with custom subject, header and footer text and custom record
   * Compose.sendRecordToMail(
   *   'asignee@domain.tld',
   *   'New lead assigned to you',
   *   {
   *      header: '<h1>New lead was created and assigned to you</h1>',
   *      footer: 'Review and confirm',
   *      cc: [ 'sales@domain.tld' ],
   *      fields: ['name', 'country', 'amount'],
   *   },
   *   newLead
   * )
   *
   * @param {string|string[]} to - Recipient(s)
   * @param {string} subject - Mail subject
   * @param {Object} options - Various options for body & email
   * @property {string} options.header - Text (HTML) before the record table
   * @property {string} options.footer - Text (HTML) after the record table
   * @property {string} options.style - Custom CSS styles for the email
   * @param {string[]|null} options.fields - List of record fields we want to output
   * @param {object} options.header - Additional mail headers (cc)
   * @param {Promise|Record} record - record to be converted (or leave for the current $record)
   * @return {Promise<void>}
   */
  async sendRecordToMail (
    to: string|string[],
    subject: string = '',
    {
      header = '',
      footer = '',
      style = emailStyle,
      fields = null,
      ...mailHeader
    }: { header?: string, footer?: string, style?:string, fields?: string[]|null } = {},
    record: Promise<Record>|Record|undefined = this.$record,
  ): Promise<unknown> {
    // Wait for the record if we got a promise

    record = await record

    const wb = '<div style="width: 800px; margin: 20px auto;">'
    const wa = '</div>'

    header = `${wb}${header}${wa}`
    footer = `${wb}${footer}${wa}`
    style = `<style type="text/css">${style}</style>`

    const html = style + header + this.recordToHTML(fields, record) + footer

    if (!subject) {
      subject = record!.module.name + ' '
      subject += record!.updatedAt ? 'record updated' : 'record created'
    }

    return this.sendMail(
      to,
      subject,
      { html },
      { ...mailHeader },
    )
  }

  /**
   * Walks over white listed fields.
   *
   * @param {null|Array|Record} fwl - field white list; if not defined, all fields are used
   * @param {Record} record - record to be walked over
   * @param {Function} formatter
   * @returns {*}
   *
   * @private
   */
  walkFields (fwl: null|string[]|Record|undefined , record: Record, formatter: (...args: any[]) => string) {
    if (!formatter) {
      throw new Error('formatter.undefined')
    }

    if (fwl instanceof Record) {
      record = fwl
      fwl = undefined
    }

    if (Array.isArray(fwl) && fwl.length === 0) {
      fwl = null
    }

    return record.module.fields
      .filter(f => !fwl || (fwl as Array<string>).indexOf(f.name) > -1)
      .map(formatter)
  }

  /**
   * Sends a simple record report as HTML
   *
   * @example
   * // generates report for current $record with all fields
   * let report = recordToHTML()
   *
   * // generates report for current $record from a list of fields
   * let report = recordToHTML(['fieldA', 'fieldB', 'fieldC'])
   *
   *
   * @param {null|Array|Record} fwl - field white list (or leave empty/null/false for all fields)
   * @param {Record} record - record to be converted (or leave for the current $record)
   * @returns {string}
   */
  recordToHTML (fwl: null|string[]|Record = null, record: Record|undefined = this.$record): string {
    const rows = this.walkFields(fwl, record!, (f: { name: string, label: string }): string => {
      const v = record!.values[f.name]
      return `<tr><td>${f.label || f.name}</td><td>${(Array.isArray(v) ? v : [v]).join(', ') || '&nbsp;'}</td></tr>`
    }).join('')

    return `<table width="800" cellspacing="0" cellpadding="0" border="0">${rows}</table>`
  }

  /**
   * Represents a given record as plain text
   *
   * @example
   * // generates report for current $record with all fields
   * let report = recordToPlainText()
   *
   * // generates report for current $record from a list of fields
   * let report = recordToPlainText(['fieldA', 'fieldB', 'fieldC'])
   *
   * @param {null|Array|Record} fwl - field white list (or leave empty/null/false for all fields)
   * @param {Record} record - record to be converted (or leave for the current $record)
   * @returns {string}
   */
  recordToPlainText (fwl: null|string[]|Record = null, record: Record|undefined = this.$record): string {
    return this.walkFields(fwl, record!, f => {
      const v = record!.values[f.name]
      return `${f.label || f.name}:\n${(Array.isArray(v) ? v : [v]).join(', ') || '/'}\n\n`
    }).join('').trim()
  }

  /**
   * Scans all given arguments and returns first one that resembles something like a valid module, its name or ID
   *
   * @private
   * @returns {Promise}
   */
  async resolveModule (...args: unknown[]): Promise<Module> {
    const strResolve = async (module: string) => {
      return this.findModuleByHandle(module)
        .then(m => {
          if (!m) {
            throw new Error('ModuleNotFound')
          }
          return m
        })
        .catch(() => this.findModuleByName(module))
    }
    for (let module of args) {
      if (!module) {
        continue
      }

      if (typeof module === 'string') {
        if (/^[0-9]+$/.test(module)) {
          // Looks like an ID
          return this.findModuleByID(module).catch((err = {}) => {
            if (err.message && err.message.indexOf('ModuleNotFound') >= 0) {
              // Not found, let's try if we can find it by slug
              return strResolve(module as string)
            }

            return Promise.reject(err)
          })
        }

        // Assume name
        return strResolve(module)
      }

      if (typeof module !== 'object') {
        continue
      }

      // resolve whatever object we have (maybe it's a promise?)
      // and wait for results
      module = await module

      if (module instanceof Record) {
        return this.resolveModule(module.module, module.moduleID)
      }

      if ((module as ListResponse<ModuleListFilter, Module[]>).set && (module as ListResponse<ModuleListFilter, Module[]>).filter) {
        // We got a result set with modules
        module = (module as ListResponse<ModuleListFilter, Module[]>).set
      }

      if (Array.isArray(module)) {
        // We got array of modules
        if (module.length === 0) {
          // Empty array
          continue
        } else {
          // Use first module from the list
          module = module.shift()
        }
      }

      if (!(module instanceof Module)) {
        // not module? is it an object with moduleID & namespaceID?
        if ((module as Module).moduleID === undefined || (module as Module).namespaceID === undefined) {
          break
        }

        return Promise.resolve(new Module(module as Module))
      }

      return Promise.resolve(module)
    }

    return Promise.reject(Error('unexpected input type for module resolver'))
  }

  /**
   * Scans all given arguments and returns first one that resembles something like a valid namespace, its slug or ID
   *
   * @private
   * @returns {Promise}
   */
  async resolveNamespace (...args: unknown[]): Promise<Namespace> {
    for (let ns of args) {
      if (!ns) {
        continue
      }

      if (typeof ns === 'string') {
        if (/^[0-9]+$/.test(ns)) {
          // Looks like an ID
          return this.findNamespaceByID(ns).catch((err = {}) => {
            if (err.message && err.message.indexOf('NamespaceNotFound') >= 0) {
              // Not found, let's try if we can find it by slug
              return this.findNamespaceBySlug(ns as string)
            }

            return Promise.reject(err)
          })
        }

        // Assume namespace slug
        return this.findNamespaceBySlug(ns)
      }

      if (typeof ns !== 'object') {
        continue
      }

      // resolve whatever object we have (maybe it's a promise?)
      // and wait for results
      ns = await ns

      if (ns instanceof Record) {
        return this.resolveNamespace(ns.namespaceID)
      }

      if ((ns as ListResponse<NamespaceListFilter, Namespace[]>).set && (ns as ListResponse<NamespaceListFilter, Namespace[]>).filter) {
        // We got a result set with modules
        ns = (ns as ListResponse<NamespaceListFilter, Namespace[]>).set
      }

      if (Array.isArray(ns)) {
        // We got array of modules
        if (ns.length === 0) {
          // Empty array
          continue
        } else {
          // Use first module from the list
          ns = ns.shift()
        }
      }

      if (!(ns instanceof Namespace)) {
        // not Namespace? is it an object with namespaceID?
        if ((ns as Namespace).namespaceID === undefined) {
          break
        }

        return Promise.resolve(new Namespace(ns as Namespace))
      }

      return Promise.resolve(ns)
    }

    return Promise.reject(Error('unexpected input type for namespace resolver'))
  }

  /**
   * Sets permissions on messaging resources
   *
   * @example
   * Compose.setPermissions([
   *   // Allow someRole update to delete newModule
   *   new AllowAccess(someRole, newModule, 'delete'),
   *
   *   // Allow newRole to update any module
   *   new AllowAccess(newRole, new WildcardResource(new Module), 'update')
   * ])
   *
   * @param {PermissionRule[]} rules
   * @returns {Promise<void>}
   */
  async setPermissions (rules: PermissionRule[]): Promise<void> {
    return genericPermissionUpdater(this.ComposeAPI, rules)
  }
}
