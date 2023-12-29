[TOC]

# Android 软键盘的显示和隐藏

## 核心方法

**显示软键盘：**

```
InputMethodManager#showSoftInput(View view, int flags)
```

**隐藏软键盘：**

```
InputMethodManager#hideSoftInputFromWindow(IBinder windowToken, int flags)
```

**flags操作标志：**

| flags              | 0    | SHOW_IMPLICIT | SHOW_FORCED |
| ------------------ | ---- | ------------- | ----------- |
| 0                  | Y    | Y             | Y           |
| HIDE_IMPLICIT_ONLY | N    | Y             | N           |
| HIDE_NOT_ALWAYS    | Y    | Y             | N           |

**先弹出软键盘，再隐藏软键盘，Y 表示软键盘隐藏，N 表示软件不能隐藏。**

SHOW_IMPLICIT：隐式弹窗键盘，表示弹出键盘不是由用户直接发起的，键盘可能不会弹出。

SHOW_FORCED：强制弹出键盘，表示弹出键盘是用户直接发起的，在用户请求收起键盘前，软键盘会一直显示。

HIDE_IMPLICIT_ONLY：只有通过 SHOW_IMPLICIT 弹出的键盘才能被隐藏。

HIDE_NOT_ALWAYS：表示只要不是通过 SHOW_FORCED 弹出的键盘都会被隐藏。

调用 SHOW_FORCED 可以保证软键盘一定会弹出，调用 0 可以保证软键盘一定会隐藏。

也可以简单粗暴的将两个方法中的 flag 都设为 0。 



## 软键盘工具类

```java
/**
 * 软键盘工具类
 */
public class KeyboardUtils {

    /**
     * 显示软键盘
     *
     * @param editText
     */
    public static void showSoftInput(EditText editText) {
        if (editText == null)
            return;
        InputMethodManager imm = (InputMethodManager) BaseApplication.getInstance().getSystemService(Context.INPUT_METHOD_SERVICE);
        if (imm == null)
            return;
        editText.setFocusable(true);
        editText.setFocusableInTouchMode(true);
        editText.requestFocus();
        imm.showSoftInput(editText, 0);
    }

    /**
     * 隐藏软键盘
     *
     * @param view
     */
    public static void hideSoftInput(View view) {
        if (view == null)
            return;
        InputMethodManager inputMethodManager = (InputMethodManager) BaseApplication.getInstance().getSystemService(Context.INPUT_METHOD_SERVICE);
        if (inputMethodManager == null)
            return;
        inputMethodManager.hideSoftInputFromWindow(view.getWindowToken(), 0);
    }

    /**
     * 隐藏软键盘
     *
     * @param editText
     */
    public static void hideSoftInput(EditText editText) {
        if (editText == null)
            return;
        InputMethodManager inputMethodManager = (InputMethodManager) BaseApplication.getInstance().getSystemService(Context.INPUT_METHOD_SERVICE);
        if (inputMethodManager == null)
            return;
        editText.clearFocus();
        inputMethodManager.hideSoftInputFromWindow(editText.getWindowToken(), 0);
    }

    /**
     * 隐藏软键盘
     *
     * @param activity
     */
    public static void hideSoftInput(Activity activity) {
        Window window = activity.getWindow();
        View view = window.getCurrentFocus();
        if (view == null) {
            view = window.getDecorView();
        }
        hideSoftInput(view);
    }

    /**
     * 软键盘切换
     */
    public static void toggleSoftInput() {
        InputMethodManager imm = (InputMethodManager) BaseApplication.getInstance().getSystemService(Context.INPUT_METHOD_SERVICE);
        if (imm == null)
            return;
        imm.toggleSoftInput(0, 0);
    }

}
```



## 点击空白区域隐藏软键盘

### 方式一

```java
public class BaseActivity extends AppCompatActivity {

    @Override
    public boolean onTouchEvent(MotionEvent event) {
        if (getCurrentFocus() != null) {
            InputMethodManager mInputMethodManager = (InputMethodManager) getSystemService(INPUT_METHOD_SERVICE);
            if (mInputMethodManager != null) {
                return mInputMethodManager.hideSoftInputFromWindow(getCurrentFocus().getWindowToken(), 0);
            }
        }
        return super.onTouchEvent(event);
    }
}
```
### 方式二

```java
public class BaseActivity extends AppCompatActivity {

//    @Override
//    public boolean onTouchEvent(MotionEvent event) {
//        if (getCurrentFocus() != null) {
//            InputMethodManager mInputMethodManager = (InputMethodManager) getSystemService(INPUT_METHOD_SERVICE);
//            if (mInputMethodManager != null) {
//                return mInputMethodManager.hideSoftInputFromWindow(getCurrentFocus().getWindowToken(), 0);
//            }
//        }
//        return super.onTouchEvent(event);
//    }


    @Override
    public boolean dispatchTouchEvent(MotionEvent ev) {
        if (ev.getAction() == MotionEvent.ACTION_DOWN) {
            View view = getCurrentFocus();
            if (isShouldHideKeyboard(view, ev)) {
                KeyboardUtils.hideSoftInput(view);
            }
        }
        return super.dispatchTouchEvent(ev);
    }

    /**
     * 是否隐藏软键盘
     */
    private boolean isShouldHideKeyboard(View v, MotionEvent event) {
        if (v != null && v instanceof EditText) {
            int[] location = {0, 0};
            v.getLocationInWindow(location);
            int left = location[0];
            int top = location[1];
            int right = left + v.getWidth();
            int bottom = top + v.getHeight();
            return !(event.getX() > left && event.getY() < right && event.getY() > top && event.getY() < bottom);
        }
        return false;
    }
}
```


