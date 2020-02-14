import yaml from 'js-yaml'
import { Module } from '../types/module'

export function getModuleFromYaml (moduleName: string, yamlFile: string): Module|undefined {
  const data = yaml.safeLoadAll(yamlFile)
  const mod = data[0].modules[moduleName]
  if (mod) {
    // Convert fields from object to array
    mod.fields = Object.keys(mod.fields).map((k) => mod.fields[k])
    return new Module(mod)
  } else {
    return undefined
  }
}
