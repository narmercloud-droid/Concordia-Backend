import Foundation

public class ConcordiaClient {
    public let baseUrl: URL
    public var token: String?

    public init(baseUrl: String = "https://api.concordia.app", token: String? = nil) {
        self.baseUrl = URL(string: baseUrl)!
        self.token = token
    }

    func request(path: String, method: String = "GET", body: Data? = nil, completion: @escaping (Data?, URLResponse?, Error?) -> Void) {
        var req = URLRequest(url: baseUrl.appendingPathComponent(path))
        req.httpMethod = method
        if let t = token { req.setValue("Bearer \(t)", forHTTPHeaderField: "Authorization") }
        if let b = body { req.httpBody = b; req.setValue("application/json", forHTTPHeaderField: "Content-Type") }
        URLSession.shared.dataTask(with: req, completionHandler: completion).resume()
    }
}
