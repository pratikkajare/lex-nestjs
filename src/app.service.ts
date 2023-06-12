import * as AWS from 'aws-sdk';
import * as xlsx from 'xlsx';
import * as fs from 'fs';
import { BotConversation } from './entity';
import { v4 as uuidv4 } from 'uuid';

export class LexService {
  private lexRuntime: AWS.LexRuntimeV2;

  constructor() {
    AWS.config.update({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
    });

    this.lexRuntime = new AWS.LexRuntimeV2();
  }

  async postText(sessionId: string, text: string): Promise<BotConversation> {
    const params = {
      botId: 'Z0STCLZQWW',
      botAliasId: 'BJSBNSNF22',
      localeId: 'en_IN',
      sessionId: sessionId,
      sessionState: {},
      requestAttributes: {},
      text: text,
    };

    try {
      // const content = await this.lexRuntime.postContent().promise;
      const response = await this.lexRuntime.recognizeText(params).promise();
      // console.log(response);
      const {
        messages,
        sessionState,
        sessionId,
        requestAttributes,
        interpretations,
      } = response;
      if (
        messages[0].content == 'select a file or drag and drop here' ||
        messages[0].content ==
          'Please select a JPG/JPEG image with a size smaller than 2MB. Once selected, we will proceed to crop the image.'
      ) {
        messages[0].content == 'select a file or drag and drop here'
          ? (messages[0].contentType = 'Excel')
          : (messages[0].contentType = 'Image');
        return {
          messages,
          sessionState,
          sessionId,
          requestAttributes,
          interpretations,
        };
      }

      return { messages, sessionState, sessionId };
    } catch (error) {
      console.error('Error calling Amazon Lex:', error);
      throw error;
    }
  }

  convertExcelToJson(): void {
    const excelFilePath =
      'C:/Users/prati/OneDrive/Documents/Office/amazon-lex/src/path1/spreadsheet.xlsx';
    const jsonFilePath =
      'C:/Users/prati/OneDrive/Documents/Office/amazon-lex/src/path2/spreadsheet.json';

    const workbook = xlsx.readFile(excelFilePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // Convert the worksheet to JSON data
    const jsonData = xlsx.utils.sheet_to_json(worksheet, { header: 1 });

    // Extract the keys from the second row
    const keys = jsonData[1] as string[];

    // Upload photos and replace with photo URLs
    const result = [];
    for (let i = 2; i < jsonData.length; i++) {
      const row = jsonData[i];
      const obj = {};
      for (let j = 0; j < keys.length; j++) {
        const cellValue = row[j];
        if (typeof cellValue === 'string' && cellValue.startsWith('photo:')) {
          const photoPath = cellValue.substring(6); // Remove 'photo:' prefix
          const photoUrl = this.uploadPhotoToCloudStorage(photoPath); // Upload photo to cloud storage and get the public URL
          obj[keys[j]] = photoUrl; // Replace the photo data with the photo URL
        } else {
          obj[keys[j]] = cellValue; // Use the original cell value
        }
      }
      result.push(obj);
    }

    // Write the resulting JSON object to file
    fs.writeFileSync(jsonFilePath, JSON.stringify(result, null, 2));
    console.log('Excel file converted to JSON successfully!');
  }

  uploadPhotoToCloudStorage(photoPath: string): string {
    // Implement the logic to upload the photo to your cloud storage
    // Return the public URL of the uploaded photo
    console.log('calling', photoPath);

    const photoUrl = (uuidv4(), photoPath);
    return photoUrl;
  }
}
