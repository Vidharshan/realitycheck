package com.example.realitycheck

import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.provider.Settings
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.*
import androidx.compose.material3.Button
import androidx.compose.material3.Text
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            Column(modifier = Modifier.padding(32.dp)) {
                Text("RealityCheck AI Settings")
                
                Spacer(modifier = Modifier.height(16.dp))
                
                Button(onClick = {
                    if (!Settings.canDrawOverlays(this@MainActivity)) {
                        val intent = Intent(
                            Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
                            Uri.parse("package:$packageName")
                        )
                        startActivity(intent)
                    } else {
                        startService(Intent(this@MainActivity, OverlayService::class.java))
                    }
                }) {
                    Text("Enable Floating Guardian")
                }

                Spacer(modifier = Modifier.height(16.dp))
                
                Button(onClick = {
                    startActivity(Intent(Settings.ACTION_ACCESSIBILITY_SETTINGS))
                }) {
                    Text("Enable Screen Reading")
                }
            }
        }
    }
}
