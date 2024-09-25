import { getErrorMessage } from '../../shared/helpers/index.js';
import { TSVOfferFileReader } from '../../shared/libs/file-reader/index.js';
import { Offer } from '../../shared/types/entities/index.js';
import { Command } from './command.interface.js';

export class ImportCommand implements Command {
  public readonly name: string = '--import';

  private onImportedOffer(offer: Offer): void {
    console.info(offer);
  }

  private onCompleteImport(count: number): void {
    console.info(`${count} rows imported.`);
  }

  public async execute(...parameters: string[]): Promise<void> {
    const [filename] = parameters;

    if (!filename) {
      console.error(`No filename was specified`);
      return;
    }

    const fileReader = new TSVOfferFileReader(filename.trim());

    fileReader.on('line', this.onImportedOffer);
    fileReader.on('end', this.onCompleteImport);

    try {
      await fileReader.read();
    } catch (error) {
      console.error(`Can't import data from file: ${filename}`);
      console.error(getErrorMessage(error));
    }
  }
}
