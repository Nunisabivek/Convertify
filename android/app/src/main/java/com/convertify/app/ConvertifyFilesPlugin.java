package com.convertify.app;

import android.content.ContentResolver;
import android.content.ContentValues;
import android.content.Intent;
import android.database.Cursor;
import android.net.Uri;
import android.os.Build;
import android.os.Environment;
import android.provider.MediaStore;
import android.provider.OpenableColumns;
import android.webkit.MimeTypeMap;

import androidx.activity.result.ActivityResult;

import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.ActivityCallback;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.List;

/**
 * App-owned copies + MediaStore Downloads. WebView file:// sharing is never used.
 */
@CapacitorPlugin(name = "ConvertifyFiles")
public class ConvertifyFilesPlugin extends Plugin {

    @PluginMethod
    public void pickFiles(PluginCall call) {
        boolean multiple = Boolean.TRUE.equals(call.getBoolean("multiple", false));
        JSArray mimeTypes = call.getArray("mimeTypes");

        Intent intent = new Intent(Intent.ACTION_OPEN_DOCUMENT);
        intent.addCategory(Intent.CATEGORY_OPENABLE);
        intent.putExtra(Intent.EXTRA_ALLOW_MULTIPLE, multiple);
        intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
        intent.addFlags(Intent.FLAG_GRANT_PERSISTABLE_URI_PERMISSION);

        List<String> types = new ArrayList<>();
        if (mimeTypes != null) {
            for (int i = 0; i < mimeTypes.length(); i++) {
                try {
                    types.add(mimeTypes.getString(i));
                } catch (Exception ignored) {
                }
            }
        }
        if (types.size() == 1) {
            intent.setType(types.get(0));
        } else {
            intent.setType("*/*");
            if (!types.isEmpty()) {
                intent.putExtra(Intent.EXTRA_MIME_TYPES, types.toArray(new String[0]));
            }
        }

        startActivityForResult(call, intent, "onPickFilesResult");
    }

    @ActivityCallback
    private void onPickFilesResult(PluginCall call, ActivityResult result) {
        if (call == null) {
            return;
        }
        if (result.getResultCode() != android.app.Activity.RESULT_OK || result.getData() == null) {
            JSObject ret = new JSObject();
            ret.put("files", new JSArray());
            call.resolve(ret);
            return;
        }

        Intent data = result.getData();
        List<Uri> uris = new ArrayList<>();
        if (data.getClipData() != null) {
            for (int i = 0; i < data.getClipData().getItemCount(); i++) {
                uris.add(data.getClipData().getItemAt(i).getUri());
            }
        } else if (data.getData() != null) {
            uris.add(data.getData());
        }

        JSArray files = new JSArray();
        for (Uri uri : uris) {
            try {
                takePersistablePermission(uri);
                JSObject file = copyUriIntoApp(uri);
                if (file != null) {
                    files.put(file);
                }
            } catch (Exception e) {
                call.reject("Could not open that file. Try another file.");
                return;
            }
        }

        JSObject ret = new JSObject();
        ret.put("files", files);
        call.resolve(ret);
    }

    @PluginMethod
    public void saveToDownloads(PluginCall call) {
        String appPath = call.getString("appPath");
        String filename = call.getString("filename");
        String mime = call.getString("mime", "application/octet-stream");
        if (appPath == null || filename == null) {
            call.reject("Missing file");
            return;
        }

        File src = new File(getContext().getFilesDir(), appPath);
        if (!src.exists()) {
            src = new File(getContext().getCacheDir(), appPath);
        }
        if (!src.exists()) {
            call.reject("File is no longer on this phone");
            return;
        }

        try {
            Uri dest = writeToDownloads(src, filename, mime);
            JSObject ret = new JSObject();
            ret.put("ok", true);
            ret.put("uri", dest != null ? dest.toString() : "");
            call.resolve(ret);
        } catch (Exception e) {
            call.reject("Could not save that file. Try Share instead.");
        }
    }

    @PluginMethod
    public void fileExists(PluginCall call) {
        String appPath = call.getString("appPath");
        File src = new File(getContext().getFilesDir(), appPath == null ? "" : appPath);
        JSObject ret = new JSObject();
        ret.put("exists", src.exists());
        call.resolve(ret);
    }

