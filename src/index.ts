// @ts-ignore
import slash from 'slash2';
import fs from 'fs-extra';

import { LocDir } from './directory';
import { LocFile, LineInfo } from './file';

const loc = async (
  fileOrDir: string,
): Promise<{
  info: LineInfo;
  files: string[];
  languages: {
    [key: string]: LineInfo & {
      sum: number;
    };
  };
}> => {
  const stat = await fs.stat(slash(fileOrDir));
  if (stat.isFile()) {
    const locFile = new LocFile(slash(fileOrDir));
    const info = await locFile.getFileInfo();
    const filePath = locFile.getPath();
    return {
      info: info.lines,
      files: [filePath],
      languages: { [info.languages]: { ...info.lines, sum: 1 } },
    };
  }
  const locDir = new LocDir(slash(fileOrDir));
  return locDir.loadInfo();
};

loc.locDir = LocDir;
loc.locFile = LocFile;

module.exports = loc;

export default loc;
