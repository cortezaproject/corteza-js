import { Step, Block } from '../../reporter'
import { Apply, CortezaID, ISO8601Date, NoID } from '../../cast'
import { IsOf } from '../../guards'

interface PartialReport extends Partial<Omit<Report, 'steps' | 'blocks' | 'createdAt' | 'createdBy' | 'updatedAt' | 'updatedBy' | 'deletedAt' | 'deletedBy'>> {
  steps?: Array<ReportStepGroup>;
  blocks?: Array<unknown|Block>;
  createdAt?: string|number|Date;
  createdBy?: string;
  updatedAt?: string|number|Date;
  updatedBy?: string;
  deletedAt?: string|number|Date;
  deletedBy?: string;
}

interface Meta {
  name?: string;
  description?: string;
  tags?: Array<string>;
}

interface ReportStepGroup {
  name?: string;
  steps: Array<Step>;
}

interface ReportDataSource {
  meta?: Object;
  step: Step;
}

// @todo rework fresh reporter thing and the backend thing
export class Report {
  public reportID = NoID
  public handle = ''
  public meta: Meta = {}
  public sources: Array<ReportDataSource> = []
  public blocks: Array<Block> = []

  public labels: object = {}
  public createdAt?: Date = undefined
  public createdBy?: string = undefined
  public updatedAt?: Date = undefined
  public updatedBy?: string = undefined
  public deletedAt?: Date = undefined
  public deletedBy?: string = undefined

  constructor (r?: PartialReport) {
    this.apply(r)
  }

  apply (r?: PartialReport): void {
    Apply(this, r, CortezaID, 'reportID')

    Apply(this, r, String, 'handle')

    if (r && IsOf(r, 'meta')) {
      this.meta = r.meta
    }


    this.sources = []

    for (const s of r?.sources || []) {
      s.step = s.step as Step
      this.sources.push(s as ReportDataSource)
    }

    if (r?.blocks) {
      this.blocks = []
      for (const p of r.blocks) {
        this.blocks.push(new Block(p as Block))
      }
    }

    if (IsOf(r, 'labels')) {
      this.labels = { ...r.labels }
    }

    Apply(this, r, ISO8601Date, 'createdAt', 'updatedAt', 'deletedAt')
    Apply(this, r, CortezaID, 'createdBy', 'updatedBy', 'deletedBy')
  }

  /**
   * Returns resource ID
   */
  get resourceID (): string {
    return `${this.resourceType}:${this.reportID}`
  }

  /**
   * Resource type
   */
  get resourceType (): string {
    return 'system:role'
  }
}
