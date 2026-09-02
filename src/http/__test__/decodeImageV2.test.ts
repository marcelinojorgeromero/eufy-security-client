import { buildJpegPrefix } from "../decodeImageV2";

describe("buildJpegPrefix", () => {
  it("keeps the default quantization tables stable", () => {
    const original = buildJpegPrefix(288, 176);
    const explicitDefault = buildJpegPrefix(288, 176, "4:2:0", 1);

    expect(explicitDefault).toEqual(original);
    expect(original.readUInt16BE(163)).toBe(176);
    expect(original.readUInt16BE(165)).toBe(288);
    expect(original[169]).toBe(0x22);
  });

  it("scales only quantization values and clamps them to JPEG limits", () => {
    const original = buildJpegPrefix(640, 480, "4:4:4");
    const scaled = buildJpegPrefix(640, 480, "4:4:4", 100);

    expect(scaled.readUInt16BE(163)).toBe(480);
    expect(scaled.readUInt16BE(165)).toBe(640);
    expect(scaled[169]).toBe(0x11);
    expect(scaled[25]).toBe(255);
    expect(scaled[94]).toBe(255);
    expect(scaled.subarray(0, 25)).toEqual(original.subarray(0, 25));
    expect(scaled.subarray(89, 94)).toEqual(original.subarray(89, 94));
    expect(scaled.subarray(158)).toEqual(original.subarray(158));
  });
});