    private void takePersistablePermission(Uri uri) {
        try {
            getContext().getContentResolver().takePersistableUriPermission(
                uri,
                Intent.FLAG_GRANT_READ_URI_PERMISSION
            );
        } catch (SecurityException ignored) {
            // Some providers (Gallery) do not allow persistable grants. The app copy still works.
        }
    }

    private JSObject copyUriIntoApp(Uri uri) throws Exception {
        ContentResolver resolver = getContext().getContentResolver();
        String name = queryDisplayName(uri);
        String mime = resolver.getType(uri);
        if (mime == null) {
            String ext = MimeTypeMap.getFileExtensionFromUrl(name);
            mime = MimeTypeMap.getSingleton().getMimeTypeFromExtension(ext);
        }
        if (mime == null) {
            mime = "application/octet-stream";
        }

        File inbox = new File(getContext().getFilesDir(), "inbox");
        if (!inbox.exists() && !inbox.mkdirs()) {
            throw new Exception("Could not create app folder");
        }
        String safe = name.replaceAll("[/\\\\?%*:|\"<>]", "-");
        File dest = new File(inbox, System.currentTimeMillis() + "-" + safe);

        try (InputStream in = resolver.openInputStream(uri);
             OutputStream out = new FileOutputStream(dest)) {
            if (in == null) {
                throw new Exception("Could not open that file. Try another file.");
            }
            byte[] buf = new byte[8192];
            int n;
            while ((n = in.read(buf)) != -1) {
                out.write(buf, 0, n);
            }
        }

        JSObject file = new JSObject();
        file.put("name", name);
        file.put("size", dest.length());
        file.put("mime", mime);
        file.put("appPath", "inbox/" + dest.getName());
        file.put("uri", uri.toString());
        return file;
    }

    private String queryDisplayName(Uri uri) {
        String fallback = "file";
        try (Cursor cursor = getContext().getContentResolver().query(
            uri, new String[]{OpenableColumns.DISPLAY_NAME}, null, null, null
        )) {
            if (cursor != null && cursor.moveToFirst()) {
                int idx = cursor.getColumnIndex(OpenableColumns.DISPLAY_NAME);
                if (idx >= 0) {
                    String value = cursor.getString(idx);
                    if (value != null && !value.isEmpty()) {
                        return value;
                    }
                }
            }
        } catch (Exception ignored) {
        }
        return fallback;
    }

    private Uri writeToDownloads(File src, String filename, String mime) throws Exception {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            ContentValues values = new ContentValues();
            values.put(MediaStore.Downloads.DISPLAY_NAME, filename);
            values.put(MediaStore.Downloads.MIME_TYPE, mime);
            values.put(MediaStore.Downloads.RELATIVE_PATH, Environment.DIRECTORY_DOWNLOADS + "/Convertify");
            values.put(MediaStore.Downloads.IS_PENDING, 1);
            Uri uri = getContext().getContentResolver().insert(
                MediaStore.Downloads.EXTERNAL_CONTENT_URI,
                values
            );
            if (uri == null) {
                throw new Exception("Could not save");
            }
            try (InputStream in = new FileInputStream(src);
                 OutputStream out = getContext().getContentResolver().openOutputStream(uri)) {
                if (out == null) {
                    throw new Exception("Could not save");
                }
                byte[] buf = new byte[8192];
                int n;
                while ((n = in.read(buf)) != -1) {
                    out.write(buf, 0, n);
                }
            }
            values.clear();
            values.put(MediaStore.Downloads.IS_PENDING, 0);
            getContext().getContentResolver().update(uri, values, null, null);
            return uri;
        }

        File dir = new File(Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS), "Convertify");
        if (!dir.exists() && !dir.mkdirs()) {
            throw new Exception("Could not save");
        }
        File dest = new File(dir, filename);
        try (InputStream in = new FileInputStream(src);
             OutputStream out = new FileOutputStream(dest)) {
            byte[] buf = new byte[8192];
            int n;
            while ((n = in.read(buf)) != -1) {
                out.write(buf, 0, n);
            }
        }
        return Uri.fromFile(dest);
    }
}
