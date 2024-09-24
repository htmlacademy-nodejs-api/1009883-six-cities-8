import got from 'got';
import { MockServerData } from '../../shared/types/index.js';
import { Command } from './command.interface.js';
import { TSVOfferGenerator } from '../../shared/libs/offer-generator/index.js';
import { getErrorMessage } from '../../shared/helpers/index.js';
import { TSVFileWriter } from '../../shared/libs/file-writer/index.js';

export class GenerateCommand implements Command {
  public readonly name: string = '--generate';
  private initialData: MockServerData;

  private async load(url: string) {
    try {
      this.initialData = await got.get(url).json();
    } catch {
      throw new Error(`Can't load data from ${url}`);
    }
  }

  private async write(filepath: string, count: number) {
    const tsvOfferGenerator = new TSVOfferGenerator(this.initialData);
    const tsvFileWriter = new TSVFileWriter(filepath);

    for (let i = 0; i < count; i++) {
      await tsvFileWriter.write(tsvOfferGenerator.generate());
    }
  }

  public async execute(...parameters: string[]): Promise<void> {
    const [countString, filepath, url] = parameters;

    if (!countString || !filepath || !url) {
      console.error(
        'One or more of three required arguments were not specified',
      );
      return;
    }

    const count = Number.parseInt(countString, 10);

    try {
      await this.load(url);
      await this.write(filepath, count);
      console.info(`File ${filepath} was created!`);
    } catch (error) {
      console.error("Can't generate data");

      console.error(getErrorMessage(error));
    }
  }
}
