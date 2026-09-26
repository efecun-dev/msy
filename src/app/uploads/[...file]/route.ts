import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ file: string[] }> }
) {
  const { file } = await params;
  
  if (!file || file.length === 0) {
    return new NextResponse("Not Found", { status: 404 });
  }

  // Güvenlik: Sadece public/uploads içindeki dosyalara izin ver, üst dizinlere çıkmayı engelle
  const fileName = file.join("/");
  const safePath = path.normalize(fileName).replace(/^(\.\.(\/|\\|$))+/, "");
  const filePath = path.join(process.cwd(), "public", "uploads", safePath);

  try {
    if (!fs.existsSync(filePath)) {
      return new NextResponse("File Not Found", { status: 404 });
    }

    const fileBuffer = fs.readFileSync(filePath);
    
    // Basit MIME tipi tespiti
    const ext = path.extname(filePath).toLowerCase();
    let contentType = "application/octet-stream";
    if (ext === ".jpg" || ext === ".jpeg") contentType = "image/jpeg";
    else if (ext === ".png") contentType = "image/png";
    else if (ext === ".gif") contentType = "image/gif";
    else if (ext === ".webp") contentType = "image/webp";
    else if (ext === ".svg") contentType = "image/svg+xml";

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Error serving file:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
