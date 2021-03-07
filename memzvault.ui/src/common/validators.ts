import { FieldValidator } from 'final-form'
import _ from 'lodash'

export interface LocalizedMessage {
  translationKey: string
  interpolation?: Record<string, React.ReactText>
  defaultMessage?: string
}

export const createFormValidator = <T extends Dictionary<any>>(
  validators: Partial<Record<keyof T, FieldValidator<any>[]>>
) => (props?: any) => (values: T) => {
  const errors = _.reduce(
    validators,
    (acc, _, key) => {
      if (!validators[key]) return acc
      // @ts-ignore
      const error = composeValidators(...validators[key])(values[key], values, {
        data: props,
      })
      if (error) acc[key] = error
      return acc
    },
    {} as Dictionary<LocalizedMessage | undefined>
  )
  return _.isEmpty(errors) ? undefined : errors
}

export const composeValidators = (...validators: FieldValidator<any>[]) => (
  value: any,
  allValues: Dictionary<any> | null,
  meta?: any
) =>
  _.reduce(
    validators,
    (error, validator) => error || validator(value, allValues || {}, meta),
    undefined
  )

export function error(
  translationKey: string,
  interpolation?: any,
  defaultMessage?: string
): LocalizedMessage {
  return {
    translationKey,
    interpolation,
    defaultMessage,
  }
}

export const required = (): FieldValidator<any> => (value) =>
  _.isNil(value) ? error('Required') : undefined

const containsNumberRegex = /[0-9]/
const containsAlphaRegex = /[a-zA-Z]/
const constainsCapitalRegex = /[A-Z]/

export const strongPassword = (): FieldValidator<string> => (value) => {
  return _.size(value) >= 8 &&
    _.size(value) <= 25 &&
    containsNumberRegex.test(value) &&
    containsAlphaRegex.test(value) &&
    constainsCapitalRegex.test(value)
    ? undefined
    : error('StrongPassword')
}
