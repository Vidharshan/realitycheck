package com.example.realitycheck

import android.accessibilityservice.AccessibilityService
import android.view.accessibility.AccessibilityEvent
import android.view.accessibility.AccessibilityNodeInfo

class ScreenReaderService : AccessibilityService() {

    companion object {
        var currentScreenText: String = ""
    }

    override fun onAccessibilityEvent(event: AccessibilityEvent?) {
        val rootNode = rootInActiveWindow ?: return
        val extractedText = StringBuilder()
        traverseNode(rootNode, extractedText)
        currentScreenText = extractedText.toString()
    }

    private fun traverseNode(node: AccessibilityNodeInfo, builder: StringBuilder) {
        if (node.text != null) {
            builder.append(node.text).append("\n")
        }
        for (i in 0 until node.childCount) {
            val child = node.getChild(i)
            if (child != null) {
                traverseNode(child, builder)
                child.recycle()
            }
        }
    }

    override fun onInterrupt() {}
}
