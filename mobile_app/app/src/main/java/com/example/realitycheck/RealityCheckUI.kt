package com.example.realitycheck

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp

@Composable
fun RealityCheckOverlayUI(onAnalyzeClick: () -> Unit) {
    var isExpanded by remember { mutableStateOf(false) }

    Box(modifier = Modifier.padding(16.dp)) {
        if (!isExpanded) {
            Box(
                modifier = Modifier
                    .size(60.dp)
                    .clip(CircleShape)
                    .background(Color(0xFF1E1E1E))
                    .clickable { 
                        isExpanded = true
                        onAnalyzeClick()
                    },
                contentAlignment = Alignment.Center
            ) {
                Text("✨", style = MaterialTheme.typography.headlineSmall)
            }
        } else {
            Card(
                modifier = Modifier
                    .width(320.dp)
                    .wrapContentHeight(),
                shape = RoundedCornerShape(24.dp),
                colors = CardDefaults.cardColors(containerColor = Color(0xFF111111))
            ) {
                Column(modifier = Modifier.padding(20.dp)) {
                    Row(
                        horizontalArrangement = Arrangement.SpaceBetween,
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Text("RealityCheck", color = Color.White)
                        Text("✕", color = Color.Gray, modifier = Modifier.clickable { isExpanded = false })
                    }
                    Spacer(modifier = Modifier.height(16.dp))
                    Text("Reality Score: 42", color = Color(0xFFFF5252), style = MaterialTheme.typography.headlineMedium)
                    Text("Low Trust", color = Color.Gray)
                    Spacer(modifier = Modifier.height(16.dp))
                    Text("Available evidence suggests this claim is not supported. It contains fear amplification and cherry-picked statistics.", color = Color.White)
                }
            }
        }
    }
}

fun analyzeContent(text: String) {
    println("Sending to backend: $text")
}
