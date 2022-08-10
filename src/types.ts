export interface ClientOptions {
    imgixUrl: string
    secureURLToken?: string
}

export type DevicePixelRatio =
    | 1
    | 1.5
    | 2
    | 2.5
    | 3
    | 3.5
    | 4
    | 4.5
    | 5

export type VariableQualities = { [key in DevicePixelRatio]?: number }

export interface SrcsetOptions {
    widths?: number[]
    widthTolerance?: number  // 0 ~ 1
    minWidth?: number
    maxWidth?: number  // max 8192
    devicePixelRatios?: DevicePixelRatio[]
    variableQualities?: VariableQualities
    isVariableQuality?: boolean
}


// see 'https://docs.imgix.com/apis/rendering'
// see 'https://github.com/imgix/imgix-url-params/blob/master/dist/parameters.js'

interface AdjustmentParams {
    bri?: number
    con?: number
    exp?: number
    gam?: number
    high?: number
    hue?: number
    invert?: boolean
    sat?: number
    shad?: number
    sharp?: number
    usm?: number
    usmrad?: number
    vib?: number
}

interface AutomaticParams {
    auto?: string | Array<'compress' | 'enhance' | 'format' | 'redeye'>
}

interface BlendingParams {
    blend?: string
    blend64?: string
    'blend-align'?: string | Array<'top' | 'middle' | 'bottom' | 'left' | 'center' | 'right'>
    'blend-alpha'?: number
    'blend-color'?: string  // hex value
    'blend-crop'?: 'top' | 'bottom' | 'left' | 'right' | 'faces'
    'blend-fit'?: 'clamp' | 'clip' | 'crop' | 'max' | 'scale'
    'blend-h'?: number
    'blend-mode'?:
        | 'burn'
        | 'color'
        | 'darken'
        | 'difference'
        | 'dodge'
        | 'exclusion'
        | 'hardlight'
        | 'hue'
        | 'lighten'
        | 'luminosity'
        | 'multiply'
        | 'normal'
        | 'overlay'
        | 'saturation'
        | 'screen'
        | 'softlight'

    'blend-pad'?: number
    'blend-size'?: 'inherit'
    'blend-w'?: number
    'blend-x'?: number
    'blend-y'?: number
}

interface BorderAndPaddingParams {
    border?: string
    'border-bottom'?: number
    'border-left'?: number
    'border-right'?: number
    'border-top'?: number
    'border-radius-inner'?: string
    'border-radius'?: string
    pad?: string
    'pad-bottom'?: number
    'pad-left'?: number
    'pad-right'?: number
    'pad-top'?: number
}

interface ColorPaletteParams {
    colors?: number
    palette?: 'css' | 'json'
    prefix?: string
}

interface ExpirationParams {
    expires?: number  // timestamp
}

interface FaceDetectionParams {
    faceindex?: number
    facepad?: number
    faces?: number
}

interface FillParams {
    bg?: string  // hex
    'fill-color'?: string  // hex
    fill?: 'blur' | 'solid'
    'grid-colors'?: string  // hex
    'grid-size'?: number
    transparency?: 'grid'
}

interface FocalPointCropParams {
    'fp-debug'?: boolean
    'fp-x'?: number
    'fp-y'?: number
    'fp-z'?: number
}

interface FormatParams {
    ch?: 'width' | 'dpr' | 'save-data'
    chromasub?: 444 | 422 | 420
    colorquant?: number  // 2 ~ 256
    cs?: 'srgb' | 'adobergb1998' | 'tinysrgb' | 'strip'
    dl?: string
    dpi?: number
    fm?:
        | 'gif'
        | 'jpg'
        | 'jp2'
        | 'json'
        | 'jxr'
        | 'pjpg'
        | 'mp4'
        | 'png'
        | 'png8'
        | 'png32'
        | 'webp'
        | 'webm'
        | 'blurhash'
        | 'avif'
    iptc?: 'allow' | 'block'
    lossless?: 0 | 1 | boolean
    q?: number
}

interface MaskImageParams {
    'corner-radius'?: string
    'mask-bg'?: string  // hex
    mask?: 'ellipse' | 'corners'
}

