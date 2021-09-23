import { ChartOptions, ChartOptionsRegistry } from './base'
import { FrameDefinition } from '../../frame'
import { Apply } from '../../../../cast'

export class BasicChartOptions extends ChartOptions {
  public labelColumn: string = ''
  public dataColumns: Array<{ name: string; label?: string }> = []

  constructor (o?: BasicChartOptions | Partial<BasicChartOptions>) {
    super(o)

    if (!o) return

    Apply(this, o, String, 'labelColumn')

    if (o.dataColumns) {
      this.dataColumns = o.dataColumns || []
    }
  }

  getChartConfiguration (dataframes: Array<FrameDefinition>) {
    const config = {
      type: this.type,
      data: {
        labels: this.getLabels(dataframes[0]),
        datasets: this.getDatasets(dataframes[0], dataframes),
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {},
        plugins: {
          colorschemes: {
            scheme: this.colorScheme,
            reverse: true,
          }
        }
      }
    }

    if (['bar', 'line'].includes(this.type)) {
      config.options.scales = {
        yAxes: [{
          ticks: {
            beginAtZero: true,
          },
        }],
      }
    }


    return config
  }

  getColIndex (dataframe: FrameDefinition, col: string) {
    if (!dataframe || !dataframe.columns) return -1

    return dataframe.columns.findIndex(({ name }) => name === col)
  }

  getLabels (localDataframe: FrameDefinition) {
    const labels = []

    if (this.labelColumn && localDataframe) {
      const columnIndex = this.getColIndex(localDataframe, this.labelColumn)
      if (columnIndex < 0) {
        throw new Error(`Column ${this.labelColumn} not found`)
      }

      if (localDataframe.rows) {
        for (const row of localDataframe.rows) {
          labels.push(row[columnIndex])
        }
      }
    }

    return labels
  }

  getDatasets (localDataframe: FrameDefinition, dataframes: Array<FrameDefinition>) {
    const chartDataset = []

    if (this.dataColumns.length && localDataframe.rows) {
      // Create dataset for each dataColumn
      for (const { name } of this.dataColumns) {
        // Assume localDataframe has the dataColumn
        let columnIndex = this.getColIndex(localDataframe, name)

        // If dataColumn is in localDataframe, then set that value
        const data = localDataframe.rows.map(r => {
          return columnIndex < 0 ? undefined : r[columnIndex]
        })

        // Otherwise check other dataframes for that columnn
        if (columnIndex < 0) {
          dataframes.slice(1).forEach(df => {
            const { relColumn = '', refValue = '' } = df

            // Get column that is referenced by relColumn
            const relColumnIndex = this.getColIndex(localDataframe, relColumn)
            if (relColumnIndex < 0) {
              throw new Error(`Column ${relColumn} not found`)
            }

            if (!localDataframe.rows) {
              throw new Error(`Local rows not found`)
            }

            // Get row index that matches refValue
            const refRowIndex = localDataframe.rows.findIndex(row => row[relColumnIndex] === refValue)
            if (refRowIndex < 0) {
              throw new Error(`Row that matches refRowIndex ${refValue} not found`)
            }

            columnIndex = this.getColIndex(df, name)
            if (columnIndex < 0) {
              throw new Error(`Column ${name} not found`)
            } else if (df.rows) {
              data[refRowIndex] = df.rows[0][columnIndex]
            }
          })
        }

        chartDataset.push({
          label: name,
          data,
        })
      }
    }

    return chartDataset
  }
}

ChartOptionsRegistry.set('bar', BasicChartOptions)
ChartOptionsRegistry.set('line', BasicChartOptions)
ChartOptionsRegistry.set('pie', BasicChartOptions)
ChartOptionsRegistry.set('doughnut', BasicChartOptions)

