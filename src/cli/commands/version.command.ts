import { readFileSync } from 'node:fs';
import { Command } from './command.interface.js';
import { resolve } from 'node:path';
import { getErrorMessage } from '../../shared/helpers/index.js';

type PackageJSONConfg = {
  version: string;
};

function isPackageJSONConfig(value: unknown): value is PackageJSONConfg {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    Object.hasOwn(value, 'version')
  );
}

export class VersionCommand implements Command {
  public readonly name: string = '--version';

  constructor(private readonly filePath: string = 'package.json') {}

  private readVersion(): string {
    const jsonContent = readFileSync(resolve(this.filePath), 'utf-8');
    const importedContent: unknown = JSON.parse(jsonContent);

    if (!isPackageJSONConfig(importedContent)) {
      throw new Error('Failed to parse json content.');
    }

    return importedContent.version;
  }

  public execute(..._parameters: string[]): void {
    try {
      const version = this.readVersion();
      console.info(version);
    } catch (error: unknown) {
      console.error(`Failed to read version from ${this.filePath}`);

      console.error(getErrorMessage(error));
    }
  }
}