interface NoiseReductionParams {
    nr?: number  // -100 ~ 100
    nrs?: number  // -100 ~ 100
}

interface PDFParams {
    page?: number
    'pdf-annotation'?: 0 | 1 | boolean
}

interface PixelDensityParams {
    dpr?: DevicePixelRatio
}

interface RotationParams {
    flip?: 'h' | 'v' | 'hv'
    orient?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 90 | 180 | 270
    rot?: number  // 0 ~ 359
}

interface SizeParams {
    ar?: string  // w:h
    crop?: 'top' | 'bottom' | 'left' | 'right' | 'faces' | 'focalpoint' | 'edges' | 'entropy'
    fit?: 'clamp' | 'clip' | 'crop' | 'facearea' | 'fill' | 'fillmax' | 'max' | 'min' | 'scale'
    h?: number  // 2 ~ 8192
    'max-h'?: number  // 2 ~ 8192
    'max-w'?: number  // 2 ~ 8192
    'min-h'?: number  // 2 ~ 8192
    'min-w'?: number  // 2 ~ 8192
    rect?: string
    w?: number  // 2 ~ 8192
}

interface StylizeParams {
    blur?: number  // 0 ~ 2000
    duotone?: string  // hex x 2
    'duotone-alpha'?: number
    htn?: number  // 0 ~ 100
    monochrome?: string  // hex
    px?: number  // 0 ~ 100
    sepia?: number  // 0 ~ 100
}

interface TextParams {
    txt?: string
    txt64?: string
    'txt-align'?: string | Array<'top' | 'middle' | 'bottom' | 'left' | 'center' | 'right'>
    'txt-clip'?: string | Array<'start' | 'middle' | 'end' | 'ellipsis'>
    'txt-color'?: string  // hex
    'txt-fit'?: 'max'
    'txt-font'?: string
    'txt-font64'?: string
    'txt-lig'?: 0 | 1 | 2
    'txt-line-color'?: string  // hex
    'txt-line'?: number
    'txt-pad'?: number  // default: 12
    'txt-shad'?: number  // 0 ~ 10
    'txt-size'?: number  // default: 12
    'txt-width'?: number
    'txt-x'?: number
    'txt-y'?: number
}

interface TrimParams {
    trim?: 'auto' | 'color'
    'trim-color'?: string  // hex
    'trim-md'?: number  // default: 11
    'trim-pad'?: number
    'trim-sd'?: number  // default: 10
    'trim-tol'?: number  // default: 0
}

interface TypesettingEndpointParams {
    'txt-lead'?: number  // default: 0
    'txt-track'?: number  // default: 0
    '~text'?: string  // ??
}

interface WatermarkParams {
    mark?: string  // url
    mark64?: string
    'mark-align'?: string | Array<'top' | 'middle' | 'bottom' | 'left' | 'center' | 'right'>
    'mark-alpha'?: number  // 0 ~ 100
    'mark-base'?: string  // url
    'mark-fit'?: 'clamp' | 'clip' | 'crop' | 'max' | 'scale'  // default: 'clip'
    'mark-h'?: number  // 0 ~ 2000
    'mark-pad'?: number
    'mark-rot'?: number  // 0 ~ 359
    'mark-scale'?: number  // 0 ~ 100
    'mark-tile'?: 'grid'
    'mark-w'?: number  // 0 ~ 2000
    'mark-x'?: number
    'mark-y'?: number
}

export type ImgixParams =
    AdjustmentParams &
    AutomaticParams &
    BlendingParams &
    BorderAndPaddingParams &
    ColorPaletteParams &
    ExpirationParams &
    FaceDetectionParams &
    FillParams &
    FocalPointCropParams &
    FormatParams &
    MaskImageParams &
    NoiseReductionParams &
    PDFParams &
    PixelDensityParams &
    RotationParams &
    SizeParams &
    StylizeParams &
    TextParams &
    TrimParams &
    TypesettingEndpointParams &
    WatermarkParams

export interface AttributeConfig {
    src: string
    srcset: string
    sizes: string
}
