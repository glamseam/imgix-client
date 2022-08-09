import { Base64 } from 'js-base64'
import {
    DEFAULT_DPRS,
    DEFAULT_DPR_QUALITIES
} from './constants'
import {
    getSrcSetWidths,
    sanitizeIsVariableQuality,
    sanitizePath,
    sanitizeUrl
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
    imgixParams?: ImgixParams,
    isPathEncoding?: boolean
) => {
    const url = sanitizeUrl(imgixUrl)
    const path = sanitizePath(imgPath, isPathEncoding)
    const params = buildParams(imgixParams)

    return `${url}${path}${params}`
}

export const buildSrcSet = (
    imgixUrl: ClientOptions['imgixUrl'],
    imgPath: string,
    imgixParams?: ImgixParams,
    srcSetOptions?: SrcSetOptions,
    isPathEncoding?: boolean
) => {
    const w = imgixParams?.w
    const h = imgixParams?.h

    if (w || h) {
        return buildSrcSetDpr(
            imgixUrl,
            imgPath,
            imgixParams,
            srcSetOptions,
            isPathEncoding
        )
    }

    return buildSrcSetPairs(
        imgixUrl,
        imgPath,
        imgixParams,
        srcSetOptions,
        isPathEncoding
    )
}

export const buildUrlObject = (
    imgixUrl: ClientOptions['imgixUrl'],
    imgPath: string,
    imgixParams?: ImgixParams,
    srcSetOptions?: SrcSetOptions,
    isPathEncoding?: boolean
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

export const buildParams = (imgixParams: ImgixParams | undefined) => {
    if (imgixParams) {
        const queryParams: string[] = []

        for (const key of Object.keys(imgixParams)) {
            if (imgixParams[key]) {
                const arrayToString = (value: string | string[] | number | number[]) => {
                    if (Array.isArray(value)) {
                        return value.join(',')
                    }

                    return value.toString()
                }

                const encodedKey = encodeURIComponent(key)
                const encodedValue =
                    key.slice(-2) === '64'
                        ? Base64.encodeURI(arrayToString(imgixParams[key]))
                        : encodeURIComponent(arrayToString(imgixParams[key]))

                queryParams.push(`${encodedKey}=${encodedValue}`)
            }
        }

        return `${queryParams.length > 0 ? '?' : ''}${queryParams.join('&')}`
    }

    return ''
}

export const buildSrcSetPairs = (
    imgixUrl: ClientOptions['imgixUrl'],
    imgPath: string,
    imgixParams?: ImgixParams,
    srcSetOptions?: SrcSetOptions,
    isPathEncoding?: boolean
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
    imgixParams?: ImgixParams,
    srcSetOptions?: SrcSetOptions,
    isPathEncoding?: boolean
) => {
    const targetRatios = srcSetOptions?.devicePixelRatios ?? DEFAULT_DPRS
    validateDevicePixelRatios(targetRatios)

    const isVariableQuality = sanitizeIsVariableQuality(srcSetOptions?.isVariableQuality)

    if (srcSetOptions?.variableQualities) {
        validateVariableQualities(srcSetOptions.variableQualities)
    }

    const qualities = { ...DEFAULT_DPR_QUALITIES, ...srcSetOptions?.variableQualities }

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
