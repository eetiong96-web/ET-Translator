LOCAL_PATH := $(call my-dir)

include $(CLEAR_VARS)

LOCAL_MODULE := etqwen
LOCAL_SRC_FILES := qwen_bridge.cpp
LOCAL_CPPFLAGS := -std=c++17 -Wall -Wextra

include $(BUILD_SHARED_LIBRARY)
