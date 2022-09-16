import { Md5 } from '@d-gs/md5'
import {
    parseURL,
    withoutTrailingSlash,
    withLeadingSlash,
    withoutLeadingSlash
} from 'ufo'
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
    Client,
    SrcsetOptions
} from './types'

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

export const getSrcsetWidths = (srcsetOptions: SrcsetOptions | undefined) => {
    if (srcsetOptions?.widths) {
        validateWidths(srcsetOptions.widths)

        return srcsetOptions.widths
    }

    const { widthTolerance, minWidth, maxWidth } =
        validateAndDestructureOptions(srcsetOptions)

    return genResolutions(minWidth, maxWidth, widthTolerance)
}

export const sanitizeUseVariableQuality = (useVariableQuality: SrcsetOptions['useVariableQuality']) => {
    if (useVariableQuality && typeof useVariableQuality === 'boolean') {
        return useVariableQuality
    }

    return DEFAULT_IS_VARIABLE_QUALITY
}

export const sanitizePath = (path: string, isPathEncoding: boolean | undefined) => {
    const sanitizedPath = withLeadingSlash(path)

    if (!isPathEncoding) {
        return sanitizedPath
    }

    if (/^https?:\/\//.test(sanitizedPath)) {
        // Use de/encodeURIComponent to ensure *all* characters are handled,
        // since it's being used as a path
        return encodeURIComponent(sanitizedPath)
    }

    // Use de/encodeURI if we think the path is just a path,
    // so it leaves legal characters like '/' and '@' alone
    return encodeURI(sanitizedPath).replace(/[#?:+]/g, encodeURIComponent)
}

export const sanitizeUrl = (url: Client['url']) => {
    const { protocol, host, pathname } = parseURL(withoutTrailingSlash(url))

    if (!protocol || !host) {
        throw new Error('buildURL: URL must match "https?://{host}/{path}"')
    }

    return `${protocol}//${host}${pathname}`
}

export const signParams = (token: string | undefined, path: string, queryParams: string) => {
    if (token) {
        const signatureBase = token + path + queryParams
        const md5 = new Md5()
        const signature = md5.appendStr(signatureBase).end()

        return `${queryParams.length > 0 ? '&s=' : '?s=' }${signature}`
    }

    return ''
}
