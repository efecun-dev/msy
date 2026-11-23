"use server";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);
const EXEC_OPTIONS = { maxBuffer: 10 * 1024 * 1024 }; // 10MB

function formatExecError(error: unknown): string {
  if (error && typeof error === "object") {
    const err = error as { stderr?: string; message?: string };
    const raw = (err.stderr || err.message || "Bilinmeyen hata").trim();
    return raw.length > 400 ? raw.slice(-400) : raw;
  }
  return "Bilinmeyen hata";
}

async function checkAuth() {
  const session = await getServerSession(authOptions);
  if (!session) {
    throw new Error("Yetkisiz erişim");
  }
  return session;
}

export async function checkUpdateStatus() {
  try {
    await checkAuth();
    await execAsync("git fetch", EXEC_OPTIONS);
    const { stdout } = await execAsync("git status -uno", EXEC_OPTIONS);
    if (stdout.includes("Your branch is behind") || stdout.includes("git pull")) {
      return { success: true as const, hasUpdate: true, message: "Yeni bir güncelleme bulundu!" };
    }
    return { success: true as const, hasUpdate: false, message: "Sistem zaten en güncel sürümde." };
  } catch (error: unknown) {
    console.error("Güncelleme kontrolü başarısız:", error);
    return {
      success: false as const,
      hasUpdate: false,
      message: "",
      error: "Güncelleme kontrolü başarısız: " + formatExecError(error),
    };
  }
}

export async function pullUpdate() {
  try {
    await checkAuth();
    // Sunucuda npm install sonrası değişebilen lockfile'ı temizle ki git pull çakışmasın
    await execAsync("git checkout -- package-lock.json", EXEC_OPTIONS).catch(() => {});
    const { stdout } = await execAsync("git pull", EXEC_OPTIONS);
    return { success: true as const, message: "Güncellemeler başarıyla indirildi.", logs: stdout };
  } catch (error: unknown) {
    console.error("Güncelleme çekilirken hata oluştu:", error);
    return {
      success: false as const,
      error: "Güncelleme çekilirken hata oluştu: " + formatExecError(error),
    };
  }
}

export async function buildUpdate() {
  try {
    await checkAuth();
    const { stdout } = await execAsync("npm install --include=dev && npm run build", EXEC_OPTIONS);
    await execAsync("git checkout -- package-lock.json", EXEC_OPTIONS).catch(() => {});
    return { success: true as const, message: "Sistem başarıyla derlendi ve hazırlandı.", logs: stdout };
  } catch (error: unknown) {
    console.error("Derleme sırasında hata oluştu:", error);
    return {
      success: false as const,
      error: "Derleme sırasında hata oluştu: " + formatExecError(error),
    };
  }
}

export async function restartApp() {
  try {
    await checkAuth();
    // Restart PM2 asynchronously so it doesn't kill the current request immediately
    setTimeout(() => {
      exec("pm2 restart msy-app", (err) => {
        if (err) console.error("PM2 restart hatası:", err);
      });
    }, 1500);
    return { success: true as const, message: "Sunucu yeniden başlatılıyor..." };
  } catch (error: unknown) {
    console.error("Yeniden başlatma başarısız:", error);
    return {
      success: false as const,
      error: "Yeniden başlatma başarısız: " + formatExecError(error),
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
  let appVersion = "v1.0.0";
  try {
    const { stdout } = await execAsync('git log --format="%s"');
    if (stdout) {
      const commits = stdout.trim().split('\n');
      
      let major = 1;
      let minor = 0;
      let patch = 0;

      for (const msg of commits.reverse()) {
        const lowerMsg = msg.toLowerCase();
        
        if (lowerMsg.includes("initial commit")) {
          continue;
        }

        if (lowerMsg.includes("major") || lowerMsg.includes("breaking")) {
          major++;
          minor = 0;
          patch = 0;
        } else if (
          lowerMsg.includes("feat") || 
          lowerMsg.includes("add") || 
          lowerMsg.includes("ekle") || 
          lowerMsg.includes("yeni") ||
          lowerMsg.includes("update") ||
          lowerMsg.includes("oluşturma")
        ) {
          minor++;
          patch = 0;
        } else {
          patch++;
        }
      }

      appVersion = `v${major}.${minor}.${patch}`;
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

