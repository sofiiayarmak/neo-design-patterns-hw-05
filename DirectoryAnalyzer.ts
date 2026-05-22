import * as fs from "fs";
import * as path from "path";
import { DirectoryReport } from "./DirectoryReport";

export class DirectoryAnalyzer {
  analyze(dirPath: string): DirectoryReport {
    const report: DirectoryReport = {
      files: 0,
      directories: 0,
      totalSize: 0,
      extensions: {},
    };

    this.traverse(dirPath, report);
    return report;
  }

  private traverse(currentPath: string, report: DirectoryReport): void {
    const entries = fs.readdirSync(currentPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentPath, entry.name);

      if (entry.isDirectory()) {
        report.directories++;
        this.traverse(fullPath, report);
      } else if (entry.isFile()) {
        report.files++;
        const stat = fs.statSync(fullPath);
        report.totalSize += stat.size;
        const ext = path.extname(entry.name) || "(no extension)";
        report.extensions[ext] = (report.extensions[ext] || 0) + 1;
      }
    }
  }
}
