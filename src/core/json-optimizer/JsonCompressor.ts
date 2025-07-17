import { createReadStream, createWriteStream } from 'fs';
import { promisify } from 'util';
import { pipeline } from 'stream';
import { createGzip, createGunzip } from 'zlib';

const pipelineAsync = promisify(pipeline);

/**
 * JsonCompressor - Klasse für die Komprimierung von .ai.json Dateien
 * Implementiert Stream-basierte Verarbeitung und Binärformat
 */
export class JsonCompressor {
    /**
     * JSON-Datei in Binärformat komprimieren
     */
    async compress(inputPath: string, outputPath: string): Promise<void> {
        const readStream = createReadStream(inputPath);
        const writeStream = createWriteStream(outputPath);
        const gzip = createGzip();

        try {
            await pipelineAsync(
                readStream,
                gzip,
                writeStream
            );
        } catch (error) {
            throw new Error(`Komprimierung fehlgeschlagen: ${error.message}`);
        }
    }

    /**
     * Binärdatei wieder in JSON dekomprimieren
     */
    async decompress(inputPath: string, outputPath: string): Promise<void> {
        const readStream = createReadStream(inputPath);
        const writeStream = createWriteStream(outputPath);
        const gunzip = createGunzip();

        try {
            await pipelineAsync(
                readStream,
                gunzip,
                writeStream
            );
        } catch (error) {
            throw new Error(`Dekomprimierung fehlgeschlagen: ${error.message}`);
        }
    }
}
