import { DeviceEventEmitter, NativeModules } from 'react-native'

export default class FSWatcher {

  static KEY_ACCESS = NativeModules.FSWatcher.ACCESS
  static KEY_ATTRIB = NativeModules.FSWatcher.ATTRIB
  static KEY_CLOSE_NOWRITE = NativeModules.FSWatcher.CLOSE_NOWRITE
  static KEY_CLOSE_WRITE = NativeModules.FSWatcher.CLOSE_WRITE
  static KEY_CREATE = NativeModules.FSWatcher.CREATE
  static KEY_DELETE = NativeModules.FSWatcher.DELETE
  static KEY_DELETE_SELF = NativeModules.FSWatcher.DELETE_SELF
  static KEY_MODIFY = NativeModules.FSWatcher.MODIFY
  static KEY_MOVE_SELF = NativeModules.FSWatcher.MOVE_SELF
  static KEY_MOVED_FROM = NativeModules.FSWatcher.MOVED_FROM
  static KEY_MOVED_TO = NativeModules.FSWatcher.MOVED_TO
  static KEY_OPEN = NativeModules.FSWatcher.OPEN

  static async scanFile (paths) {
    return await NativeModules.FSWatcher.scanFile(paths)
  }

  static addToWatching (filePath) {
    NativeModules.FSWatcher.addToWatching(filePath)
  }

  static removeFromWatching (filePath) {
    NativeModules.FSWatcher.removeFromWatching(filePath)
  }

  static addListener (func) {
    return DeviceEventEmitter.addListener(NativeModules.FSWatcher.ON_FILE_EVENT, func)
  }

  static removeListener (func) {
    return DeviceEventEmitter.removeListener(NativeModules.FSWatcher.ON_FILE_EVENT, func)
  }
}