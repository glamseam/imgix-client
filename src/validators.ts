import {
    DEFAULT_MIN_SRCSET_WIDTH,
    DEFAULT_MAX_SRCSET_WIDTH,
    DEFAULT_SRCSET_WIDTH_TOLERANCE
} from './constants'

import {
    SrcsetOptions
} from './types'

export const validateAndDestructureOptions = (options: SrcsetOptions | undefined) => {
    const widthTolerance = options?.widthTolerance ?? DEFAULT_SRCSET_WIDTH_TOLERANCE
    validateWidthTolerance(widthTolerance)

    const minWidth = options?.minWidth ?? DEFAULT_MIN_SRCSET_WIDTH
    const maxWidth = options?.maxWidth ?? DEFAULT_MAX_SRCSET_WIDTH
    validateRange(minWidth, maxWidth)

    return {
        widthTolerance,
        minWidth,
        maxWidth
    }
}

export const validateDevicePixelRatios = (
    devicePixelRatios: SrcsetOptions['devicePixelRatios']
) => {
    if (!Array.isArray(devicePixelRatios) || !devicePixelRatios.length) {
        throw new Error(
            'The devicePixelRatios argument can only be passed a valid non-empty array of integers'
        )
    } else {
        const isAllValidDPR = devicePixelRatios.every((dpr) => {
            return typeof dpr === 'number' && dpr >= 1 && dpr <= 5
        })

        if (!isAllValidDPR) {
            throw new Error(
                'The devicePixelRatios argument can only contain positive integer values between 1 and 5'
            )
        }
    }
}

export const validateRange = (min: string | number, max: string | number) => {
    if (
        !(Number.isInteger(min) && Number.isInteger(max)) ||
        min <= 0 ||
        max <= 0 ||
        min > max
    ) {
        throw new Error(
            `The min and max srcset widths can only be passed positive Number values, and min must be less than max. Found min: ${min} and max: ${max}.`
        )
    }
}

export const validateVariableQualities = (variableQualities: SrcsetOptions['variableQualities']) => {
    if (typeof variableQualities !== 'object') {
        throw new Error('The variableQualities argument can only be an object')
    }
}

export const validateWidths = (customWidths: NonNullable<SrcsetOptions['widths']>) => {
    if (!Array.isArray(customWidths) || !customWidths.length) {
        throw new Error(
            'The widths argument can only be passed a valid non-empty array of integers'
        )
    } else {
        const isAllPositiveIntegers = customWidths.every((width) => {
            return Number.isInteger(width) && width > 0
        })

        if (!isAllPositiveIntegers) {
            throw new Error(
                'A custom widths argument can only contain positive integer values'
            )
        }
    }
}

export const validateWidthTolerance = (
    widthTolerance: NonNullable<SrcsetOptions['widthTolerance']>
) => {
    if (typeof widthTolerance !== 'number' || widthTolerance < 0.01) {
        throw new Error(
            'The srcset widthTolerance must be a number greater than or equal to 0.01'
        )
    }
}
