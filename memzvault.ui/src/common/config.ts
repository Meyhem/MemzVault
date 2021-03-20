import local from './config-local'
import prod from './config-prod'

let choosenConfig = local

if (process.env.NODE_ENV === 'production') {
  choosenConfig = prod
}

export const config = choosenConfig
