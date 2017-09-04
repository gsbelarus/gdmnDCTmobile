package com.gsbelarus.fswatcher;

import android.media.MediaScannerConnection;
import android.net.Uri;
import android.os.Bundle;
import android.os.FileObserver;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import java.util.HashMap;
import java.util.Map;

import javax.annotation.Nullable;

public class FSWatcherModule extends ReactContextBaseJavaModule {

    private static final String ON_FILE_EVENT = "onFileEvent";

    private Map<String, FileObserver> fileObservers = new HashMap<>();

    public FSWatcherModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "FSWatcher";
    }

    @Nullable
    @Override
    public Map<String, Object> getConstants() {
        Map<String, Object> constants = new HashMap<>();

        constants.put("ON_FILE_EVENT", ON_FILE_EVENT);

        constants.put("ACCESS", FileObserver.ACCESS);
        constants.put("ATTRIB", FileObserver.ATTRIB);
        constants.put("CLOSE_NOWRITE", FileObserver.CLOSE_NOWRITE);
        constants.put("CLOSE_WRITE", FileObserver.CLOSE_WRITE);
        constants.put("CREATE", FileObserver.CREATE);
        constants.put("DELETE", FileObserver.DELETE);
        constants.put("DELETE_SELF", FileObserver.DELETE_SELF);
        constants.put("MODIFY", FileObserver.MODIFY);
        constants.put("MOVE_SELF", FileObserver.MOVE_SELF);
        constants.put("MOVED_FROM", FileObserver.MOVED_FROM);
        constants.put("MOVED_TO", FileObserver.MOVED_TO);
        constants.put("OPEN", FileObserver.OPEN);

        return constants;
    }

    @ReactMethod
    public void addToWatching(String filePath, Promise promise) {
        if (!fileObservers.containsKey(filePath)) {
            FileObserver fileObserver = new FileObserver(filePath) {
                @Override
                public void onEvent(int i, String s) {
                    if (s == null) return;
                    String event;
                    switch (i) {
                        case ACCESS:
                            event = "access";
                            break;
                        case ATTRIB:
                            event = "attrib";
                            break;
                        case CLOSE_NOWRITE:
                            event = "closeNoWrite";
                            break;
                        case CLOSE_WRITE:
                            event = "closeWrite";
                            break;
                        case CREATE:
                            event = "create";
                            break;
                        case DELETE:
                            event = "delete";
                            break;
                        case DELETE_SELF:
                            event = "deleteSelf";
                            break;
                        case MODIFY:
                            event = "modify";
                            break;
                        case MOVE_SELF:
                            event = "moveSelf";
                            break;
                        case MOVED_FROM:
                            event = "movedFrom";
                            break;
                        case MOVED_TO:
                            event = "movedTo";
                            break;
                        case OPEN:
                            event = "open";
                            break;
                        default:
                            event = "default(" + i + "): " + s;
                            break;
                    }
                    LogUtil.d(event, i, s);
                    Bundle bundle = new Bundle();
                    bundle.putInt("key", i);
                    bundle.putString("name", event);
                    bundle.putString("fileName", s);
                    sendEvent(ON_FILE_EVENT, Arguments.fromBundle(bundle));
                }
            };
            fileObservers.put(filePath, fileObserver);
            fileObserver.startWatching();
            promise.resolve(null);
        } else {
            promise.reject("1", "File path already exist");
        }
    }

    @ReactMethod
    public void removeFromWatching(String filePath, Promise promise) {
        if (fileObservers.remove(filePath) == null) {
            promise.reject("1", "File path is not registered");
        } else {
            promise.resolve(null);
        }
    }

    @ReactMethod
    public void scanFile(String path, final Promise promise) {
        MediaScannerConnection.scanFile(
                getReactApplicationContext(),
                new String[]{path},
                null,
                new MediaScannerConnection.OnScanCompletedListener() {
                    @Override
                    public void onScanCompleted(String s, Uri uri) {
                        promise.resolve(s);
                    }
                });
    }

    private void sendEvent(String eventName, @Nullable WritableMap params) {
        getReactApplicationContext()
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }
}
