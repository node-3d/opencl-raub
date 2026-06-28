import '@node-3d/segfault';
import type { TErrorConstantName, TNumericConstantName } from './constant-names.ts';
/**
 * Common CL object holder, wraps C++ OpenCL pointers for JS.
*/
export type TClObject = {
    /**
     * This property allows direct access to underlying OpenCL primitive (void* pointer).
     * It may be used to extract the pointer and reuse it in another C++ addon.
     * Although unlikely necessary, but still a possible use case.
    */
    _: number;
};
export type TClPlatform = TClObject & {
    __brand: "cl_platform_id";
};
export type TClDevice = TClObject & {
    __brand: "cl_device_id";
};
export type TClContext = TClObject & {
    __brand: "cl_context";
};
export type TClProgram = TClObject & {
    __brand: "cl_program";
};
export type TClKernel = TClObject & {
    __brand: "cl_kernel";
};
export type TClMem = TClObject & {
    __brand: "cl_mem";
};
export type TClSampler = TClObject & {
    __brand: "cl_sampler";
};
export type TClQueue = TClObject & {
    __brand: "cl_command_queue";
};
export type TClEvent = TClObject & {
    __brand: "cl_event";
};
export type TClEventOrVoid = TClEvent | undefined;
export type TClHostData = ArrayBuffer | ArrayBufferView | Buffer;
export type TClImageFormat = {
    channel_order?: number;
    channel_data_type?: number;
};
export type TClImageDesc = {
    type?: number;
    width?: number;
    height?: number;
    depth?: number;
    array_size?: number;
    row_pitch?: number;
    slice_pitch?: number;
    buffer?: TClMem | null;
};
export type TClSubBufferInfo = {
    origin: number;
    size: number;
};
export type TBuildProgramCb = (program: TClProgram, userData: unknown) => void;
export type TWrapper = TClObject & {
    toString: () => string;
    valueOf: () => number;
};
export type TWrapperConstructor = {
    readonly prototype: TWrapper;
};
type TNative = Readonly<{
    Wrapper: TWrapperConstructor;
    createProgram: (context: TClContext, source: string) => TClProgram;
    createKernel: (program: TClProgram, name: string) => TClKernel;
    createKernelsInProgram: (program: TClProgram) => TClKernel[];
    retainKernel: (kernel: TClKernel) => void;
    releaseKernel: (kernel: TClKernel) => void;
    setKernelArg: (kernel: TClKernel, argIdx: number, argType: string | null, value: unknown) => number;
    getKernelInfo: (kernel: TClKernel, paramName: number) => (string | number | TClContext | TClProgram);
    getKernelArgInfo: (kernel: TClKernel, argIdx: number, paramName: number) => (string | number);
    getKernelWorkGroupInfo: (kernel: TClKernel, device: TClDevice, paramName: number) => (number | number[]);
    createBuffer: (context: TClContext, flags: number, size: number, buffer?: TClHostData | null) => TClMem;
    createSubBuffer: (mem: TClMem, flags: number, origin: number, size: number) => TClMem;
    createImage: (context: TClContext, flags: number, format: TClImageFormat, desc: TClImageDesc, host?: TClHostData | null) => TClMem;
    retainMemObject: (mem: TClMem) => void;
    releaseMemObject: (mem: TClMem) => void;
    getSupportedImageFormats: (context: TClContext, flags: number, imageType: number) => TClImageFormat[];
    getMemObjectInfo: (mem: TClMem, paramName: number) => (number | TClMem | TClContext | ArrayBuffer | null);
    getImageInfo: (mem: TClMem, paramName: number) => (number | TClMem);
    createFromGLBuffer: (context: TClContext, flags: number, vboId: number) => TClMem;
    createFromGLRenderbuffer: (context: TClContext, flags: number, rboId: number) => TClMem;
    createFromGLTexture: (context: TClContext, flags: number, target: number, mip: number, vboId: number) => TClMem;
    getPlatformIDs: () => TClPlatform[];
    getPlatformInfo: (platform: TClPlatform, paramName: number) => string;
    createProgramWithSource: (context: TClContext, source: string) => TClProgram;
    createProgramWithBinary: (context: TClContext, devices: TClDevice[], binaries: TClHostData[]) => TClProgram;
    createProgramWithBuiltInKernels: (context: TClContext, devices: TClDevice[], names: string[]) => TClProgram;
    retainProgram: (program: TClProgram) => void;
    releaseProgram: (program: TClProgram) => void;
    buildProgram: (program: TClProgram, devices?: TClDevice[] | null, options?: string | null, cb?: TBuildProgramCb | null, userData?: unknown) => void;
    compileProgram: (program: TClProgram, devices?: TClDevice[] | null, options?: string | null, headers?: TClProgram[] | null, names?: string[] | null, cb?: TBuildProgramCb | null, userData?: unknown) => void;
    linkProgram: (context: TClContext, devices?: TClDevice[] | null, options?: string | null, programs?: TClProgram[], cb?: TBuildProgramCb | null, userData?: unknown) => TClProgram;
    unloadPlatformCompiler: (platform: TClPlatform) => void;
    getProgramInfo: (program: TClProgram, paramName: number) => (number | TClContext | TClDevice[] | number[] | ArrayBuffer[] | string);
    getProgramBuildInfo: (program: TClProgram, device: TClDevice, paramName: number) => (number | string);
    createSampler: (context: TClContext, normalized: boolean | number, addressingMode: number, filterMode: number) => TClSampler;
    retainSampler: (sampler: TClSampler) => void;
    releaseSampler: (sampler: TClSampler) => void;
    getSamplerInfo: (sampler: TClSampler, paramName: number) => (number | boolean | TClContext);
    createCommandQueue: (context: TClContext, device: TClDevice, properties?: number | null) => TClQueue;
    retainCommandQueue: (queue: TClQueue) => void;
    releaseCommandQueue: (queue: TClQueue) => void;
    getCommandQueueInfo: (queue: TClQueue, paramName: number) => (TClContext | TClDevice | number);
    flush: (queue: TClQueue) => void;
    finish: (queue: TClQueue) => void;
    enqueueReadBuffer: (queue: TClQueue, buffer: TClMem, blockingRead: boolean, offset: number, size: number, host: TClHostData, waitList?: TClEvent[] | null, hasEvent?: boolean) => TClEventOrVoid;
    enqueueReadBufferRect: (queue: TClQueue, buffer: TClMem, blockingRead: boolean, bufferOffset: number[], hostOffset: number[], region: number[], bufferRowPitch: number, bufferSlicePitch: number, hostRowPitch: number, hostSlicePitch: number, host: TClHostData, waitList?: TClEvent[] | null, hasEvent?: boolean) => TClEventOrVoid;
    enqueueWriteBuffer: (queue: TClQueue, buffer: TClMem, blockingWrite: boolean, offset: number, size: number, host: TClHostData, waitList?: TClEvent[] | null, hasEvent?: boolean) => TClEventOrVoid;
    enqueueWriteBufferRect: (queue: TClQueue, buffer: TClMem, blockingWrite: boolean, bufferOffsets: number[], hostOffsets: number[], regions: number[], bufferRowPitch: number, bufferSlicePitch: number, hostRowPitch: number, hostSlicePitch: number, host: TClHostData, waitList?: TClEvent[] | null, hasEvent?: boolean) => TClEventOrVoid;
    enqueueCopyBuffer: (queue: TClQueue, src: TClMem, dest: TClMem, srcOffset: number, destOfset: number, size: number, waitList?: TClEvent[] | null, hasEvent?: boolean) => TClEventOrVoid;
    enqueueCopyBufferRect: (queue: TClQueue, src: TClMem, dest: TClMem, srcOrigins: number[], destOrigins: number[], regions: number[], srcRowPitch: number, srcSlicePitch: number, destRowPitch: number, destSlicePitch: number, waitList?: TClEvent[] | null, hasEvent?: boolean) => TClEventOrVoid;
    enqueueReadImage: (queue: TClQueue, image: TClMem, blockingRead: boolean, srcOrigins: number[], regions: number[], rowPitch: number, slicePitch: number, host: TClHostData, waitList?: TClEvent[] | null, hasEvent?: boolean) => TClEventOrVoid;
    enqueueWriteImage: (queue: TClQueue, image: TClMem, blockingWrite: boolean, srcOrigins: number[], regions: number[], rowPitch: number, slicePitch: number, host: TClHostData, waitList?: TClEvent[] | null, hasEvent?: boolean) => TClEventOrVoid;
    enqueueCopyImage: (queue: TClQueue, src: TClMem, dest: TClMem, srcOrigins: number[], destOrigins: number[], regions: number[], waitList?: TClEvent[] | null, hasEvent?: boolean) => TClEventOrVoid;
    enqueueCopyImageToBuffer: (queue: TClQueue, src: TClMem, dest: TClMem, srcOrigins: number[], regions: number[], destOffset: number, waitList?: TClEvent[] | null, hasEvent?: boolean) => TClEventOrVoid;
    enqueueCopyBufferToImage: (queue: TClQueue, src: TClMem, dest: TClMem, srcOffset: number, destOrigins: number[], regions: number[], waitList?: TClEvent[] | null, hasEvent?: boolean) => TClEventOrVoid;
    enqueueMapBuffer: (queue: TClQueue, mem: TClMem, blockingMap: boolean, mapFlags: number, offset: number, size: number, waitList?: TClEvent[] | null) => Readonly<{
        buffer: ArrayBuffer;
        event: TClEvent | null;
    }>;
    enqueueMapImage: (queue: TClQueue, mem: TClMem, blockingMap: boolean, mapFlags: number, origins: number[], regions: number[], waitList?: TClEvent[] | null) => Readonly<{
        buffer: ArrayBuffer;
        event: TClEvent | null;
        image_row_pitch: number;
        image_slice_pitch: number;
    }>;
    enqueueUnmapMemObject: (queue: TClQueue, mem: TClMem, host: TClHostData, waitList?: TClEvent[] | null, hasEvent?: boolean) => TClEventOrVoid;
    enqueueNDRangeKernel: (queue: TClQueue, kernel: TClKernel, workDim: number, workOffset?: number[] | null, workGlobal?: number[] | null, workLocal?: number[] | null, waitList?: TClEvent[] | null, hasEvent?: boolean) => TClEventOrVoid;
    enqueueTask: (queue: TClQueue, kernel: TClKernel, waitList?: TClEvent[] | null, hasEvent?: boolean) => TClEventOrVoid;
    enqueueNativeKernel: () => TClEventOrVoid;
    enqueueMarker: (queue: TClQueue) => TClEvent;
    enqueueMarkerWithWaitList: (queue: TClQueue, waitList: TClEvent[]) => TClEvent;
    enqueueBarrierWithWaitList: (queue: TClQueue, waitList: TClEvent[], hasEvent?: boolean) => TClEventOrVoid;
    enqueueBarrier: (queue: TClQueue) => TClEventOrVoid;
    enqueueFillBuffer: (queue: TClQueue, buffer: TClMem, pattern: number | TClHostData, offset: number, size: number, waitList?: TClEvent[] | null, hasEvent?: boolean) => TClEventOrVoid;
    enqueueFillImage: (queue: TClQueue, image: TClMem, host: TClHostData, srcOrigins: number[], regions: number[], waitList?: TClEvent[] | null, hasEvent?: boolean) => TClEventOrVoid;
    enqueueMigrateMemObjects: (queue: TClQueue, objectt: TClMem[], flags: number, waitList?: TClEvent[] | null, hasEvent?: boolean) => TClEventOrVoid;
    enqueueAcquireGLObjects: (queue: TClQueue, mem: TClMem, waitList?: TClEvent[] | null, hasEvent?: boolean) => TClEventOrVoid;
    enqueueReleaseGLObjects: (queue: TClQueue, mem: TClMem, waitList?: TClEvent[] | null, hasEvent?: boolean) => TClEventOrVoid;
    createContext: (properties: (number | TClPlatform)[] | null, devices: TClDevice[]) => TClContext;
    createContextFromType: (properties: (number | TClPlatform)[] | null, deviceType: number) => TClContext;
    retainContext: (context: TClContext) => void;
    releaseContext: (context: TClContext) => void;
    getContextInfo: (context: TClContext, paramName: number) => TClDevice[] | number | number[] | TClPlatform[];
    getDeviceIDs: (platform: TClPlatform, deviceType?: number) => TClDevice[];
    getDeviceInfo: (device: TClDevice, paramName: number) => string | number | boolean | TClPlatform | number[] | null;
    createSubDevices: (device: TClDevice, properties: number[]) => TClDevice[];
    retainDevice: (device: TClDevice) => void;
    releaseDevice: (device: TClDevice) => void;
    waitForEvents: (waitList: TClEvent[]) => void;
    getEventInfo: (event: TClEvent, paramName: number) => (TClQueue | TClContext | number);
    createUserEvent: (context: TClContext) => TClEvent;
    retainEvent: (event: TClEvent) => void;
    releaseEvent: (event: TClEvent) => void;
    setUserEventStatus: (event: TClEvent, status: number) => void;
    setEventCallback: (event: TClEvent, statusType: number, cb: (event: TClEvent, status: number, userData: unknown) => void, userData?: unknown) => void;
    getEventProfilingInfo: (event: TClEvent, paramName: number) => number;
}> & Readonly<Record<TNumericConstantName, number>> & Readonly<Record<TErrorConstantName, Error>>;
export declare const native: TNative;
export {};
