import got from 'got';
import { MockServerData } from '../../shared/types/index.js';
import { Command } from './command.interface.js';
import { TSVOfferGenerator } from '../../shared/libs/offer-generator/index.js';
import { appendFile } from 'node:fs/promises';

export class GenerateCommand implements Command {
  private initialData!: MockServerData;

  private async load(url: string) {
    try {
      this.initialData = await got.get(url).json();
    } catch {
      throw new Error(`Can't load data from ${url}`);
    }
  }

  private async write(filepath: string, count: number) {
    const tsvOfferGenerator = new TSVOfferGenerator(this.initialData);
    for (let i = 0; i < count; i++) {
      await appendFile(filepath, `${tsvOfferGenerator.generate()}\n`, {
        encoding: 'utf-8',
      });
    }
  }

  public getName(): string {
    return '--generate';
  }

  public async execute(...parameters: string[]): Promise<void> {
    const [countString, filepath, url] = parameters;
    const count = Number.parseInt(countString, 10);

    try {
      await this.load(url);
      await this.write(filepath, count);
      console.info(`File ${filepath} was created!`);
    } catch (error) {
      console.error("Can't generate data");

      if (error instanceof Error) {
        console.error(error.message);
      }
    }
  }
}
