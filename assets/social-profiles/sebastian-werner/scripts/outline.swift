import Foundation
import CoreText
import CoreGraphics
let root = URL(fileURLWithPath: FileManager.default.currentDirectoryPath)
let config = try JSONSerialization.jsonObject(with: Data(contentsOf: root.appendingPathComponent("design.json"))) as! [String: Any]
for item in config["text"] as! [[String: String]] {
let text = item["text"]!
let configuredPath = item["fontPath"]!
let fontPath = (configuredPath as NSString).expandingTildeInPath
guard let provider = CGDataProvider(url: URL(fileURLWithPath: fontPath) as CFURL), let graphicsFont = CGFont(provider) else {
    fatalError("Font unavailable at \(fontPath). Update fontPath in design.json or install the font locally.")
}
let font = CTFontCreateWithGraphicsFont(graphicsFont, 1000, nil, nil)
let actualFont = CTFontCopyPostScriptName(font) as String
if actualFont != item["font"]! { fatalError("Unexpected font: \(actualFont)") }
let line = CTLineCreateWithAttributedString(NSAttributedString(string: text, attributes: [NSAttributedString.Key(kCTFontAttributeName as String): font]))
func n(_ v: CGFloat) -> String { String(format: "%.4f", locale: Locale(identifier: "en_US_POSIX"), Double(v)) }
var data = ""
var bounds = CGRect.null
for object in CTLineGetGlyphRuns(line) as NSArray {
    let run = object as! CTRun
    let count = CTRunGetGlyphCount(run)
    var glyphs = [CGGlyph](repeating: 0, count: count)
    var positions = [CGPoint](repeating: .zero, count: count)
    CTRunGetGlyphs(run, CFRange(location: 0, length: count), &glyphs)
    CTRunGetPositions(run, CFRange(location: 0, length: count), &positions)
    let runFont = (CTRunGetAttributes(run) as NSDictionary)[kCTFontAttributeName] as! CTFont
    for i in 0..<count {
        guard let path = CTFontCreatePathForGlyph(runFont, glyphs[i], nil) else { continue }
        var translation = CGAffineTransform(translationX: positions[i].x, y: positions[i].y)
        let moved = path.copy(using: &translation)!
        bounds = bounds.union(moved.boundingBoxOfPath)
        moved.applyWithBlock { element in
            let e = element.pointee
            switch e.type {
            case .moveToPoint: data += "M\(n(e.points[0].x)) \(n(e.points[0].y))"
            case .addLineToPoint: data += "L\(n(e.points[0].x)) \(n(e.points[0].y))"
            case .addQuadCurveToPoint: data += "Q\(n(e.points[0].x)) \(n(e.points[0].y)) \(n(e.points[1].x)) \(n(e.points[1].y))"
            case .addCurveToPoint: data += "C\(n(e.points[0].x)) \(n(e.points[0].y)) \(n(e.points[1].x)) \(n(e.points[1].y)) \(n(e.points[2].x)) \(n(e.points[2].y))"
            case .closeSubpath: data += "Z"
            @unknown default: fatalError("Unsupported path element")
            }
        }
    }
}
let output: [String: Any] = ["text": text, "font": actualFont, "unitsPerEm": 1000, "advance": CTLineGetTypographicBounds(line, nil, nil, nil), "bounds": [bounds.minX, bounds.minY, bounds.maxX, bounds.maxY], "path": data]
try JSONSerialization.data(withJSONObject: output, options: [.prettyPrinted, .sortedKeys]).write(to: root.appendingPathComponent("sources/\(item["id"]!).outlines.json"))
print("Outlined \(item["id"]!) with \(actualFont)")
}
