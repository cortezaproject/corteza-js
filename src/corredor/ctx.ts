/* eslint-disable @typescript-eslint/ban-ts-ignore */

// @ts-ignore
import * as apiClients from '../../src/api-clients/export'
// @ts-ignore
import * as helpers from './helpers/export'

import { BaseLogger } from 'pino'
import { BaseArgs } from './args'
import { User } from '../system/types/user'

export interface ConfigCServers {
  system: ConfigServer;
  compose: ConfigServer;
  messaging: ConfigServer;
}

export interface ConfigServer {
  apiBaseURL?: string;
}

export interface Config {
  cServers: ConfigCServers;
}

/**
 * Handles script execution context
 *
 *
 */
export class Ctx {
  readonly args: BaseArgs;
  readonly config: Config;
  readonly log: BaseLogger;

  constructor (config: Config, log: BaseLogger, args: BaseArgs) {
    this.args = args
    this.log = log
    this.config = config
  }

  /**
   * Alias for log, to make developer's life easier <3
   */
  get console (): BaseLogger {
    return this.log
  }

  /**
   * Returns promise with the current user (if jwt argument was given)
   *
   * @returns {Promise<User>}
   */
  get $authUser (): Promise<User> {
    return this.SystemAPI
      .authCheck()
      .then(({ user }: { user: User }) => user)
  }

  /**
   * Configures and returns system API client
   *
   * @returns {Promise<apiClients.System>}
   */
  get SystemAPI (): apiClients.System {
    return new apiClients.System({
      baseURL: this.config.cServers.system.apiBaseURL,
      jwt: this.args.authToken,
    })
  }

  /**
   * Configures and returns compose API client
   *
   * @returns {Promise<apiClients.Compose>}
   */
  get ComposeAPI (): apiClients.Compose {
    return new apiClients.Compose({
      baseURL: this.config.cServers.compose.apiBaseURL,
      jwt: this.args.authToken,
    })
  }

  /**
   * Configures and returns messaging API client
   *
   * @returns {Promise<apiClients.Messaging>}
   */
  get MessagingAPI (): apiClients.Messaging {
    return new apiClients.Messaging({
      baseURL: this.config.cServers.messaging.apiBaseURL,
      jwt: this.args.authToken,
    })
  }

  /**
   * Configures and returns system helper
   */
  get System (): helpers.System {
    return new helpers.System({ SystemAPI: this.SystemAPI, ...this.args })
  }

  /**
   * Configures and returns compose helper
   */
  get Compose (): helpers.Compose {
    return new helpers.Compose({ ComposeAPI: this.ComposeAPI, ...this.args })
  }

  /**
   * Configures and returns messaging helper
   */
  get Messaging (): helpers.Messaging {
    return new helpers.Messaging({ MessagingAPI: this.MessagingAPI, ...this.args })
  }
}
