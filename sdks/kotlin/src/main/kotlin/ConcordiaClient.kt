package concordia

import io.ktor.client.*
import io.ktor.client.request.*
import io.ktor.client.statement.*

class ConcordiaClient(private val baseUrl: String = "https://api.concordia.app", private val token: String? = null) {
    private val client = HttpClient()

    suspend fun adminLogin(payload: Map<String, Any>): String {
        return client.post("$baseUrl/api/auth/login") { 
            // simple example; real implementation should set body and headers
        }.bodyAsText()
    }
}
