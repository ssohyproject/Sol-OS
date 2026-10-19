import Foundation
import Vision
import AppKit

guard CommandLine.arguments.count > 1 else {
    print(JSONSerialization.isValidJSONObject([]) ? "[]" : "[]")
    exit(1)
}

let imagePath = CommandLine.arguments[1]
let imageURL = URL(fileURLWithPath: imagePath)

guard let image = NSImage(contentsOf: imageURL),
      let tiffData = image.tiffRepresentation,
      let bitmapImage = NSBitmapImageRep(data: tiffData),
      let cgImage = bitmapImage.cgImage else {
    fputs("Failed to load image: \(imagePath)\n", stderr)
    exit(1)
}

var recognizedLines: [String] = []

let request = VNRecognizeTextRequest { (request, error) in
    guard let observations = request.results as? [VNRecognizedTextObservation] else { return }
    for observation in observations {
        if let topCandidate = observation.topCandidates(1).first {
            let str = topCandidate.string.trimmingCharacters(in: .whitespacesAndNewlines)
            if !str.isEmpty {
                recognizedLines.append(str)
            }
        }
    }
}
request.recognitionLevel = .accurate
request.recognitionLanguages = ["ko-KR", "en-US"]
request.usesLanguageCorrection = true

let handler = VNImageRequestHandler(cgImage: cgImage, options: [:])
do {
    try handler.perform([request])
    if let jsonData = try? JSONSerialization.data(withJSONObject: recognizedLines, options: []),
       let jsonString = String(data: jsonData, encoding: .utf8) {
        print(jsonString)
    } else {
        print("[]")
    }
} catch {
    fputs("OCR Error: \(error)\n", stderr)
    print("[]")
}
