import type { DevicePixelRatio, VariableQualities } from './types'

// minimum generated srcset width
export const DEFAULT_MIN_SRCSET_WIDTH = 96

// maximum generated srcset width
export const DEFAULT_MAX_SRCSET_WIDTH = 1920

// default tolerable percent difference between srcset pair widths
export const DEFAULT_SRCSET_WIDTH_TOLERANCE = 0.16

// default quality parameter values mapped by each dpr srcset entry
export const DEFAULT_DPR_QUALITIES: VariableQualities= {
    1: 75,
    1.5: 62,
    2: 50,
    2.5: 43,
    3: 35,
    3.5: 30,
    4: 23,
    4.5: 22,
    5: 20
}

export const DEFAULT_IS_VARIABLE_QUALITY = false

export const DEFAULT_DPRS: DevicePixelRatio[] = [1, 1.5, 2, 2.5, 3]
