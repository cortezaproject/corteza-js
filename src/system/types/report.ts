import { reporter } from '../..'
import { Apply, CortezaID, ISO8601Date, NoID } from '../../cast'
import { IsOf } from '../../guards'
import { Projection } from '../../reporter'
import { StepFactory } from '../../reporter/types/step'

interface PartialReport extends Partial<Omit<Report, 'steps' | 'projections' | 'createdAt' | 'createdBy' | 'updatedAt' | 'updatedBy' | 'deletedAt' | 'deletedBy'>> {
  steps?: Array<ReportStepGroup>;
  projections?: Array<unknown|Projection>;
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
}

interface ReportStepGroup {
  name?: string;
  steps: Array<reporter.Step>;
}

interface ReportDataSource {
  name?: string;
  groups: Array<ReportStepGroup>;
}

// @todo rework fresh reporter thing and the backend thing
export class Report {
  public reportID = NoID
  public handle = ''
  public meta: Meta = {}
  public sources: Array<ReportDataSource> = []
  public projections: Array<Projection> = []

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

    if (r?.sources) {
      this.sources = []

      for (const s of r.sources || []) {
        const gg: Array<ReportStepGroup> = []

        for (const g of s.groups) {
          const ss: Array<reporter.Step> = []
          for (const s of g.steps) {
            ss.push(StepFactory(s))
          }
          gg.push({
            name: g.name,
            steps: ss,
          })
        }
        this.sources.push({
          name: s.name,
          groups: gg,
        })
      }
    }

    if (r?.projections) {
      this.projections = []
      for (const p of r.projections) {
        this.projections.push(new Projection(p as Projection))
      }
    }

    if (IsOf(r, 'labels')) {
      this.labels = { ...r.labels }
    }

    Apply(this, r, ISO8601Date, 'createdAt', 'updatedAt', 'deletedAt')
    Apply(this, r, CortezaID, 'createdBy', 'updatedBy', 'deletedBy')
  }

  reportDefinitions (): { model: Array<reporter.Step>; dataset: Array<reporter.DatasetDefinition> } {
    const model: Array<reporter.Step> = []
    const dataset: Array<reporter.DatasetDefinition> = []

    for (const p of this.projections) {
      const r = p.reportDefinitions()
      model.push(...r.model)
      dataset.push(...r.dataset)
    }

    return { model, dataset }
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
