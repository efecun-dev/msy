"use server";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

async function checkAuth() {
  const session = await getServerSession(authOptions);
  if (!session) {
    throw new Error("Yetkisiz erişim");
  }
  return session;
}

export async function checkForUpdates() {
  await checkAuth();

  try {
    // 1. Git pull yap
    const { stdout: pullOutput, stderr: pullError } = await execAsync("git pull");

    // Zaten güncel mi kontrol et
    if (pullOutput.includes("Already up to date") || pullOutput.includes("Güncel")) {
      return {
        status: "up_to_date",
        message: "Sistem zaten en güncel sürümde çalışıyor.",
        logs: pullOutput
      };
    }

    // 2. Güncelleme varsa bağımlılıkları kontrol et ve build al
    // Not: Bu işlem biraz uzun sürebilir.
    const { stdout: buildOutput, stderr: buildError } = await execAsync("npm install --include=dev && npm run build");

    // 3. PM2 restart işlemini 2 saniye sonra başlat (istemciye cevap döndükten sonra)
    setTimeout(() => {
      exec("pm2 restart msy-app", (err, stdout, stderr) => {
        if (err) {
          console.error("PM2 restart hatası:", err);
        }
      });
    }, 2000);

    return {
      status: "updated",
      message: "Güncelleme başarıyla çekildi ve derlendi. Sunucu şimdi yeniden başlatılıyor...",
      logs: pullOutput + "\n" + buildOutput
    };
  } catch (error: any) {
    console.error("Güncelleme hatası:", error);
    return {
      status: "error",
      message: "Güncelleme sırasında bir hata oluştu: " + (error.message || String(error)),
    };
  }
}


import os from "os";
import fs from "fs";
import path from "path";

export async function getSystemInfo() {
  await checkAuth();
  
  // Get Next.js version
  let nextVersion = "Bilinmiyor";
  try {
    const pkgPath = path.join(process.cwd(), "package.json");
    const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
    nextVersion = pkg.dependencies.next || pkg.devDependencies.next || "Bilinmiyor";
  } catch(e) {}

  const cpus = os.cpus();
  const cpuModel = cpus.length > 0 ? cpus[0].model : "Bilinmeyen CPU";
  
  // Get Disk info using Node's fs.promises.statfs
  let totalDisk = 0;
  let freeDisk = 0;
  try {
    const stats = await fs.promises.statfs(process.cwd());
    totalDisk = stats.bsize * stats.blocks;
    freeDisk = stats.bsize * stats.bavail; // bavail is available blocks for unprivileged users
  } catch (e) {
    console.error("Disk stat hatası:", e);
  }

  // Get Git Commit Version
  let appVersion = "v0.1.0 (Beta)";
  try {
    const { stdout } = await execAsync("git log -1 --format='%h (%ar)'");
    if (stdout) {
      appVersion = stdout.trim();
    }
  } catch (e) {
    console.error("Git log hatası:", e);
  }

  return {
    cpuModel,
    cpuCores: cpus.length,
    totalMem: os.totalmem(),
    freeMem: os.freemem(),
    totalDisk,
    freeDisk,
    uptime: os.uptime(),
    env: process.env.NODE_ENV || "development",
    nextVersion,
    appVersion
  };
}

