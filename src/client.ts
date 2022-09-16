import { Base64 } from 'js-base64'
import {
    DEFAULT_DPRS,
    DEFAULT_DPR_QUALITIES
} from './constants'
import {
    getSrcsetWidths,
    sanitizeUseVariableQuality,
    sanitizePath,
    sanitizeUrl,
    signParams
} from './utils'
import {
    validateDevicePixelRatios,
    validateVariableQualities
} from './validators'
import type {
    Client,
    ImgixParams,
    ImgixTextParams,
    SrcsetOptions
} from './types'

export const buildText = (
    text: string,
    client: Client,
    imgixTextParams?: ImgixTextParams
) => {
    const url = sanitizeUrl(client.url)
    const path = '/~text'
    const params = buildParams({
        ...imgixTextParams,
        txt64: text
    })
    const signedParams = signParams(client.secureUrlToken, path, params)

    return `${url}${path}${params}${signedParams}`
}

export const buildUrl = (
    client: Client,
    imgPath: string,
    imgixParams?: ImgixParams,
    isPathEncoding?: boolean
) => {
    const url = sanitizeUrl(client.url)
    const path = sanitizePath(imgPath, isPathEncoding)
    const params = buildParams(imgixParams)
    const signedParams = signParams(client.secureUrlToken, path, params)

    return `${url}${path}${params}${signedParams}`
}

export const buildSrcset = (
    client: Client,
    imgPath: string,
    imgixParams?: ImgixParams,
    srcsetOptions?: SrcsetOptions,
    isPathEncoding?: boolean
) => {
    const w = imgixParams?.w
    const h = imgixParams?.h

    if (w || h) {
        return buildSrcsetDpr(
            client,
            imgPath,
            imgixParams,
            srcsetOptions,
            isPathEncoding
        )
    }

    return buildSrcsetPairs(
        client,
        imgPath,
        imgixParams,
        srcsetOptions,
        isPathEncoding
    )
}

export const buildUrlObject = (
    client: Client,
    imgPath: string,
    imgixParams?: ImgixParams,
    srcsetOptions?: SrcsetOptions,
    isPathEncoding?: boolean
) => {
    const src = buildUrl(
        client,
        imgPath,
        imgixParams,
        isPathEncoding
    )

    const srcset = buildSrcset(
        client,
        imgPath,
        imgixParams,
        srcsetOptions,
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
                        ? toBase64Url(arrayToString(imgixParams[key]))
                        : encodeURIComponent(arrayToString(imgixParams[key]))

                queryParams.push(`${encodedKey}=${encodedValue}`)
            }
        }

        return `${queryParams.length > 0 ? '?' : ''}${queryParams.join('&')}`
    }

    return ''
}

export const buildSrcsetPairs = (
    client: Client,
    imgPath: string,
    imgixParams?: ImgixParams,
    srcsetOptions?: SrcsetOptions,
    isPathEncoding?: boolean
) => {
    const srcsetWidths = getSrcsetWidths(srcsetOptions)

    const srcset = srcsetWidths.map((w) =>
        `${buildUrl(
            client,
            imgPath,
            { ...imgixParams, w },
            isPathEncoding
        )} ${w}w`
    )

    return srcset.join(',\n')
}

export const buildSrcsetDpr = (
    client: Client,
    imgPath: string,
    imgixParams?: ImgixParams,
    srcsetOptions?: SrcsetOptions,
    isPathEncoding?: boolean
) => {
    const targetRatios = srcsetOptions?.devicePixelRatios ?? DEFAULT_DPRS
    validateDevicePixelRatios(targetRatios)

    const useVariableQuality = sanitizeUseVariableQuality(srcsetOptions?.useVariableQuality)

    if (srcsetOptions?.variableQualities) {
        validateVariableQualities(srcsetOptions.variableQualities)
    }

    const qualities = { ...DEFAULT_DPR_QUALITIES, ...srcsetOptions?.variableQualities }

    const srcset = targetRatios.map((dpr) =>
        `${buildUrl(
            client,
            imgPath,
            {
                dpr,
                q: useVariableQuality ? qualities[dpr] : undefined,
                ...imgixParams
            },
            isPathEncoding
        )} ${dpr}x`
    )

    return srcset.join(',\n')
}

export const toBase64Url = (str: string) => {
    return Base64.encodeURI(str)
}
