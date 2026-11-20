const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

// Resolve output path to Desktop. Check standard paths and parent directory
const parentDir = path.dirname(process.cwd());
const isParentDesktop = path.basename(parentDir).toLowerCase() === 'desktop';
const desktopPath = path.join(os.homedir(), 'Desktop');

const zipPath = isParentDesktop
  ? path.join(parentDir, 'atcnn_deploy.zip')
  : (fs.existsSync(desktopPath) ? path.join(desktopPath, 'atcnn_deploy.zip') : path.join(process.cwd(), 'atcnn_deploy.zip'));

console.log(`Packaging project files to: ${zipPath}...`);

const includeFolders = ['src', 'public', 'prisma', 'scripts', 'backups'];
const includeFiles = [
  'package.json',
  'pnpm-lock.yaml',
  'pnpm-workspace.yaml',
  '.gitignore',
  '.env.production-template',
  'server.js',
  'next.config.mjs',
  'tsconfig.json',
  'postcss.config.mjs',
  'README.md',
  'project_report.md'
];

// Clean up existing zip if present
if (fs.existsSync(zipPath)) {
  try { fs.unlinkSync(zipPath); } catch (e) {}
}

let packed = false;

// Strategy 1: PowerShell on Windows (fastest & native)
if (process.platform === 'win32') {
  try {
    const stagingDir = path.join(os.tmpdir(), `atcnn_pack_${Date.now()}`);
    fs.mkdirSync(stagingDir, { recursive: true });

    // Copy include files
    for (const file of includeFiles) {
      const src = path.join(process.cwd(), file);
      if (fs.existsSync(src)) {
        fs.copyFileSync(src, path.join(stagingDir, file));
      }
    }

    // Copy include folders recursively (excluding node_modules, .next, etc.)
    const excludeDirs = new Set(['node_modules', '.next', '.git', 'scratch']);
    function copyFolderRecursive(src, dest) {
      if (!fs.existsSync(src)) return;
      fs.mkdirSync(dest, { recursive: true });
      for (const item of fs.readdirSync(src, { withFileTypes: true })) {
        if (excludeDirs.has(item.name)) continue;
        const srcPath = path.join(src, item.name);
        const destPath = path.join(dest, item.name);
        if (item.isDirectory()) {
          copyFolderRecursive(srcPath, destPath);
        } else if (item.isFile()) {
          fs.copyFileSync(srcPath, destPath);
        }
      }
    }

    for (const folder of includeFolders) {
      copyFolderRecursive(path.join(process.cwd(), folder), path.join(stagingDir, folder));
    }

    // Run Compress-Archive via powershell
    const psCmd = `powershell -NoProfile -Command "Compress-Archive -Path '${stagingDir}\\*' -DestinationPath '${zipPath}' -Force"`;
    execSync(psCmd, { stdio: 'inherit' });

    // Clean up staging directory
    fs.rmSync(stagingDir, { recursive: true, force: true });
    packed = true;
    console.log(`ZIP archive created successfully at: ${zipPath}`);
  } catch (err) {
    console.warn("PowerShell compression attempt failed:", err.message);
  }
}

// Strategy 2: Python fallback
if (!packed) {
  const pythonScript = `
import zipfile
import os

zip_path = r"${zipPath.replace(/\\/g, '\\\\')}"
src_dir = os.getcwd()
include_folders = ['src', 'public', 'prisma', 'scripts', 'backups']
include_files = [
    'package.json', 'pnpm-lock.yaml', 'pnpm-workspace.yaml',
    '.gitignore', '.env.production-template', 'server.js',
    'next.config.mjs', 'tsconfig.json', 'postcss.config.mjs',
    'README.md', 'project_report.md'
]
exclude_extensions = ['.db', '.log', '.zip', '.local', '.sqlite']
exclude_dirs = {'node_modules', '.next', '.git', 'scratch'}

with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zout:
    for f in include_files:
        p = os.path.join(src_dir, f)
        if os.path.exists(p):
            zout.write(p, f)
    for folder in include_folders:
        for root, dirs, files in os.walk(os.path.join(src_dir, folder)):
            dirs[:] = [d for d in dirs if d not in exclude_dirs]
            for file in files:
                ext = os.path.splitext(file)[1]
                if ext in exclude_extensions or file.startswith('.env'):
                    continue
                full_path = os.path.join(root, file)
                rel_path = os.path.relpath(full_path, src_dir)
                zout.write(full_path, rel_path)
print("ZIP archive created successfully!")
`;
  const tempPyFile = path.join(process.cwd(), 'temp_pack.py');
  fs.writeFileSync(tempPyFile, pythonScript);
  for (const cmd of ['python', 'python3', 'py']) {
    try {
      execSync(`${cmd} temp_pack.py`, { stdio: 'inherit' });
      packed = true;
      break;
    } catch (e) {}
  }
  if (fs.existsSync(tempPyFile)) fs.unlinkSync(tempPyFile);
}

// Strategy 3: Linux / macOS native zip
if (!packed) {
  try {
    execSync(`zip -r "${zipPath}" src public prisma scripts backups package.json pnpm-lock.yaml pnpm-workspace.yaml server.js next.config.mjs tsconfig.json postcss.config.mjs README.md -x "**/node_modules/*" "**/.next/*" "**/.git/*"`, { stdio: 'inherit' });
    packed = true;
    console.log(`ZIP archive created successfully at: ${zipPath}`);
  } catch (e) {}
}

if (!packed) {
  console.error("Failed to generate ZIP archive across all compression methods.");
  process.exit(1);
}
