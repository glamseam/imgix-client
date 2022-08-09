import { parseURL, withoutTrailingSlash } from 'ufo'
import {
    DEFAULT_MIN_SRCSET_WIDTH,
    DEFAULT_MAX_SRCSET_WIDTH,
    DEFAULT_SRCSET_WIDTH_TOLERANCE,
    DEFAULT_IS_VARIABLE_QUALITY
} from './constants'
import {
    validateAndDestructureOptions,
    validateRange,
    validateWidths,
    validateWidthTolerance
} from './validators'
import type {
    ClientOptions,
    SrcSetOptions
} from './types'

export const extractUrl = (url: ClientOptions['imgixUrl']) => {
    return parseURL(withoutTrailingSlash(url))
}

export const sanitizeIsVariableQuality = (isVariableQuality: SrcSetOptions['isVariableQuality']) => {
    if (isVariableQuality && typeof isVariableQuality === 'boolean') {
        return isVariableQuality
    }

    return DEFAULT_IS_VARIABLE_QUALITY
}

export const sanitizePath = (path: string, isPathEncoding: boolean) => {
    // Strip leading slash first (we'll re-add after encoding)
    let _path = path.replace(/^\//, '')

    if (isPathEncoding) {
        if (/^https?:\/\//.test(_path)) {
            // Use de/encodeURIComponent to ensure *all* characters are handled,
            // since it's being used as a path
            _path = encodeURIComponent(_path)
        } else {
            // Use de/encodeURI if we think the path is just a path,
            // so it leaves legal characters like '/' and '@' alone
            _path = encodeURI(_path).replace(/[#?:+]/g, encodeURIComponent)
        }
    }

    return '/' + _path
}

const genResolutions = (
    minWidth = DEFAULT_MIN_SRCSET_WIDTH,
    maxWidth = DEFAULT_MAX_SRCSET_WIDTH,
    widthTolerance = DEFAULT_SRCSET_WIDTH_TOLERANCE
) => {
    const minW = Math.floor(minWidth)
    const maxW = Math.floor(maxWidth)
    validateRange(minWidth, maxWidth)
    validateWidthTolerance(widthTolerance)


    if (minW === maxW) {
        return [minW]
    }

    const resolutions = []
    let currentWidth = minW
    while (currentWidth < maxW) {
        // While the currentWidth is less than the maxW, push the rounded
        // width onto the list of resolutions.
        resolutions.push(Math.round(currentWidth))
        currentWidth *= 1 + widthTolerance * 2
    }

    // At this point, the last width in resolutions is less than the
    // currentWidth that caused the loop to terminate. This terminating
    // currentWidth is greater than or equal to the maxW. We want to
    // to stop at maxW, so we make sure our maxW is larger than the last
    // width in resolutions before pushing it (if it's equal we're done).
    if (resolutions[resolutions.length - 1] < maxW) {
        resolutions.push(maxW)
    }

    return resolutions
}

export const getSrcSetWidths = (srcSetOptions: SrcSetOptions) => {
    if (srcSetOptions.widths) {
        validateWidths(srcSetOptions.widths)

        return srcSetOptions.widths
    }

    const { widthTolerance, minWidth, maxWidth } =
        validateAndDestructureOptions(srcSetOptions)

    return genResolutions(minWidth, maxWidth, widthTolerance)
}
