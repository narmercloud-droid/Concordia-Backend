using System;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace ConcordiaAdminSdk
{
    public class ConcordiaAdminClient
    {
        private readonly HttpClient _http;

        public ConcordiaAdminClient(string baseUrl, string? token = null)
        {
            _http = new HttpClient { BaseAddress = new Uri(baseUrl) };
            if (!string.IsNullOrEmpty(token)) _http.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token);
        }

        public async Task<string> adminAuthLoginAsync(object payload)
        {
            var json = System.Text.Json.JsonSerializer.Serialize(payload);
            var res = await _http.PostAsync("/api/admin/auth/login", new StringContent(json, Encoding.UTF8, "application/json"));
            res.EnsureSuccessStatusCode();
            return await res.Content.ReadAsStringAsync();
        }
    }
}
