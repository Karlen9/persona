// Cuts the subject out of the magazine-cover photo and writes an RGBA PNG with a transparent background.
//
// Usage:
//   swift scripts/make-cover-cutout.swift public/images/cover.png public/images/cover-cutout.png
//
// Why: the home page lets the figure stand in front of the masthead letters, which needs a real alpha channel.
// Uses the macOS Vision foreground-instance mask (macOS 14+), so it only runs on a Mac; the PNG is committed.
// The PNG is an intermediate: run scripts/compress-cover-cutout.ts on it to get the cover-cutout.webp the site serves
// (the PNG is not committed). The output keeps the input dimensions (the mask is not cropped to the subject).

import CoreImage
import Foundation
import Vision

func fail(_ message: String) -> Never {
	FileHandle.standardError.write(Data((message + "\n").utf8))
	exit(1)
}

let args = CommandLine.arguments
guard args.count == 3 else { fail("usage: swift make-cover-cutout.swift <input.png> <output.png>") }

let inputURL = URL(fileURLWithPath: args[1])
let outputURL = URL(fileURLWithPath: args[2])

guard let input = CIImage(contentsOf: inputURL) else { fail("cannot read \(inputURL.path)") }

let handler = VNImageRequestHandler(ciImage: input, options: [:])
let request = VNGenerateForegroundInstanceMaskRequest()

do {
	try handler.perform([request])
} catch {
	fail("vision request failed: \(error)")
}

guard let result = request.results?.first, !result.allInstances.isEmpty else { fail("no foreground subject found") }

let masked: CVPixelBuffer
do {
	masked = try result.generateMaskedImage(
		ofInstances: result.allInstances,
		from: handler,
		croppedToInstancesExtent: false
	)
} catch {
	fail("cannot generate masked image: \(error)")
}

let output = CIImage(cvPixelBuffer: masked)
let context = CIContext()
guard let colorSpace = CGColorSpace(name: CGColorSpace.sRGB) else { fail("no sRGB color space") }

do {
	try context.writePNGRepresentation(
		of: output,
		to: outputURL,
		format: .RGBA8,
		colorSpace: colorSpace,
		options: [:]
	)
} catch {
	fail("cannot write \(outputURL.path): \(error)")
}

print("wrote \(outputURL.path) (\(Int(output.extent.width))x\(Int(output.extent.height)))")
