import { Base64 } from 'js-base64'
import {
    DEFAULT_DPRS,
    DEFAULT_DPR_QUALITIES
} from './constants'
import {
    extractUrl,
    getSrcSetWidths,
    sanitizeIsVariableQuality,
    sanitizePath
} from './utils'
import {
    validateDevicePixelRatios,
    validateVariableQualities
} from './validators'
import type {
    ClientOptions,
    ImgixParams,
    SrcSetOptions
} from './types'

export const buildUrl = (
    imgixUrl: ClientOptions['imgixUrl'],
    imgPath: string,
    imgixParams: ImgixParams,
    isPathEncoding: boolean
) => {
    const { protocol, host, pathname } = extractUrl(imgixUrl)

    if (!protocol || !host) {
        throw new Error('buildURL: URL must match {protocol}//{host}{pathname}')
    }

    const path = sanitizePath(imgPath, isPathEncoding)
    const params = buildParams(imgixParams)

    return `${protocol}//${host}${pathname}${path}${params}`
}

export const buildSrcSet = (
    imgixUrl: ClientOptions['imgixUrl'],
    imgPath: string,
    imgixParams: ImgixParams,
    srcSetOptions: SrcSetOptions,
    isPathEncoding: boolean
) => {
    const { w, h } = imgixParams

    if (w || h) {
        return buildSrcSetDpr(
            imgixUrl,
            imgPath,
            imgixParams,
            srcSetOptions,
            isPathEncoding
        )
    } else {
        return buildSrcSetPairs(
            imgixUrl,
            imgPath,
            imgixParams,
            srcSetOptions,
            isPathEncoding
        )
    }
}

export const buildUrlObject = (
    imgixUrl: ClientOptions['imgixUrl'],
    imgPath: string,
    imgixParams: ImgixParams,
    srcSetOptions: SrcSetOptions,
    isPathEncoding: boolean
) => {
    const src = buildUrl(
        imgixUrl,
        imgPath,
        imgixParams,
        isPathEncoding
    )

    const srcset = buildSrcSet(
        imgixUrl,
        imgPath,
        imgixParams,
        srcSetOptions,
        isPathEncoding
    )

    return {
        src,
        srcset
    }
}

export const buildParams = (imgixParams: ImgixParams) => {
    const queryParams: string[] = []

    for (const key of Object.keys(imgixParams)) {
        if (imgixParams[key]) {
            const encodedKey = encodeURIComponent(key)
            const encodedValue =
                key.slice(-2) === '64'
                    ? Base64.encodeURI(imgixParams[key])
                    : encodeURIComponent(imgixParams[key])

            queryParams.push(`${encodedKey}=${encodedValue}`)
        }
    }

    return `${queryParams.length > 0 ? '?' : ''}${queryParams.join('&')}`
}

export const buildSrcSetPairs = (
    imgixUrl: ClientOptions['imgixUrl'],
    imgPath: string,
    imgixParams: ImgixParams,
    srcSetOptions: SrcSetOptions,
    isPathEncoding: boolean
) => {
    const srcSetWidths = getSrcSetWidths(srcSetOptions)

    const srcset = srcSetWidths.map((w) =>
        `${buildUrl(
            imgixUrl,
            imgPath,
            { ...imgixParams, w },
            isPathEncoding
        )} ${w}w`
    )

    return srcset.join(',\n')
}

export const buildSrcSetDpr = (
    imgixUrl: ClientOptions['imgixUrl'],
    imgPath: string,
    imgixParams: ImgixParams,
    srcSetOptions: SrcSetOptions,
    isPathEncoding: boolean
) => {
    const targetRatios = srcSetOptions.devicePixelRatios ?? DEFAULT_DPRS
    validateDevicePixelRatios(targetRatios)

    const isVariableQuality = sanitizeIsVariableQuality(srcSetOptions.isVariableQuality)

    if (srcSetOptions.variableQualities) {
        validateVariableQualities(srcSetOptions.variableQualities)
    }

    const qualities = { ...DEFAULT_DPR_QUALITIES, ...srcSetOptions.variableQualities }

    const srcset = targetRatios.map((dpr) =>
        `${buildUrl(
            imgixUrl,
            imgPath,
            {
                dpr,
                q: isVariableQuality ? qualities[dpr] : undefined,
                ...imgixParams
            },
            isPathEncoding
        )} ${dpr}x`
    )

    return srcset.join(',\n')
}
